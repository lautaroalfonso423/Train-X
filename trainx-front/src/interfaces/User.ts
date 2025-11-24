

export interface IUser {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  profilePicture?: string;
  status?: string;
}


// Respuesta de login
export interface IAuthResponse {
  access_token: string;
  user: IUser;
}

// Datos enviados al backend para login
export interface ILoginData {
  email: string;
  password: string;
}

// Datos enviados al backend para register
export interface IRegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface JWTPayload {
  sub: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
  profilePicture?: string;
}

export interface IUserList {
  id: string;                // Identificador único del usuario
  name: string;              // Nombre del usuario
  email?: string;            // Opcional: si el backend lo provee
  plan?: string;             // Nombre del plan actual (ej: "Mensual", "3 Días", etc.)
  status?: string;           // Estado de la suscripción ("Activo", "Inactivo", etc.)
  lastPayment?: string | null; // Fecha del último pago o null si no hay registro
  trainer?: string;          // Nombre del entrenador asignado
  createdAt?: string;        // Opcional: fecha de alta del usuario
  updatedAt?: string;        // Opcional: última actualización
}
