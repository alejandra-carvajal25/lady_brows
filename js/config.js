/**
 * CONFIGURACIÓN CENTRALIZADA DEL SALÓN DE BELLEZA
 * 
 * En este archivo puedes modificar fácilmente la información de la clienta,
 * los servicios ofrecidos, las franjas horarias y la configuración de Supabase.
 */

const SALON_CONFIG = {
  // Información General del Salón
  nombre: "Lady Brows",
  eslogan: "Realza tu belleza, resalta tu esencia",
  propietaria: "Valeria Mendoza",
  experiencia: "Más de 3 años transformando y realzando la belleza femenina con dedicación, pasión y las mejores técnicas.",
  filosofia: "Creemos que cada mujer posee una belleza única. Nuestro objetivo es brindarte una experiencia relajante, personalizada y de máxima calidad donde te sientas cuidada y renovada.",

  // Datos de Contacto
  contacto: {
    telefono: "+57 300 123 4567",
    whatsapp: "573153833673", // Número en formato internacional sin '+' ni espacios para API de WhatsApp
    email: "ladybrows@gmail.com",
    direccion: "Calle 45 # 18 - 24, Barrio Centro",
    ciudad: "Timaná, Huila",
    instagram: "@LadyBrows",
    instagramUrl: "https://instagram.com",
    facebookUrl: "https://facebook.com",
  },

  // Horarios de Atención
  horarios: {
    lunesAViernes: "09:00 AM - 07:00 PM",
    sabados: "09:00 AM - 06:00 PM",
    domingosYFestivos: "Cerrado",
  },

  // Franjas Horarias Disponibles para Citas (Formato 24h: "09:00", "10:00", etc.)
  horariosDisponibles: [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00"
  ],

  // Credenciales de Supabase
  // Reemplazar estas cadenas con las credenciales reales provistas por Supabase:
  supabase: {
    url: "https://lqqzluncysydyhgfpgxi.supabase.co",
    anonKey: "sb_publishable_8KOtovyX8bxrqMGZoGYC8A_xkNyrzHK"
  },

  // Clave de acceso de emergencia/demo para el panel de administración
  adminPasscode: "admin123",

  // Catálogo de Servicios
  servicios: [
    {
      id: "manicure-spa",
      categoria: "uñas",
      nombre: "Manicure Spa Premium",
      descripcion: "Exfoliación suave, hidratación profunda con aceites esenciales, limado perfecto, tratamiento de cutículas y esmaltado semipermanente.",
      precio: 45000,
      duracion: "60 min",
      destacado: true,
      imagen: "assets/images/service-manicure.svg"
    },
    {
      id: "pedicure-spa",
      categoria: "uñas",
      nombre: "Pedicure Spa Relajante",
      descripcion: "Baño de sales aromáticas, remoción de asperezas, masaje relajante, mascarilla hidratante y esmaltado de larga duración.",
      precio: 55000,
      duracion: "60 min",
      destacado: true,
      imagen: "assets/images/service-pedicure.svg"
    },
    {
      id: "unas-acrilicas",
      categoria: "uñas",
      nombre: "Uñas Esculpidas en Acrílico",
      descripcion: "Extensión de uñas con técnica acrílica profesional, diseño personalizado de forma, acabado natural o con Nail Art a elección.",
      precio: 95000,
      duracion: "120 min",
      destacado: false,
      imagen: "assets/images/service-acrylics.svg"
    },
    {
      id: "nail-art",
      categoria: "uñas",
      nombre: "Diseño de Uñas & Nail Art",
      descripcion: "Diseños creativos hechos a mano alzada, encapsulados, efecto espejo, pedrería fina y tendencias actuales para tus uñas.",
      precio: 35000,
      duracion: "45 min",
      destacado: false,
      imagen: "assets/images/service-nailart.svg"
    },
    {
      id: "maquillaje-social",
      categoria: "maquillaje",
      nombre: "Maquillaje Social & Eventos",
      descripcion: "Maquillaje profesional adaptado a la morfología de tu rostro, preparación de piel con productos de alta gama y fijación de larga duración.",
      precio: 120000,
      duracion: "75 min",
      destacado: true,
      imagen: "assets/images/service-makeup.svg"
    },
    {
      id: "peinado-evento",
      categoria: "peinados",
      nombre: "Peinado & Ondas de Agua",
      descripcion: "Peinados elegantes para ocasiones especiales: ondas suaves, recogidos modernos, trenzados sofisticados y acabado brillante.",
      precio: 85000,
      duracion: "60 min",
      destacado: true,
      imagen: "assets/images/service-hairstyle.svg"
    },
    {
      id: "limpieza-facial",
      categoria: "facial",
      nombre: "Limpieza Facial Profunda",
      descripcion: "Higienización cutánea con vapor de ozono, extracción de impurezas, alta frecuencia bactericida y mascarilla descongestiva.",
      precio: 90000,
      duracion: "90 min",
      destacado: true,
      imagen: "assets/images/service-facial.svg"
    },
    {
      id: "laminado-cejas",
      categoria: "facial",
      nombre: "Diseño de Cejas & Laminado",
      descripcion: "Visagismo de cejas según el rostro, depilación con cera o hilo, laminado para fijación perfecta y pigmentación semitemporal con Henna.",
      precio: 60000,
      duracion: "50 min",
      destacado: false,
      imagen: "assets/images/service-brows.svg"
    }
  ],

  // Galería de Trabajos Realizados
  galeria: [
    {
      id: 1,
      titulo: "Esmaltado Semipermanente & Microglitter",
      categoria: "Uñas",
      imagen: "assets/images/gallery-1.svg",
      descripcion: "Tono rosa pastel con destellos brillantes para un look delicado."
    },
    {
      id: 2,
      titulo: "Maquillaje para Novia / Evento Nocturno",
      categoria: "Maquillaje",
      imagen: "assets/images/gallery-2.svg",
      descripcion: "Piel luminosa, tonos cálidos y acabado mate de larga duración."
    },
    {
      id: 3,
      titulo: "Peinado Elegante Recogido Bajo",
      categoria: "Peinados",
      imagen: "assets/images/gallery-3.svg",
      descripcion: "Estilo sofisticado ideal para graduaciones y bodas."
    },
    {
      id: 4,
      titulo: "Uñas Acrílicas Baby Boomer",
      categoria: "Uñas",
      imagen: "assets/images/gallery-4.svg",
      descripcion: "Degradado suave de blanco a rosado con piedras de cristal."
    },
    {
      id: 5,
      titulo: "Limpieza Facial y Mascarilla Glow",
      categoria: "Facial",
      imagen: "assets/images/gallery-5.svg",
      descripcion: "Piel radiante e hidratada tras sesión de cuidado facial."
    },
    {
      id: 6,
      titulo: "Laminado y Perfilado de Cejas",
      categoria: "Facial",
      imagen: "assets/images/gallery-6.svg",
      descripcion: "Cejas orgánicas bien definidas y ordenadas naturalmente."
    }
  ]
};

// Función de utilidad para generar enlaces a WhatsApp con mensaje precargado
function obtenerEnlaceWhatsApp(mensaje = "") {
  const num = SALON_CONFIG.contacto.whatsapp;
  const texto = encodeURIComponent(mensaje || `Hola ${SALON_CONFIG.nombre}, me gustaría obtener más información sobre sus servicios.`);
  return `https://wa.me/${num}?text=${texto}`;
}
