// app/pages/reservation/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Calendar from './components/Calendar';
import CabinCard from './components/CabinCard';
import AdminPanel from './components/AdminPanel';
import { Cabin, Reservation, GuestInfo } from '../../types/reservation';
import { apiClient } from '../../libs/api';
import '../../globals.css';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [selectedCabin, setSelectedCabin] = useState<Cabin | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reservationsLoading, setReservationsLoading] = useState<boolean>(false);

  // Determinar si es admin basado en la sesión de Next-auth
  const isAdmin = session?.user?.role === 'ADMIN';
  const isLoggedIn = !!session;

  useEffect(() => {
    loadInitialData();
  }, []);

  // Redirigir a adminlogin si no es admin pero está en modo admin
  useEffect(() => {
    if (status === 'unauthenticated' && window.location.pathname.includes('ADMIN')) {
      router.push('/pages/adminlogin');
    }
  }, [status, router]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const cabinsData = await apiClient.getCabins();
      setCabins(cabinsData);
      
      await loadReservations();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadReservations = async () => {
    try {
      setReservationsLoading(true);
      const reservationsData: Reservation[] = await apiClient.getReservations();
      
      const reservationsWithDates: Reservation[] = reservationsData.map(res => ({
        ...res,
        startDate: new Date(res.startDate),
        endDate: new Date(res.endDate),
        createdAt: new Date(res.createdAt),
        updatedAt: new Date(res.updatedAt)
      }));

      setReservations(reservationsWithDates);
    } catch (err) {
      console.error('Error loading reservations:', err);
      setReservations([]);
    } finally {
      setReservationsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/pages/reservation' });
  };

  const handleReservation = async (cabinId: number, startDate: Date, endDate: Date, guestInfo: GuestInfo) => {
    try {
      await apiClient.createReservation({
        cabinId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        guestName: guestInfo.name,
        guestEmail: guestInfo.email,
        guestPhone: guestInfo.phone,
        numberOfGuests: guestInfo.guests,
        specialRequests: guestInfo.specialRequests || ''
      });

      alert('Reserva enviada exitosamente. Te contactaremos para confirmarla.');
      setSelectedCabin(null);
      
      await loadReservations();
      
    } catch (err) {
      alert('Error al crear la reserva. Por favor intenta nuevamente.');
      console.error('Reservation error:', err);
    }
  };

  const updateReservationStatus = async (reservationId: number, status: 'CONFIRMED' | 'REJECTED') => {
    try {
      await apiClient.updateReservationStatus(reservationId, status);
      
      await loadReservations();
      
    } catch (err) {
      alert('Error al actualizar la reserva');
      console.error('Update reservation error:', err);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <Head>
        <title>Reserva de Cabañas - Paraíso Natural</title>
        <meta name="description" content="Sistema de reservas para cabañas de montaña" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="header">
        <h1 className="title">Reserva de Cabañas</h1>
        <p className="subtitle">Tu escape perfecto en la naturaleza</p>
        
        {isLoggedIn && isAdmin && (
          <div className="admin-controls">
            <span>Modo Administrador - {session.user?.name}</span>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        )}
        
        {/* ❌ ELIMINADO: Botón "Modo Administrador" */}
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Lógica principal: Si es admin muestra AdminPanel, sino muestra interfaz normal */}
      {isAdmin && isLoggedIn ? (
        <AdminPanel 
          reservations={reservations}
          cabins={cabins}
          onUpdateStatus={updateReservationStatus}
          loading={reservationsLoading}
        />
      ) : (
        <main className="main-content">
          <section className="cabins-section">
            <h2>Nuestras Cabañas</h2>
            <div className="cabins-grid">
              {cabins.map(cabin => (
                <CabinCard 
                  key={cabin.id}
                  cabin={cabin}
                  onSelect={() => setSelectedCabin(cabin)}
                  isSelected={selectedCabin?.id === cabin.id}
                />
              ))}
            </div>
          </section>

          {selectedCabin && (
            <section className="calendar-section">
              <h2>Reservar {selectedCabin.name}</h2>
              <Calendar 
                cabin={selectedCabin}
                reservations={reservations}
                onReservation={handleReservation}
              />
            </section>
          )}
        </main>
      )}

      <footer className="footer">
        <p>&copy; 2024 Paraíso Natural - Reservas de Cabañas</p>
      </footer>
    </div>
  );
}