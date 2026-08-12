# 🌸 BellaEssence Studio - Sitio Web & Sistema de Reservas

Un sitio web completo, moderno, elegante y completamente responsive desarrollado para un salón de belleza. Incluye landing page promocional, catálogo interactivo de servicios, galería con modal Lightbox, sistema de agenda de citas en tiempo real integrado con Supabase (con bloqueo de horarios ocupados) y un panel de administración privado para la gestión de citas.

---

## 🚀 Tecnologías Utilizadas

- **HTML5**: Estructura semántica, limpia y accesible.
- **CSS3**: Diseño visual personalizado con variables CSS, animaciones suaves, flexbox, CSS grid y estética femenina moderna.
- **JavaScript (ES6+)**: Lógica e interacciones sin librerías pesadas.
- **Supabase**: Base de datos Postgres en la nube, RLS (Row Level Security) e integración vía API cliente.
- **GitHub**: Control de versiones y repositorio de código.
- **Netlify**: Plataforma de despliegue continuo vinculada a GitHub.

---

## 📁 Estructura del Proyecto

```text
pagina_web/
├── index.html          # Landing Page principal (Header, Hero, Sobre Nosotros, Galería, Contacto, Footer)
├── servicios.html      # Catálogo completo de servicios con filtro por categoría
├── agenda.html         # Interfaz interactiva para agendar citas con selector de fecha/hora
├── contacto.html       # Información de contacto, mapa y envío directo de mensajes a WhatsApp
├── admin.html          # Panel de administración protegido por contraseña
│
├── css/
│   ├── style.css       # Sistema de diseño, variables de color, tipografías y componentes globales
│   ├── agenda.css      # Estilos para el selector de franjas horarias y recibo de reserva
│   └── admin.css       # Estilos para la tabla administrativa, métricas y badges de estado
│
├── js/
│   ├── config.js       # CONFIGURACIÓN CENTRALIZADA (Servicios, precios, WhatsApp, datos del salón)
│   ├── supabase.js     # Conexión con Supabase y fallback en LocalStorage (Modo Demo)
│   ├── main.js         # Menú hamburguesa, lightbox de galería, scroll suave y notificaciones
│   ├── agenda.js       # Lógica del formulario de reserva, horarios reactivos y validaciones
│   └── admin.js        # Lógica del panel administrativo, autenticación y actualización de citas
│
├── assets/
│   └── images/         # Gráficos e imágenes vectoriales SVG listos para reemplazar
│
├── supabase_setup.sql  # Script de base de datos para crear la tabla 'citas' en Supabase
├── netlify.toml        # Archivo de configuración de despliegue en Netlify
├── .env.example        # Plantilla de variables de entorno
├── .gitignore          # Archivo para ignorar archivos sensibles en Git
└── README.md           # Documentación completa del proyecto
```

---

## 🛢️ Configuración de Supabase (Base de Datos)

Para conectar el sitio con una base de datos de producción en Supabase:

