import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="card max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-2">XtraWork</h1>
        <p className="text-gray-600 mb-6">Gestion des employés - Next.js 15</p>
        
        <div className="space-y-3">
          <Link href="/login" className="block btn btn-primary w-full">
            Se connecter
          </Link>
          
          <div className="alert alert-success text-sm">
            <strong>Compte de test :</strong><br />
            Username : admin<br />
            Password : Admin123!
          </div>
        </div>
      </div>
    </div>
  )
}

