// components/Calendar.tsx
import { useState, useEffect, JSX } from 'react';
import { CalendarProps, GuestInfo, DateStatus } from '../../../types/reservation';

export default function Calendar({ cabin, reservations, onReservation }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({ 
    start: null, 
    end: null 
  });
  const [showForm, setShowForm] = useState<boolean>(false);
  const [today] = useState<Date>(new Date());

  useEffect(() => {
    setSelectedDates({ start: null, end: null });
  }, [currentMonth]);

  useEffect(() => {
}, [reservations]);

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const normalizeDate = (date: Date | string): Date => {
    const dateObj = ensureDate(date);
    return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  };

  const ensureDate = (date: Date | string): Date => {
    if (date instanceof Date) {
      return date;
    }
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  };

  const isPastDate = (date: Date): boolean => {
    const normalizedDate = normalizeDate(date);
    const normalizedToday = normalizeDate(today);
    return normalizedDate < normalizedToday;
  };

  const getDateStatus = (date: Date): DateStatus => {
    const normalizedDate = normalizeDate(date);
    
    if (isPastDate(date)) {
      return 'past';
    }

    // Filtrar reservas de esta cabaña específica
    const cabinReservations = reservations.filter(r => r.cabinId === cabin.id);

    const isConfirmed = cabinReservations.some(res => {
      const start = normalizeDate(ensureDate(res.startDate));
      const end = normalizeDate(ensureDate(res.endDate));
      return res.status === 'CONFIRMED' && normalizedDate >= start && normalizedDate <= end;
    });

    const isPending = cabinReservations.some(res => {
      const start = normalizeDate(ensureDate(res.startDate));
      const end = normalizeDate(ensureDate(res.endDate));
      return res.status === 'PENDING' && normalizedDate >= start && normalizedDate <= end;
    });

    const isSelected = selectedDates.start && selectedDates.end && 
                      normalizedDate >= normalizeDate(selectedDates.start) && 
                      normalizedDate <= normalizeDate(selectedDates.end);

    if (isConfirmed) return 'confirmed';
    if (isPending) return 'pending';
    if (isSelected) return 'selected';
    return 'available';
  };

  const isDateSelectable = (date: Date): boolean => {
    const status = getDateStatus(date);
    return status === 'available' && !isPastDate(date);
  };

  const handleDateClick = (date: Date): void => {
    if (!isDateSelectable(date)) return;

    const normalizedDate = normalizeDate(date);

    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      setSelectedDates({ start: normalizedDate, end: null });
    } else if (selectedDates.start && !selectedDates.end) {
      if (normalizedDate < selectedDates.start) {
        setSelectedDates({ start: normalizedDate, end: selectedDates.start });
      } else {
        setSelectedDates({ ...selectedDates, end: normalizedDate });
      }
    }
  };

  const handleReservationSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!selectedDates.start || !selectedDates.end) {
      alert('Por favor selecciona fechas válidas');
      return;
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const normalizedTomorrow = normalizeDate(tomorrow);

    if (selectedDates.start < normalizedTomorrow) {
      alert('Las reservas deben comenzar desde mañana en adelante');
      return;
    }

    const guestInfo: GuestInfo = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      guests: parseInt(formData.get('guests') as string),
      specialRequests: formData.get('specialRequests') as string
    };

    try {
      await onReservation(cabin.id, selectedDates.start, selectedDates.end, guestInfo);
      setShowForm(false);
      setSelectedDates({ start: null, end: null });
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  const renderCalendar = (): JSX.Element[] => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: JSX.Element[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const status = getDateStatus(date);
      const normalizedDate = normalizeDate(date);
      const isStart = selectedDates.start && normalizedDate.getTime() === selectedDates.start.getTime();
      const isEnd = selectedDates.end && normalizedDate.getTime() === selectedDates.end.getTime();

      days.push(
        <div
          key={day}
          className={`calendar-day ${status} ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''}`}
          onClick={() => handleDateClick(date)}
          title={getDateTooltip(status)}
        >
          {day}
          {(status === 'pending' || status === 'confirmed') && (
            <div className={`status-indicator ${status}`}></div>
          )}
        </div>
      );
    }

    return days;
  };

  const getDateTooltip = (status: DateStatus): string => {
    switch (status) {
      case 'past':
        return 'Fecha pasada - No disponible';
      case 'confirmed':
        return 'Reserva confirmada - No disponible';
      case 'pending':
        return 'Reserva pendiente - No disponible';
      case 'selected':
        return 'Fechas seleccionadas';
      default:
        return 'Disponible para reservar';
    }
  };

  const navigateMonth = (direction: number): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  const calculateTotalNights = (): number => {
    if (!selectedDates.start || !selectedDates.end) return 0;
    return Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = (): number => {
    return calculateTotalNights() * cabin.price;
  };

  const renderLegend = (): JSX.Element => {
    return (
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color available"></div>
          <span>Disponible</span>
        </div>
        <div className="legend-item">
          <div className="legend-color pending"></div>
          <span>Reserva pendiente</span>
        </div>
        <div className="legend-item">
          <div className="legend-color confirmed"></div>
          <span>Reserva confirmada</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>Seleccionado</span>
        </div>
        <div className="legend-item">
          <div className="legend-color past"></div>
          <span>No disponible</span>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => navigateMonth(-1)} className="nav-button">‹</button>
        <h3>{currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</h3>
        <button onClick={() => navigateMonth(1)} className="nav-button">›</button>
      </div>

      {renderLegend()}

      <div className="calendar-grid">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
        {renderCalendar()}
      </div>

      {selectedDates.start && selectedDates.end && (
        <div className="reservation-summary">
          <p>
            Seleccionado: {selectedDates.start.toLocaleDateString()} - {selectedDates.end.toLocaleDateString()}
          </p>
          <p>
            Total: {calculateTotalNights()} noches - ${calculateTotalPrice()}
          </p>
          <button 
            onClick={() => setShowForm(true)}
            className="reserve-button"
          >
            Reservar
          </button>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="reservation-form">
            <h3>Completar Reserva - {cabin.name}</h3>
            <div className="reservation-dates">
              <p><strong>Fechas:</strong> {selectedDates.start?.toLocaleDateString()} - {selectedDates.end?.toLocaleDateString()}</p>
              <p><strong>Total:</strong> {calculateTotalNights()} noches - ${calculateTotalPrice()}</p>
            </div>
            <form onSubmit={handleReservationSubmit}>
              <div className="form-group">
                <label>Nombre completo *</label>
                <input type="text" name="name" required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" required />
              </div>
              <div className="form-group">
                <label>Teléfono *</label>
                <input type="tel" name="phone" required />
              </div>
              <div className="form-group">
                <label>Número de huéspedes *</label>
                <select name="guests" required>
                  {[...Array(cabin.capacity).keys()].map(num => (
                    <option key={num + 1} value={num + 1}>{num + 1}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Solicitudes especiales (opcional)</label>
                <textarea 
                  name="specialRequests" 
                  rows={3}
                  placeholder="Comentarios adicionales, horario de llegada, mascotas, etc."
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit">Enviar Reserva</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}