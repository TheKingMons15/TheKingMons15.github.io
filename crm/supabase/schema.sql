-- ============================================================
-- CRM NEUROTEC - Script de Base de Datos Supabase
-- Ejecutar en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- 1. Tabla de usuarios (profiles)
CREATE TABLE IF NOT EXISTS public.usuarios (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nombre text NOT NULL,
  email text NOT NULL,
  rol text NOT NULL DEFAULT 'vendedor' CHECK (rol IN ('admin', 'vendedor')),
  activo boolean NOT NULL DEFAULT true,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Tabla de clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  telefono text,
  email text,
  estado text NOT NULL DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'contactado', 'en_conversacion', 'interesado', 'cerrado', 'perdido')),
  observaciones text,
  vendedor_id uuid REFERENCES public.usuarios(id) ON DELETE SET NULL,
  ultimo_contacto date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Tabla de seguimientos
CREATE TABLE IF NOT EXISTS public.seguimientos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  vendedor_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  tipo text NOT NULL CHECK (tipo IN ('llamada', 'whatsapp', 'reunion', 'correo')),
  comentarios text,
  proxima_fecha date,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Tabla de reportes diarios
CREATE TABLE IF NOT EXISTS public.reportes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendedor_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  fecha date NOT NULL,
  clientes_contactados integer NOT NULL DEFAULT 0,
  seguimientos_realizados integer NOT NULL DEFAULT 0,
  ventas integer NOT NULL DEFAULT 0,
  problemas text,
  objetivos text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(vendedor_id, fecha)
);

-- ============================================================
-- ÍNDICES para mejor performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_clientes_estado ON public.clientes(estado);
CREATE INDEX IF NOT EXISTS idx_clientes_vendedor ON public.clientes(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_seguimientos_cliente ON public.seguimientos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_seguimientos_vendedor ON public.seguimientos(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_reportes_vendedor_fecha ON public.reportes(vendedor_id, fecha);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seguimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reportes ENABLE ROW LEVEL SECURITY;

-- ======= POLÍTICAS: usuarios =======
-- Los admins pueden ver todos los usuarios
CREATE POLICY "Admins can view all users"
  ON public.usuarios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios u
      WHERE u.id = auth.uid() AND u.rol = 'admin'
    )
  );

-- Cada usuario puede ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.usuarios FOR SELECT
  USING (auth.uid() = id);

-- Solo admins pueden crear usuarios en la tabla profiles
CREATE POLICY "Admins can insert users"
  ON public.usuarios FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios u
      WHERE u.id = auth.uid() AND u.rol = 'admin'
    ) OR auth.uid() = id
  );

-- Admins pueden actualizar cualquier usuario, users su propio perfil
CREATE POLICY "Users can update own or admins all"
  ON public.usuarios FOR UPDATE
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM public.usuarios u
      WHERE u.id = auth.uid() AND u.rol = 'admin'
    )
  );

-- ======= POLÍTICAS: clientes =======
-- Admins ven todos; vendedores ven los suyos
CREATE POLICY "Admins see all clients"
  ON public.clientes FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND rol = 'admin')
    OR vendedor_id = auth.uid()
    OR vendedor_id IS NULL
  );

CREATE POLICY "Authenticated users can insert clients"
  ON public.clientes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own clients, admins all"
  ON public.clientes FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND rol = 'admin')
    OR vendedor_id = auth.uid()
  );

CREATE POLICY "Admins can delete clients"
  ON public.clientes FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND rol = 'admin')
  );

-- ======= POLÍTICAS: seguimientos =======
CREATE POLICY "Admins see all seguimientos"
  ON public.seguimientos FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND rol = 'admin')
    OR vendedor_id = auth.uid()
  );

CREATE POLICY "Authenticated users can insert seguimientos"
  ON public.seguimientos FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ======= POLÍTICAS: reportes =======
CREATE POLICY "Admins see all reportes"
  ON public.reportes FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND rol = 'admin')
    OR vendedor_id = auth.uid()
  );

CREATE POLICY "Users can insert own reportes"
  ON public.reportes FOR INSERT
  WITH CHECK (auth.uid() = vendedor_id);

-- ============================================================
-- FUNCIÓN: Auto-crear perfil al registrar usuario
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.usuarios (id, nombre, email, rol)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nombre', new.email),
    new.email,
    COALESCE(new.raw_user_meta_data->>'rol', 'vendedor')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger al crear usuario
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- DATOS DE EJEMPLO (Opcional - borrar en producción)
-- ============================================================
-- Para crear tu primer admin, primero registra el usuario con Supabase Auth,
-- luego ejecuta (reemplaza el UUID con el ID real):
--
-- UPDATE public.usuarios SET rol = 'admin' WHERE id = 'tu-uuid-aqui';
