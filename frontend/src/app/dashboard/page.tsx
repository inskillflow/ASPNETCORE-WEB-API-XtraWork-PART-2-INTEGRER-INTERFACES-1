'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    {
      title: 'Employés',
      description: 'Gérer la liste des employés',
      href: '/dashboard/employees',
      icon: '👥',
      color: 'bg-blue-500',
    },
    {
      title: 'Titres',
      description: 'Gérer les postes et titres',
      href: '/dashboard/titles',
      icon: '👔',
      color: 'bg-green-500',
    },
    {
      title: 'Profil',
      description: 'Voir mon profil',
      href: '/dashboard/profile',
      icon: '👤',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard XtraWork</h1>
              <p className="text-sm text-gray-600 mt-1">
                Bienvenue, <span className="font-semibold">{user.firstName} {user.lastName}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                user.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
              <p className="text-blue-100">{user.email}</p>
              <p className="text-blue-200 text-sm mt-1">@{user.username} • {user.role}</p>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 p-6 border-2 border-transparent hover:border-blue-500"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-2xl`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employés</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">-</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Titres</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">-</p>
              </div>
              <div className="text-4xl">🏆</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Votre Rôle</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{user.role}</p>
              </div>
              <div className="text-4xl">🔐</div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📚 Guide d'utilisation</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>Employés</strong> : Créer, modifier et consulter les employés</p>
            <p>• <strong>Titres</strong> : Gérer les postes et départements</p>
            <p>• <strong>Profil</strong> : Voir vos informations personnelles</p>
          </div>
        </div>
      </main>
    </div>
  );
}

