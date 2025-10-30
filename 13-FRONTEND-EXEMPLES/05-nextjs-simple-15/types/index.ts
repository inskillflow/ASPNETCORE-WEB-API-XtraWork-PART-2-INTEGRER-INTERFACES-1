// Types pour l'API XtraWork

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface EmployeeResponse {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  age: number;
  gender: string;
  titleId: string;
  titleDescription: string;
  createdAt: string;
}

export interface TitleResponse {
  id: string;
  description: string;
  createdAt: string;
}

