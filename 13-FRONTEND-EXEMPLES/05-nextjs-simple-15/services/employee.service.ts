/**
 * Service pour la gestion des employés
 */

import apiClient from '@/lib/api-client';
import { EmployeeResponse } from '@/types';

export const employeeService = {
  async getAll(): Promise<EmployeeResponse[]> {
    const response = await apiClient.get<EmployeeResponse[]>('/employees');
    return response.data;
  },
  
  async getById(id: string): Promise<EmployeeResponse> {
    const response = await apiClient.get<EmployeeResponse>(`/employees/${id}`);
    return response.data;
  }
};