1. Crea una cuenta gratuita en [Supabase.com](https://supabase.com).
2. Crea un nuevo proyecto y dale un nombre (ej: `bellaessence-db`).
3. En el menú lateral izquierdo, ve a **SQL Editor** y haz clic en **New Query**.
4. Abre el archivo [`supabase_setup.sql`](file:///c:/Users/SENA/Desktop/pagina_web/supabase_setup.sql) de este proyecto, copia todo su contenido, pégalo en el editor de Supabase y presiona **RUN**.
5. Ve a **Project Settings > API** en Supabase y copia las siguientes claves:
   - `Project URL` (ej: `https://xyz...supabase.co`)
   - `anon public` key (ej: `eyJhbGci...`)
6. Abre el archivo [`js/config.js`](file:///c:/Users/SENA/Desktop/pagina_web/js/config.js) en tu editor y reemplaza los valores en la sección `supabase`:
   ```javascript
   supabase: {
     url: "https://tu-proyecto.supabase.co",
     anonKey: "tu_key_anonima_aqui"
   }
   ```

*Nota: Si no configuras las claves inmediatamente, el sistema funcionará automáticamente en **Modo Demo (LocalStorage)**, permitiéndote probar todas las funciones inmediatamente en tu computador.*

---

## ✏️ Cómo Editar los Datos del Salón y Servicios

No necesitas editar múltiples archivos HTML para cambiar precios o nombres. Todo está centralizado en [`js/config.js`](file:///c:/Users/SENA/Desktop/pagina_web/js/config.js):

- **Nombre, Teléfono y WhatsApp**: Modifica el objeto `SALON_CONFIG.contacto`.
- **Servicios y Precios**: Edita el arreglo `SALON_CONFIG.servicios`. Puedes añadir nuevos servicios, cambiar duraciones, descripciones o imágenes.
- **Franjas Horarias**: Modifica el arreglo `SALON_CONFIG.horariosDisponibles` (ej: `["09:00", "10:00", "11:00", ...]`).
- **Fotografías**: Reemplaza los archivos `.svg` dentro de `assets/images/` por tus propias fotografías en formato `.jpg` o `.png` y actualiza las rutas en `config.js`.
- **Contraseña del Panel Admin**: Cambia la propiedad `adminPasscode` en `config.js` (Predeterminada: `admin123`).

---

## 💻 Ejecución Local

Para probar la página web en tu computadora:

### Opción 1: Abrir directamente
Haz doble clic en `index.html` para abrirlo en cualquier navegador (Chrome, Edge, Firefox, Safari).

### Opción 2: Usar un servidor local (Recomendado)
Puedes usar Live Server en VS Code o ejecutar en la terminal:
```bash
# Con Python:
python -m http.server 8000

# Con Node / npx:
npx serve .
```
Luego abre `http://localhost:8000` en tu navegador.

---

## 🐙 Subir el Proyecto a GitHub

1. Abre la consola en la carpeta del proyecto.
2. Inicializa el repositorio Git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: BellaEssence Studio Web"
   ```
3. Crea un nuevo repositorio público o privado en [GitHub.com](https://github.com/new).
4. Vincula tu repositorio local y sube los archivos:
   ```bash
   git remote add origin https://github.com/tu-usuario/tu-repositorio.git
   git branch -M main
   git push -u origin main
   ```

---

## 🌐 Despliegue en Netlify

1. Inicia sesión en [Netlify.com](https://netlify.com) con tu cuenta de GitHub.
2. Haz clic en **Add new site > Import an existing project**.
3. Selecciona **GitHub** y elige el repositorio de tu proyecto (`bellaessence-studio`).
4. Configura los parámetros de despliegue:
   - **Branch to deploy**: `main`
   - **Build command**: (dejar en blanco)
   - **Publish directory**: `.`
5. *(Opcional)* En **Site settings > Environment variables**, puedes agregar:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
6. Haz clic en **Deploy site**.

¡Listo! Netlify te entregará un enlace público HTTPS (ej: `https://bellaessence.netlify.app`). Cada vez que hagas un `git push` a GitHub, Netlify actualizará el sitio web automáticamente.

---

## 🧪 Instrucciones para Probar el Sistema de Reservas

1. **Agendar una Cita de Prueba**:
   - Abre `agenda.html`.
   - Selecciona un servicio (ej: *Manicure Spa Premium*).
   - Elige la fecha de mañana. Verás aparecer las franjas horarias disponibles (ej: `09:00`, `10:00`, `11:00`).
   - Selecciona la hora `10:00`.
   - Ingresa tu nombre, teléfono y correo electrónico.
   - Presiona **Reservar Cita Ahora**.
   - Aparecerá el modal de confirmación con el botón directo a WhatsApp.

2. **Verificar Validación de Horarios Ocupados (Anti-Duplicados)**:
   - Intenta agendar nuevamente una cita en la **misma fecha** y a la **misma hora (`10:00`)**.
   - El sistema mostrará la hora `10:00` en rojo / deshabilitada con el texto "Ocupado".
   - Si intentas forzar el envío, el sistema mostrará la alerta: *"Este horario ya está reservado. Por favor selecciona otro."*

3. **Verificar el Panel de Administración**:
   - Abre `admin.html`.
   - Ingresa la clave predeterminada: `admin123`.
   - Verás la cita recién agendada en la tabla con estado **Pendiente**.
   - Prueba hacer clic en el botón **Confirmar** o **Completar** para actualizar su estado.
   - Utiliza los filtros superiores por estado o servicio para comprobar el filtrado reactivo.
