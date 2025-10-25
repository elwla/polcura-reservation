// app/pages/adminlogin/page.tsx
"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoginForm from '../../components/LoginForm';

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Si ya está autenticado como admin, redirigir a reservation
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role?.toUpperCase() === 'ADMIN') {
      router.push('/pages/reservation');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return <LoginForm redirectTo="/pages/reservation" showRegisterLink={false} />;
}