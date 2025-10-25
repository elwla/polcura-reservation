"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const NavBar = () => {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status !== 'loading') {
            setIsLoading(false);
        }
    }, [status]);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    if (isLoading) {
        return (
            <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-4 z-50 transition-all duration-300">
                <div className="mx-auto flex justify-between items-center">
                    <Link href="/" className="text-white text-lg font-bold">Cabañas Ecológicas Polcura</Link>
                    <div className="text-gray-300">Cargando...</div>
                </div>
            </nav>
        );
    }

    const isLoggedIn = !!session;

    return (
        <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-4 z-50 transition-all duration-300">
            <div className="mx-auto flex justify-between items-center">
                <Link href="/" className="text-white text-lg font-bold">Cabañas Ecológicas Polcura</Link>
                <div className="flex items-center space-x-4">
                    <Link href="/pages/about" className="text-gray-300 hover:text-white transition duration-200">Acerca de nosotros</Link>
                    <Link href="/pages/reservation" className="text-gray-300 hover:text-white transition duration-200">Reserva con nosotros</Link>
                    <Link href="/pages/oursCabains" className="text-gray-300 hover:text-white transition duration-200">Nuestras cabañas y espacios</Link>
                    <Link href="/contact" className="text-gray-300 hover:text-white transition duration-200">Contactanos</Link>
                    {!!isLoggedIn && (
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;