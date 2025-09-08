export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  firstname: string;
  lastname: string;
  role: string;
}

export interface SignupRequest {
  firstname: string;
  lastname: string;
  passwordHash: string;
  confirmPassword: string;
  address: string;
  email: string;
  phone: string;
  role: string;
  roleId: number;
}

export interface SignupResponse {
  userId: number;
  firstname: string;
  lastname: string;
  address: string;
  email: string;
  phone: string;
  roleId: number;
  success: boolean;
  message: string;
}

export interface User {
  userId: number;
  firstname: string;
  lastname: string;
  passwordHash: string;
  address: string;
  email: string;
  phone: string;
  roleId: number;
  roleName?: string;
}
