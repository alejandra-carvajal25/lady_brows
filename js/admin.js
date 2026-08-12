/**
 * PANEL DE ADMINISTRACIÓN Y GESTIÓN DE CITAS - BellaEssence Studio
 */

document.addEventListener("DOMContentLoaded", () => {
  initAdminPanel();
});

function initAdminPanel() {
  const adminAuthOverlay = document.getElementById("adminAuthOverlay");
  const formAdminAuth = document.getElementById("formAdminAuth");
  const inputPasscode = document.getElementById("inputPasscode");
  const btnLogout = document.getElementById("btnLogout");

  // Verificar si ya inició sesión en esta sesión del navegador
  if (sessionStorage.getItem("bellaessence_admin_logged") === "true") {
    if (adminAuthOverlay) adminAuthOverlay.style.display = "none";
    cargarDatosAdmin();
  } else {
    if (adminAuthOverlay) adminAuthOverlay.style.display = "flex";
  }

  // Manejar Login
  formAdminAuth?.addEventListener("submit", (e) => {
    e.preventDefault();
    const pass = inputPasscode.value.trim();
    const passCorrecta = typeof SALON_CONFIG !== "undefined" ? SALON_CONFIG.adminPasscode : "admin123";

    if (pass === passCorrecta) {
      sessionStorage.setItem("bellaessence_admin_logged", "true");
      adminAuthOverlay.style.display = "none";
      showToast("Bienvenida al Panel de Administración", "success");
      cargarDatosAdmin();
    } else {
      showToast("Contraseña incorrecta. Inténtalo de nuevo.", "error");
      inputPasscode.value = "";
      inputPasscode.focus();
    }
  });

  // Manejar Logout
  btnLogout?.addEventListener("click", () => {
    sessionStorage.removeItem("bellaessence_admin_logged");
    window.location.reload();
  });

  // Configurar Filtros
  const filterFecha = document.getElementById("filterFecha");
  const filterEstado = document.getElementById("filterEstado");
  const filterServicio = document.getElementById("filterServicio");
  const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros");

  filterFecha?.addEventListener("change", () => aplicarFiltrosAdmin());
  filterEstado?.addEventListener("change", () => aplicarFiltrosAdmin());
  filterServicio?.addEventListener("change", () => aplicarFiltrosAdmin());

  btnLimpiarFiltros?.addEventListener("click", () => {
    if (filterFecha) filterFecha.value = "";
    if (filterEstado) filterEstado.value = "todos";
    if (filterServicio) filterServicio.value = "todos";
    aplicarFiltrosAdmin();
  });
}

// Cargar catálogo de servicios en el filtro
function poblarFiltroServicios() {
  const filterServicio = document.getElementById("filterServicio");
  if (!filterServicio || typeof SALON_CONFIG === "undefined") return;

  filterServicio.innerHTML = `<option value="todos">Todos los servicios</option>`;
  SALON_CONFIG.servicios.forEach((serv) => {
    const opt = document.createElement("option");
    opt.value = serv.nombre;
    opt.textContent = serv.nombre;
    filterServicio.appendChild(opt);
  });
}

// Cargar y mostrar datos de la tabla y estadísticas
async function cargarDatosAdmin() {
  poblarFiltroServicios();
  await aplicarFiltrosAdmin();
}

async function aplicarFiltrosAdmin() {
  const filterFecha = document.getElementById("filterFecha")?.value;
  const filterEstado = document.getElementById("filterEstado")?.value;
  const filterServicio = document.getElementById("filterServicio")?.value;

  const filtros = {
    fecha: filterFecha || null,
    estado: filterEstado || "todos",
    servicio: filterServicio || "todos"
  };

  const tbody = document.getElementById("tbodyCitas");
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem;"><span class="spinner" style="border-top-color: var(--color-primary);"></span> Cargando citas...</td></tr>`;
  }

  const citas = await SupabaseManager.obtenerCitasAdmin(filtros);

  actualizarEstadisticas(citas);
  renderizarTablaCitas(citas);
}

// Actualizar contadores de las tarjetas de métricas
function actualizarEstadisticas(citas) {
  const elTotal = document.getElementById("statTotal");
  const elPendientes = document.getElementById("statPendientes");
  const elConfirmadas = document.getElementById("statConfirmadas");
  const elCompletadas = document.getElementById("statCompletadas");

  if (!elTotal) return;

  const total = citas.length;
  const pendientes = citas.filter((c) => c.estado === "Pendiente").length;
  const confirmadas = citas.filter((c) => c.estado === "Confirmada").length;
  const completadas = citas.filter((c) => c.estado === "Completada").length;

  elTotal.textContent = total;
  elPendientes.textContent = pendientes;
  elConfirmadas.textContent = confirmadas;
  elCompletadas.textContent = completadas;
}

// Renderizar la tabla de citas
function renderizarTablaCitas(citas) {
  const tbody = document.getElementById("tbodyCitas");
  if (!tbody) return;

  if (citas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.25rem;">No se encontraron citas</p>
          <p style="font-size: 0.9rem; color: var(--color-text-muted);">Intenta ajustar los filtros de búsqueda</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = "";

  citas.forEach((cita) => {
    const tr = document.createElement("tr");

    // Formatear enlace a WhatsApp
    const msg = encodeURIComponent(`Hola ${cita.nombre}, te contactamos de BellaEssence Studio respecto a tu cita para ${cita.servicio} el ${cita.fecha} a las ${cita.hora}.`);
    const waLink = `https://wa.me/${cita.telefono.replace(/[^0-9]/g, "")}?text=${msg}`;

    tr.innerHTML = `
      <td><strong>${cita.nombre}</strong></td>
      <td>
        <a href="${waLink}" target="_blank" style="color: var(--color-primary); font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem;">
          📱 ${cita.telefono}
        </a>
      </td>
      <td>${cita.servicio}</td>
      <td><strong>${cita.fecha}</strong> <span style="color: var(--color-text-muted);">${cita.hora}</span></td>
      <td><span class="status-badge ${cita.estado}">${cita.estado}</span></td>
      <td style="max-width: 180px; font-size: 0.85rem; color: var(--color-text-muted);">${cita.comentarios || "-"}</td>
      <td>
        <div class="table-actions">
          ${cita.estado !== "Confirmada" ? `<button class="btn-action confirm" onclick="cambiarEstado('${cita.id}', 'Confirmada')">Confirmar</button>` : ""}
          ${cita.estado !== "Completada" ? `<button class="btn-action complete" onclick="cambiarEstado('${cita.id}', 'Completada')">Completar</button>` : ""}
          ${cita.estado !== "Cancelada" ? `<button class="btn-action cancel" onclick="cambiarEstado('${cita.id}', 'Cancelada')">Cancelar</button>` : ""}
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Función global para cambiar el estado de la cita desde el botón de la fila
window.cambiarEstado = async function (citaId, nuevoEstado) {
  if (confirm(`¿Estás segura de cambiar el estado de esta cita a "${nuevoEstado}"?`)) {
    const res = await SupabaseManager.actualizarEstadoCita(citaId, nuevoEstado);
    if (res.exito) {
      showToast(`Cita actualizada a ${nuevoEstado}`, "success");
      aplicarFiltrosAdmin();
    } else {
      showToast("No se pudo actualizar la cita.", "error");
    }
  }
};
