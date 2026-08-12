/**
 * LÓGICA DEL SISTEMA DE RESERVAS Y AGENDA - BellaEssence Studio
 */

document.addEventListener("DOMContentLoaded", () => {
  initAgendaForm();
});

let servicioSeleccionadoObj = null;
let horaSeleccionada = null;

function initAgendaForm() {
  const formCita = document.getElementById("formCita");
  const inputServicio = document.getElementById("selectServicio");
  const inputFecha = document.getElementById("inputFecha");
  const gridHorarios = document.getElementById("gridHorarios");
  const btnReservar = document.getElementById("btnReservar");

  if (!formCita) return;

  // 1. Cargar catálogo de servicios en el select
  poblarSelectServicios();

  // 2. Detectar servicio pasado por parámetro URL (?servicio=id)
  const urlParams = new URLSearchParams(window.location.search);
  const servicioParam = urlParams.get("servicio");
  if (servicioParam && inputServicio) {
    inputServicio.value = servicioParam;
    actualizarResumenServicio(servicioParam);
  }

  // Escuchar cambios en la selección del servicio
  inputServicio?.addEventListener("change", (e) => {
    actualizarResumenServicio(e.target.value);
  });

  // 3. Configurar límite de fecha (Mínimo = HOY)
  if (inputFecha) {
    const hoyStr = new Date().toISOString().split("T")[0];
    inputFecha.setAttribute("min", hoyStr);

    // Si no hay fecha elegida, establecer hoy por defecto
    if (!inputFecha.value) {
      inputFecha.value = hoyStr;
    }

    // Cargar horarios para la fecha inicial
    cargarHorariosDisponibles(inputFecha.value);

    // Escuchar cambio de fecha
    inputFecha.addEventListener("change", (e) => {
      const fechaElegida = e.target.value;
      if (fechaElegida < hoyStr) {
        showToast("No puedes seleccionar fechas pasadas.", "error");
        inputFecha.value = hoyStr;
        cargarHorariosDisponibles(hoyStr);
        return;
      }
      cargarHorariosDisponibles(fechaElegida);
      document.getElementById("summaryFecha").textContent = formatearFechaLegible(fechaElegida);
    });

    document.getElementById("summaryFecha").textContent = formatearFechaLegible(inputFecha.value);
  }

  // 4. Manejar envío del formulario
  formCita.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    // Mostrar estado de carga en el botón
    const textoOriginal = btnReservar.innerHTML;
    btnReservar.disabled = true;
    btnReservar.innerHTML = `<span class="spinner"></span> Registrando cita...`;

    const datosCita = {
      nombre: document.getElementById("inputNombre").value,
      telefono: document.getElementById("inputTelefono").value,
      email: document.getElementById("inputEmail").value,
      servicio: inputServicio.options[inputServicio.selectedIndex].text,
      fecha: inputFecha.value,
      hora: horaSeleccionada,
      comentarios: document.getElementById("inputComentarios").value
    };

    try {
      const resultado = await SupabaseManager.crearCita(datosCita);

      btnReservar.disabled = false;
      btnReservar.innerHTML = textoOriginal;

      if (resultado.exito) {
        // Mostrar Modal de Confirmación
        mostrarModalConfirmacion(resultado.cita);
        formCita.reset();
        horaSeleccionada = null;
        document.getElementById("summaryHora").textContent = "--:--";
        // Recargar horarios disponibles para actualizar estado
        cargarHorariosDisponibles(inputFecha.value);
      } else {
        showToast(resultado.mensaje, "error");
        // Si el horario estaba ocupado, refrescar la lista
        cargarHorariosDisponibles(inputFecha.value);
      }
    } catch (err) {
      btnReservar.disabled = false;
      btnReservar.innerHTML = textoOriginal;
      console.error(err);
      showToast("Ocurrió un error inesperado al procesar la reserva.", "error");
    }
  });
}

// Poblar desplegable de servicios desde SALON_CONFIG
function poblarSelectServicios() {
  const selectServicio = document.getElementById("selectServicio");
  if (!selectServicio || typeof SALON_CONFIG === "undefined") return;

  selectServicio.innerHTML = `<option value="">-- Selecciona un servicio --</option>`;
  SALON_CONFIG.servicios.forEach((serv) => {
    const opt = document.createElement("option");
    opt.value = serv.id;
    opt.textContent = `${serv.nombre} - $${serv.precio.toLocaleString()} (${serv.duracion})`;
    selectServicio.appendChild(opt);
  });
}

// Actualizar tarjeta de resumen al cambiar de servicio
function actualizarResumenServicio(servicioId) {
  if (typeof SALON_CONFIG === "undefined") return;

  const servicio = SALON_CONFIG.servicios.find((s) => s.id === servicioId);
  const elNombre = document.getElementById("summaryServicio");
  const elDuracion = document.getElementById("summaryDuracion");
  const elPrecio = document.getElementById("summaryPrecio");

  if (servicio) {
    servicioSeleccionadoObj = servicio;
    if (elNombre) elNombre.textContent = servicio.nombre;
    if (elDuracion) elDuracion.textContent = servicio.duracion;
    if (elPrecio) elPrecio.textContent = `$${servicio.precio.toLocaleString()}`;
  } else {
    servicioSeleccionadoObj = null;
    if (elNombre) elNombre.textContent = "Sin seleccionar";
    if (elDuracion) elDuracion.textContent = "-- min";
    if (elPrecio) elPrecio.textContent = "$0";
  }
}

