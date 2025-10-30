import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'XtraWork - Next.js',
  description: 'Application de gestion des employés',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}

