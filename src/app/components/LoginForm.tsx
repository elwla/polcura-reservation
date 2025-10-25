// components/LoginForm.tsx
"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LoginFormProps {
    redirectTo?: string;
    showRegisterLink?: boolean;
}

export default function LoginForm({ 
    redirectTo = "/pages/reservation",
    showRegisterLink = false
}: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Credenciales inválidas. Por favor intenta nuevamente.');
            } else {
                router.refresh();
                if (redirectTo) {
                    setTimeout(() => router.push(redirectTo), 500);
                }
            }
        } catch (error) {
            setError('Error al iniciar sesión. Por favor intenta más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-10"> {/* ✅ Aumentado de space-y-8 a space-y-10 */}
                
                {/* Header con más espacio */}
                <div className="text-center space-y-4"> {/* ✅ Añadido space-y-4 */}
                    <div className="mx-auto h-20 w-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg"> {/* ✅ Aumentado tamaño */}
                        <span className="text-white text-3xl font-bold">C</span> {/* ✅ Texto más grande */}
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3"> {/* ✅ Texto más grande */}
                        Cabañas Polcura
                    </h1>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2"> {/* ✅ Texto más grande */}
                        Acceso Administrativo
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed"> {/* ✅ Texto más grande y mejor line-height */}
                        Ingresa tus credenciales para gestionar las reservas
                    </p>
                </div>

                {/* Form Card con más padding */}
                <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100"> {/* ✅ Aumentado padding de p-8 a p-10 */}
                    
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"> {/* ✅ Aumentado margin-bottom */}
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    <form className="space-y-8" onSubmit={handleSubmit}> {/* ✅ Aumentado de space-y-6 a space-y-8 */}
                        
                        <div className="space-y-6"> {/* ✅ Aumentado de space-y-5 a space-y-6 */}
                            
                            {/* Email Field */}
                            <div className="space-y-3"> {/* ✅ Añadido espacio interno */}
                                <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-3"> {/* ✅ Texto más grande */}
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"> {/* ✅ Aumentado padding-left */}
                                        <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"> {/* ✅ Iconos más grandes */}
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200" 
                                        /* ✅ Aumentado padding, texto y border-radius */
                                        placeholder="admin@polcura.com"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-3"> {/* ✅ Añadido espacio interno */}
                                <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-3"> {/* ✅ Texto más grande */}
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"> {/* ✅ Aumentado padding-left */}
                                        <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"> {/* ✅ Iconos más grandes */}
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                                        /* ✅ Aumentado padding, texto y border-radius */
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button con más tamaño */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 transform hover:scale-[1.02]"
                            /* ✅ Aumentado padding y texto */
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Iniciando sesión...
                                </>
                            ) : (
                                'Acceder al Panel'
                            )}
                        </button>

                        {/* Back Link con más espacio */}
                        <div className="text-center pt-6 border-t border-gray-200"> {/* ✅ Aumentado padding-top */}
                            <Link 
                                href="/pages/reservation" 
                                className="inline-flex items-center text-base text-gray-600 hover:text-gray-900 transition duration-200 font-medium" 
                                /* ✅ Texto más grande y font-medium */
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver al sitio principal
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Footer con más espacio */}
                <div className="text-center pt-6"> {/* ✅ Añadido padding-top */}
                    <p className="text-sm text-gray-500"> {/* ✅ Texto un poco más grande */}
                        &copy; 2024 Cabañas Ecológicas Polcura. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}