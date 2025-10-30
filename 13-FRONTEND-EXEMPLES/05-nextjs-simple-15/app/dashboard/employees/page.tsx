'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { employeeService } from '@/services/employee.service';
import { EmployeeResponse } from '@/types';

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadEmployees();
  }, [router]);
  
  const loadEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">XtraWork</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/dashboard/employees" className="hover:underline font-semibold">Employés</Link>
            <button onClick={handleLogout} className="btn btn-danger btn-sm">
              Déconnexion
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Liste des Employés</h1>
            <Link href="/dashboard" className="btn btn-secondary btn-sm">
              ← Retour
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          ) : employees.length === 0 ? (
            <p className="text-center py-8 text-gray-600">Aucun employé trouvé.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Prénom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date naissance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Âge</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Genre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Titre</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{employee.firstName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(employee.birthDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.age} ans</td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.titleDescription}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

