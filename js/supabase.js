/**
 * GESTOR DE BASE DE DATOS Y CONEXIÓN SUPABASE
 * 
 * Este módulo administra la conexión con Supabase (o el almacenamiento LocalStorage 
 * como fallback automático cuando no hay credenciales activas).
 */

const SupabaseManager = (function () {
  let client = null;
  let isDemoMode = true;
  const LOCAL_STORAGE_KEY = "LadyBrows_citas_db";

  // Inicializar almacenamiento local con datos por defecto si está vacío
  function initLocalStorageDemo() {
    if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
      const hoy = new Date();
      const manana = new Date(hoy);
      manana.setDate(hoy.getDate() + 1);
      const pasadoManana = new Date(hoy);
      pasadoManana.setDate(hoy.getDate() + 2);

      const fechaManana = manana.toISOString().split('T')[0];
      const fechaPasadoManana = pasadoManana.toISOString().split('T')[0];

      const citasIniciales = [
        {
          id: "demo-1",
          nombre: "Camila Rodríguez",
          telefono: "+57 311 987 6543",
          email: "camila@example.com",
          servicio: "Manicure Spa Premium",
          fecha: fechaManana,
          hora: "10:00",
          comentarios: "Prefiero esmaltado en tono rosa cuarzo",
          estado: "Confirmada",
          created_at: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          id: "demo-2",
          nombre: "Sofía Martínez",
          telefono: "+57 320 555 1234",
          email: "sofia@example.com",
          servicio: "Maquillaje Social & Eventos",
          fecha: fechaManana,
          hora: "14:00",
          comentarios: "Es para una cena de gala",
          estado: "Pendiente",
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: "demo-3",
          nombre: "Elena Gómez",
          telefono: "+57 315 444 9988",
          email: "elena@example.com",
          servicio: "Limpieza Facial Profunda",
          fecha: fechaPasadoManana,
          hora: "11:00",
          comentarios: "Tengo piel sensible",
          estado: "Pendiente",
          created_at: new Date(Date.now() - 1800000).toISOString()
        }
      ];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(citasIniciales));
    }
  }

  // Intentar conectar con la biblioteca global de Supabase
  function init() {
    const config = SALON_CONFIG.supabase;
    const tieneConfigReal = config &&
      config.url &&
      config.anonKey &&
      !config.url.includes("tu-proyecto") &&
      !config.anonKey.includes("tu_key_anonima");

    if (window.supabase && tieneConfigReal) {
      try {
        client = window.supabase.createClient(config.url, config.anonKey);
        isDemoMode = false;
        console.log("🟢 Conectado exitosamente a Supabase.");
      } catch (err) {
        console.warn("⚠️ Error al inicializar Supabase. Activando modo Demo (LocalStorage):", err);
        isDemoMode = true;
        initLocalStorageDemo();
      }
    } else {
      console.log("ℹ️ Supabase no configurado o en modo inicial. Usando almacenamiento Demo local.");
      isDemoMode = true;
      initLocalStorageDemo();
    }
  }

  // Obtener citas grabadas en la BD local
  function getLocalCitas() {
    initLocalStorageDemo();
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  // Guardar en la BD local
  function saveLocalCitas(citas) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(citas));
  }

  return {
    init: init,
    isDemo: function () { return isDemoMode; },

    /**
     * Consulta las horas ocupadas para una fecha dada (excluyendo citas canceladas)
     */
    obtenerHorasOcupadas: async function (fechaStr) {
      if (!fechaStr) return [];

      if (!isDemoMode && client) {
        try {
          const { data, error } = await client
            .from("citas")
            .select("hora")
            .eq("fecha", fechaStr)
            .neq("estado", "Cancelada");

          if (error) throw error;
          return data ? data.map((c) => c.hora) : [];
        } catch (err) {
          console.error("Error al consultar horas en Supabase:", err);
          // Fallback a local
        }
      }

      // Modo LocalStorage
      const citas = getLocalCitas();
      return citas
        .filter((c) => c.fecha === fechaStr && c.estado !== "Cancelada")
        .map((c) => c.hora);
    },

    /**
     * Registra una nueva cita verificando estrictamente que no exista duplicado
     */
    crearCita: async function (datosCita) {
      // 1. Verificar duplicados
      const horasOcupadas = await this.obtenerHorasOcupadas(datosCita.fecha);
      if (horasOcupadas.includes(datosCita.hora)) {
        return {
          exito: false,
          mensaje: "Este horario ya está reservado. Por favor selecciona otro."
        };
      }

      const nuevaCita = {
        nombre: datosCita.nombre.trim(),
        telefono: datosCita.telefono.trim(),
        email: datosCita.email.trim().toLowerCase(),
        servicio: datosCita.servicio,
        fecha: datosCita.fecha,
        hora: datosCita.hora,
        comentarios: datosCita.comentarios ? datosCita.comentarios.trim() : "",
        estado: "Pendiente",
        created_at: new Date().toISOString()
      };

      if (!isDemoMode && client) {
        try {
          const { data, error } = await client
            .from("citas")
            .insert([nuevaCita])
            .select();

          if (error) {
            // Manejar error de restricción de unicidad en Postgres
            if (error.code === "23505") {
              return {
                exito: false,
                mensaje: "Este horario ya está reservado. Por favor selecciona otro."
              };
            }
            throw error;
          }

          return {
            exito: true,
            mensaje: "Tu solicitud de cita fue registrada correctamente.",
            cita: data[0]
          };
        } catch (err) {
          console.error("Error al insertar cita en Supabase:", err);
          return {
            exito: false,
            mensaje: "Ocurrió un inconveniente al conectar con el servidor. Intenta de nuevo."
          };
        }
      }

      // Modo LocalStorage Fallback
      nuevaCita.id = "cita-" + Date.now();
      const citas = getLocalCitas();
      citas.push(nuevaCita);
      saveLocalCitas(citas);

      return {
        exito: true,
        mensaje: "Tu solicitud de cita fue registrada correctamente.",
        cita: nuevaCita
      };
    },

    /**
     * Obtener todas las citas para el Panel de Administración con filtros opcionales
     */
    obtenerCitasAdmin: async function (filtros = {}) {
      let resultado = [];

      if (!isDemoMode && client) {
        try {
          let query = client.from("citas").select("*").order("fecha", { ascending: true });

          if (filtros.fecha) query = query.eq("fecha", filtros.fecha);
          if (filtros.estado && filtros.estado !== "todos") query = query.eq("estado", filtros.estado);
          if (filtros.servicio && filtros.servicio !== "todos") query = query.eq("servicio", filtros.servicio);

          const { data, error } = await query;
          if (error) throw error;
          resultado = data || [];
        } catch (err) {
          console.error("Error al obtener citas admin en Supabase:", err);
          resultado = getLocalCitas();
        }
      } else {
        resultado = getLocalCitas();
      }

      // Filtrar localmente si fue fallback o modo demo
      if (isDemoMode) {
        if (filtros.fecha) {
          resultado = resultado.filter(c => c.fecha === filtros.fecha);
        }
        if (filtros.estado && filtros.estado !== "todos") {
          resultado = resultado.filter(c => c.estado === filtros.estado);
        }
        if (filtros.servicio && filtros.servicio !== "todos") {
          resultado = resultado.filter(c => c.servicio === filtros.servicio);
        }
        // Ordenar por fecha y hora
        resultado.sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
      }

      return resultado;
    },

    /**
     * Cambiar el estado de una cita ('Confirmada', 'Cancelada', 'Completada', 'Pendiente')
     */
    actualizarEstadoCita: async function (citaId, nuevoEstado) {
      if (!isDemoMode && client) {
        try {
          const { data, error } = await client
            .from("citas")
            .update({ estado: nuevoEstado })
            .eq("id", citaId)
            .select();

          if (error) throw error;
          return { exito: true, cita: data[0] };
        } catch (err) {
          console.error("Error al actualizar estado en Supabase:", err);
        }
      }

      // Fallback LocalStorage
      const citas = getLocalCitas();
      const idx = citas.findIndex(c => c.id === citaId);
      if (idx !== -1) {
        citas[idx].estado = nuevoEstado;
        saveLocalCitas(citas);
        return { exito: true, cita: citas[idx] };
      }

      return { exito: false, mensaje: "No se encontró la cita especificada." };
    }
  };
})();

// Inicializar al cargar el script
document.addEventListener("DOMContentLoaded", () => {
  SupabaseManager.init();
});
