// ==================== AUTH TYPES ====================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'User' | 'Manager' | 'Admin';
}

export interface AuthResponse {
  token: string;
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  expiresAt: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

// ==================== EMPLOYEE TYPES ====================

export interface EmployeeRequest {
  firstName: string;
  lastName: string;
  birthDate: string; // ISO format: YYYY-MM-DD
  gender: 'Homme' | 'Femme' | 'Autre';
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  hireDate: string; // ISO format: YYYY-MM-DD
  salary: number;
  titleId: string; // GUID
}

export interface EmployeeResponse {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  hireDate: string;
  salary: number;
  titleId: string;
  titleName: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== TITLE TYPES ====================

export interface TitleRequest {
  name: string;
  description: string;
  department: string;
}

export interface TitleResponse {
  id: string;
  name: string;
  description: string;
  department: string;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== UTILITY TYPES ====================

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// ==================== STORE TYPES ====================

export interface AuthState {
  user: AuthResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

