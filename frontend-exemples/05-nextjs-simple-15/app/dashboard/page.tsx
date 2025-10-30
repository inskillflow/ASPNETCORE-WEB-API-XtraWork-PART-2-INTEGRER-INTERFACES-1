'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { employeeService } from '@/services/employee.service';
import { UserResponse } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [stats, setStats] = useState({ employeeCount: 0 });
  
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData.user || userData);
    }
    
    loadStats();
  }, [router]);
  
  const loadStats = async () => {
    try {
      const employees = await employeeService.getAll();
      setStats({ employeeCount: employees.length });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  
  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };
  
  if (!user) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">XtraWork</h1>
          <div className="flex items-center gap-4">
            <span>@{user.username}</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{user.role}</span>
            <button onClick={handleLogout} className="btn btn-danger btn-sm">
              Déconnexion
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        <div className="card bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">Bienvenue, {user.firstName} {user.lastName} !</h2>
          <p className="opacity-90">Tableau de bord de gestion</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-gray-600 text-sm mb-2">Total Employés</h3>
            <div className="text-3xl font-bold">{stats.employeeCount}</div>
          </div>
          <div className="card">
            <h3 className="text-gray-600 text-sm mb-2">Votre Rôle</h3>
            <div className="text-2xl font-bold">{user.role}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/dashboard/employees" className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-xl font-bold mb-1">Employés</h3>
            <p className="text-gray-600">Voir la liste des employés</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

