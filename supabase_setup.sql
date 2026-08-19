-- ============================================================
-- SCRIPT DE CONFIGURACIÓN DE BASE DE DATOS SUPABASE
-- Proyecto: lady brows - Sistema de Citas
-- ============================================================

-- 1. Creación de la Tabla 'citas'
CREATE TABLE IF NOT EXISTS public.citas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(35) NOT NULL,
    email VARCHAR(150) NOT NULL,
    servicio VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    hora VARCHAR(10) NOT NULL,
    comentarios TEXT,
    estado VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Confirmada', 'Cancelada', 'Completada')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índice Único para Evitar Doble Reserva en la misma Fecha y Hora
-- Impide estrictamente que se registren dos citas en la misma fecha y hora
CREATE UNIQUE INDEX IF NOT EXISTS idx_citas_fecha_hora_unica 
ON public.citas (fecha, hora) 
WHERE estado != 'Cancelada';

-- 3. Índices adicionales de búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_citas_fecha ON public.citas(fecha);
CREATE INDEX IF NOT EXISTS idx_citas_estado ON public.citas(estado);

-- 4. Función y Trigger para actualizar automáticamente 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_citas_updated_at ON public.citas;
CREATE TRIGGER update_citas_updated_at
BEFORE UPDATE ON public.citas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 5. Habilitar Seguridad a Nivel de Fila (RLS)
ALTER TABLE public.citas ENABLE ROW LEVEL SECURITY;

-- Política 1: Permitir a cualquier visitante consultar horarios reservados (para mostrar disponibilidad)
CREATE POLICY "Permitir lectura de fechas y horas ocupadas"
ON public.citas
FOR SELECT
TO anon, authenticated
USING (true);

-- Política 2: Permitir a visitantes registrar una nueva cita
CREATE POLICY "Permitir inserción de citas públicas"
ON public.citas
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política 3: Permitir actualización de citas (para administradores o clave anónima en demo)
CREATE POLICY "Permitir actualización de citas para gestión"
ON public.citas
FOR UPDATE
TO anon, authenticated
USING (true);

-- 6. Insertar Citas de Prueba (Opcional)
INSERT INTO public.citas (nombre, telefono, email, servicio, fecha, hora, comentarios, estado)
VALUES
('Camila Rodríguez', '+57 311 987 6543', 'camila@email.com', 'Manicure Spa Premium', CURRENT_DATE + INTERVAL '1 day', '10:00', 'Prefiero tonos pasteles', 'Confirmada'),
('Sofía Martínez', '+57 320 555 1234', 'sofia@email.com', 'Maquillaje Social & Eventos', CURRENT_DATE + INTERVAL '1 day', '14:00', 'Evento de noche a las 7pm', 'Pendiente'),
('Elena Gómez', '+57 315 444 9988', 'elena@email.com', 'Limpieza Facial Profunda', CURRENT_DATE + INTERVAL '2 days', '11:00', 'Primera vez en el salón', 'Pendiente')
ON CONFLICT DO NOTHING;
