export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  rol: string;
}
export interface RegistroRequest {
  username: string;
  password: string;
}
