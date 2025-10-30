import { get, post, put, del } from '@/lib/api-client';
import { EmployeeRequest, EmployeeResponse } from '@/types';

/**
 * Service de gestion des employés
 */
export const employeeService = {
  /**
   * Récupérer tous les employés
   */
  async getAll(): Promise<EmployeeResponse[]> {
    return await get<EmployeeResponse[]>('/employees');
  },

  /**
   * Récupérer un employé par ID
   */
  async getById(id: string): Promise<EmployeeResponse> {
    return await get<EmployeeResponse>(`/employees/${id}`);
  },

  /**
   * Créer un nouvel employé
   */
  async create(data: EmployeeRequest): Promise<EmployeeResponse> {
    return await post<EmployeeResponse>('/employees', data);
  },

  /**
   * Mettre à jour un employé
   */
  async update(id: string, data: EmployeeRequest): Promise<EmployeeResponse> {
    return await put<EmployeeResponse>(`/employees/${id}`, data);
  },

  /**
   * Supprimer un employé (Manager/Admin seulement)
   */
  async delete(id: string): Promise<void> {
    await del(`/employees/${id}`);
  },

  /**
   * Rechercher des employés
   */
  async search(query: string): Promise<EmployeeResponse[]> {
    const allEmployees = await this.getAll();
    
    if (!query) return allEmployees;
    
    const searchTerm = query.toLowerCase();
    return allEmployees.filter(emp => 
      emp.firstName.toLowerCase().includes(searchTerm) ||
      emp.lastName.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.titleName.toLowerCase().includes(searchTerm)
    );
  },

  /**
   * Filtrer les employés par titre
   */
  async filterByTitle(titleId: string): Promise<EmployeeResponse[]> {
    const allEmployees = await this.getAll();
    return allEmployees.filter(emp => emp.titleId === titleId);
  },

  /**
   * Statistiques des employés
   */
  async getStatistics(): Promise<{
    total: number;
    averageSalary: number;
    averageAge: number;
    byGender: Record<string, number>;
  }> {
    const employees = await this.getAll();
    
    const total = employees.length;
    const averageSalary = employees.reduce((sum, emp) => sum + emp.salary, 0) / total;
    const averageAge = employees.reduce((sum, emp) => sum + emp.age, 0) / total;
    
    const byGender = employees.reduce((acc, emp) => {
      acc[emp.gender] = (acc[emp.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return { total, averageSalary, averageAge, byGender };
  },
};

