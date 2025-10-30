import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            XtraWork
          </h1>
          <p className="text-gray-600">
            Système de gestion des employés
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-center"
          >
            Se connecter
          </Link>

          <Link
            href="/auth/register"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-200 text-center"
          >
            Créer un compte
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600 space-y-2">
            <p className="font-semibold">🔐 Rôles disponibles :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>User</strong> : Lecture et création</li>
              <li><strong>Manager</strong> : + Modification</li>
              <li><strong>Admin</strong> : Tous les droits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

