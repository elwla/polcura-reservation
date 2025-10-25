// components/AdminPanel.tsx
import { useState } from 'react';
import { AdminPanelProps, Reservation } from '../../../types/reservation';

export default function AdminPanel({ reservations, cabins, onUpdateStatus, loading = false }: AdminPanelProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  console.log('AdminPanel rendered with reservations:', reservations.length); // Debug

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading">Cargando reservas...</div>
      </div>
    );
  }

  const getCabinName = (cabinId: number): string => {
    const cabin = cabins.find(c => c.id === cabinId);
    return cabin ? cabin.name : 'Cabaña no encontrada';
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleStatusUpdate = async (reservationId: number, status: 'CONFIRMED' | 'REJECTED') => {
    setUpdatingId(reservationId);
    try {
      await onUpdateStatus(reservationId, status);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingReservations: Reservation[] = reservations.filter(r => r.status === 'PENDING');
  const confirmedReservations: Reservation[] = reservations.filter(r => r.status === 'CONFIRMED');
  const rejectedReservations: Reservation[] = reservations.filter(r => r.status === 'REJECTED');

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => (
    <div key={reservation.id} className={`reservation-card ${reservation.status.toLowerCase()}`}>
      <div className="reservation-info">
        <h4>{getCabinName(reservation.cabinId)}</h4>
        <p><strong>Fecha:</strong> {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}</p>
        <p><strong>Huésped:</strong> {reservation.guestName} ({reservation.guestEmail})</p>
        <p><strong>Teléfono:</strong> {reservation.guestPhone}</p>
        <p><strong>Huéspedes:</strong> {reservation.numberOfGuests}</p>
        <p><strong>Total:</strong> ${reservation.totalPrice}</p>
        {reservation.specialRequests && (
          <p><strong>Solicitudes especiales:</strong> {reservation.specialRequests}</p>
        )}
        <p><strong>Solicitado:</strong> {formatDate(reservation.createdAt)}</p>
      </div>
      {reservation.status === 'PENDING' && (
        <div className="reservation-actions">
          <button 
            onClick={() => handleStatusUpdate(reservation.id, 'CONFIRMED')}
            className="confirm-btn"
            disabled={updatingId === reservation.id}
          >
            {updatingId === reservation.id ? 'Confirmando...' : 'Confirmar'}
          </button>
          <button 
            onClick={() => handleStatusUpdate(reservation.id, 'REJECTED')}
            className="reject-btn"
            disabled={updatingId === reservation.id}
          >
            {updatingId === reservation.id ? 'Rechazando...' : 'Rechazar'}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-panel">
      <h2>Panel de Administración</h2>
      <p>Bienvenido al panel de administración. Aquí puedes gestionar las reservas.</p>
      
      <div className="reservations-section">
        <h3>Reservas Pendientes ({pendingReservations.length})</h3>
        {pendingReservations.length === 0 ? (
          <p className="no-reservations">No hay reservas pendientes</p>
        ) : (
          pendingReservations.map(reservation => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))
        )}
      </div>

      <div className="reservations-section">
        <h3>Reservas Confirmadas ({confirmedReservations.length})</h3>
        {confirmedReservations.length === 0 ? (
          <p className="no-reservations">No hay reservas confirmadas</p>
        ) : (
          confirmedReservations.map(reservation => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))
        )}
      </div>

      <div className="reservations-section">
        <h3>Reservas Rechazadas ({rejectedReservations.length})</h3>
        {rejectedReservations.length === 0 ? (
          <p className="no-reservations">No hay reservas rechazadas</p>
        ) : (
          rejectedReservations.map(reservation => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))
        )}
      </div>
    </div>
  );
}