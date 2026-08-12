/**
 * INTERACCIONES GLOBALES Y NAVEGACIÓN - BellaEssence Studio
 */

document.addEventListener("DOMContentLoaded", () => {
  initHeaderAndMenu();
  initSalonDataBinding();
  initLightbox();
  initSmoothScroll();
});

/* --- MENÚ HAMBURGUESA Y HEADER SCROLL --- */
function initHeaderAndMenu() {
  const header = document.querySelector(".header");
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Efecto de sombra al hacer scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  });

  // Toggle menú móvil
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", () => {
      hamburgerBtn.classList.toggle("open");
      navMenu.classList.toggle("open");
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburgerBtn.classList.remove("open");
        navMenu.classList.remove("open");
      });
    });
  }

  // Marcar enlace activo según la página actual
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* --- AUTO-INYECCIÓN DE DATOS DE CONFIGURACIÓN --- */
function initSalonDataBinding() {
  if (typeof SALON_CONFIG === "undefined") return;

  // Inyectar nombre del salón
  document.querySelectorAll("[data-salon='nombre']").forEach((el) => {
    el.textContent = SALON_CONFIG.nombre;
  });

  // Inyectar eslogan
  document.querySelectorAll("[data-salon='eslogan']").forEach((el) => {
    el.textContent = SALON_CONFIG.eslogan;
  });

  // Inyectar teléfono
  document.querySelectorAll("[data-salon='telefono']").forEach((el) => {
    el.textContent = SALON_CONFIG.contacto.telefono;
  });

  // Inyectar dirección
  document.querySelectorAll("[data-salon='direccion']").forEach((el) => {
    el.textContent = SALON_CONFIG.contacto.direccion;
  });

  // Inyectar enlaces WhatsApp
  document.querySelectorAll("[data-salon='whatsapp-link']").forEach((el) => {
    const msg = el.getAttribute("data-msg") || "";
    el.setAttribute("href", obtenerEnlaceWhatsApp(msg));
    el.setAttribute("target", "_blank");
  });
}

/* --- GALERÍA Y LIGHTBOX MODAL --- */
function initLightbox() {
  const lightboxModal = document.getElementById("lightboxModal");
  if (!lightboxModal) return;

  const lightboxImg = lightboxModal.querySelector(".lightbox-img");
  const lightboxTitle = lightboxModal.querySelector(".lightbox-title");
  const lightboxDesc = lightboxModal.querySelector(".lightbox-desc");
  const lightboxClose = lightboxModal.querySelector(".lightbox-close");

  // Escuchar clics en los ítems de galería
  document.addEventListener("click", (e) => {
    const galleryItem = e.target.closest(".gallery-item");
    if (galleryItem) {
      const img = galleryItem.querySelector("img");
      const title = galleryItem.getAttribute("data-title") || img?.alt || "Trabajo de Belleza";
      const desc = galleryItem.getAttribute("data-desc") || "";

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) lightboxDesc.textContent = desc;
        lightboxModal.classList.add("active");
        document.body.style.overflow = "hidden"; // Bloquear scroll del body
      }
    }
  });

  // Cerrar lightbox
  const cerrarModal = () => {
    lightboxModal.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (lightboxClose) {
    lightboxClose.addEventListener("click", cerrarModal);
  }

  lightboxModal.addEventListener("click", (e) => {
    if (e.target === lightboxModal) cerrarModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightboxModal.classList.contains("active")) {
      cerrarModal();
    }
  });
}

/* --- SCROLL SUAVE Y BOTÓN VOLVER ARRIBA --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
}

/* --- SISTEMA GLOBAL DE NOTIFICACIONES TOAST --- */
function showToast(mensaje, tipo = "info") {
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${tipo}`;

  let icono = "ℹ️";
  if (tipo === "success") icono = "✨";
  if (tipo === "error") icono = "⚠️";

  toast.innerHTML = `<span>${icono}</span> <span>${mensaje}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