// Cargar franjas horarias y marcar ocupadas
async function cargarHorariosDisponibles(fechaStr) {
  const gridHorarios = document.getElementById("gridHorarios");
  if (!gridHorarios || typeof SALON_CONFIG === "undefined") return;

  gridHorarios.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 1rem; color: var(--color-text-muted);"><span class="spinner" style="border-top-color: var(--color-primary);"></span> Consultando disponibilidad...</div>`;

  try {
    const horasOcupadas = await SupabaseManager.obtenerHorasOcupadas(fechaStr);
    gridHorarios.innerHTML = "";

    SALON_CONFIG.horariosDisponibles.forEach((hora) => {
      const estaOcupada = horasOcupadas.includes(hora);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `time-slot-btn ${estaOcupada ? "disabled" : ""}`;

      if (horaSeleccionada === hora && !estaOcupada) {
        btn.classList.add("selected");
      }

      btn.innerHTML = `
        <span>${hora}</span>
        <span class="time-slot-status">${estaOcupada ? "Ocupado" : "Libre"}</span>
      `;

      if (estaOcupada) {
        btn.disabled = true;
      } else {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".time-slot-btn").forEach((b) => b.classList.remove("selected"));
          btn.classList.add("selected");
          horaSeleccionada = hora;
          document.getElementById("summaryHora").textContent = hora;
        });
      }

      gridHorarios.appendChild(btn);
    });
  } catch (err) {
    gridHorarios.innerHTML = `<div style="grid-column: 1/-1; color: var(--color-danger); font-size: 0.9rem;">Error al cargar horarios. Por favor intenta de nuevo.</div>`;
  }
}

// Validaciones del formulario
function validarFormulario() {
  const selectServicio = document.getElementById("selectServicio");
  const inputNombre = document.getElementById("inputNombre");
  const inputTelefono = document.getElementById("inputTelefono");
  const inputEmail = document.getElementById("inputEmail");
  const inputFecha = document.getElementById("inputFecha");

  let esValido = true;

  // Validar servicio
  if (!selectServicio.value) {
    selectServicio.classList.add("is-invalid");
    showToast("Por favor selecciona un servicio.", "error");
    esValido = false;
  } else {
    selectServicio.classList.remove("is-invalid");
  }

  // Validar nombre
  if (!inputNombre.value.trim() || inputNombre.value.trim().length < 3) {
    inputNombre.classList.add("is-invalid");
    showToast("Por favor ingresa un nombre válido.", "error");
    esValido = false;
  } else {
    inputNombre.classList.remove("is-invalid");
  }

  // Validar teléfono (mínimo 7 dígitos)
  const regexTelefono = /^[0-9+()\s-]{7,20}$/;
  if (!regexTelefono.test(inputTelefono.value.trim())) {
    inputTelefono.classList.add("is-invalid");
    showToast("Por favor ingresa un número de teléfono válido.", "error");
    esValido = false;
  } else {
    inputTelefono.classList.remove("is-invalid");
  }

  // Validar email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(inputEmail.value.trim())) {
    inputEmail.classList.add("is-invalid");
    showToast("Por favor ingresa un correo electrónico válido.", "error");
    esValido = false;
  } else {
    inputEmail.classList.remove("is-invalid");
  }

  // Validar fecha
  if (!inputFecha.value) {
    inputFecha.classList.add("is-invalid");
    showToast("Por favor selecciona una fecha.", "error");
    esValido = false;
  } else {
    inputFecha.classList.remove("is-invalid");
  }

  // Validar hora seleccionada
  if (!horaSeleccionada) {
    showToast("Por favor selecciona un horario disponible.", "error");
    esValido = false;
  }

  return esValido;
}

// Formateador de fecha legible
function formatearFechaLegible(fechaStr) {
  if (!fechaStr) return "--/--/----";
  const partes = fechaStr.split("-");
  const fecha = new Date(partes[0], partes[1] - 1, partes[2]);
  return fecha.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// Modal de Confirmación Exitosa
function mostrarModalConfirmacion(cita) {
  const receiptModal = document.getElementById("receiptModal");
  if (!receiptModal) {
    showToast("Tu solicitud de cita fue registrada correctamente.", "success");
    return;
  }

  document.getElementById("reciboNombre").textContent = cita.nombre;
  document.getElementById("reciboServicio").textContent = cita.servicio;
  document.getElementById("reciboFechaHora").textContent = `${formatearFechaLegible(cita.fecha)} a las ${cita.hora}`;
  document.getElementById("reciboTelefono").textContent = cita.telefono;

  // Botón directo a WhatsApp con confirmación
  const btnWhatsApp = document.getElementById("btnWhatsAppConfirm");
  if (btnWhatsApp) {
    const msg = `Hola ${SALON_CONFIG.nombre}, acabo de agendar una cita para ${cita.servicio} el ${cita.fecha} a las ${cita.hora} a nombre de ${cita.nombre}.`;
    btnWhatsApp.href = obtenerEnlaceWhatsApp(msg);
  }

  receiptModal.classList.add("active");

  // Botón para cerrar
  const btnCerrar = document.getElementById("btnCerrarRecibo");
  if (btnCerrar) {
    btnCerrar.onclick = () => receiptModal.classList.remove("active");
  }
}
