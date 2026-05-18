export type UserRole = "admin" | "vendedor";

export type ClienteEstado =
  | "nuevo"
  | "contactado"
  | "en_conversacion"
  | "interesado"
  | "cerrado"
  | "perdido";

export type SeguimientoTipo = "llamada" | "whatsapp" | "reunion" | "correo";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  activo: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  telefono?: string;
  email?: string;
  estado: ClienteEstado;
  observaciones?: string;
  vendedor_id?: string;
  ultimo_contacto?: string;
  created_at: string;
  updated_at: string;
  vendedor?: Usuario;
}

export interface Seguimiento {
  id: string;
  cliente_id: string;
  vendedor_id: string;
  tipo: SeguimientoTipo;
  comentarios?: string;
  proxima_fecha?: string;
  created_at: string;
  cliente?: Cliente;
  vendedor?: Usuario;
}

export interface Reporte {
  id: string;
  vendedor_id: string;
  fecha: string;
  clientes_contactados: number;
  seguimientos_realizados: number;
  ventas: number;
  problemas?: string;
  objetivos?: string;
  created_at: string;
  vendedor?: Usuario;
}

export interface DashboardStats {
  totalClientes: number;
  clientesNuevos: number;
  seguimientosPendientes: number;
  ventasMes: number;
  reporteHoy: boolean;
}
