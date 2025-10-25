// types/reservation.ts
export interface Cabin {
  id: number;
  name: string;
  description: string;
  capacity: number;
  price: number;
  amenities: string[];
}

export interface Reservation {
  id: number;
  cabinId: number;
  startDate: Date | string;
  endDate: Date | string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  numberOfGuests: number;
  specialRequests?: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  totalPrice: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  guests: number;
  specialRequests?: string;
}

// ✅ CORREGIDO: DateStatus ahora es un tipo union de strings literales
export type DateStatus = 'available' | 'pending' | 'confirmed' | 'selected' | 'past';

// Props para componentes
export interface CabinCardProps {
  cabin: Cabin;
  onSelect: () => void;
  isSelected: boolean;
}

export interface CalendarProps {
  cabin: Cabin;
  reservations: Reservation[];
  onReservation: (cabinId: number, startDate: Date, endDate: Date, guestInfo: GuestInfo) => Promise<void>;
}

export interface AdminPanelProps {
  reservations: Reservation[];
  cabins: Cabin[];
  onUpdateStatus: (reservationId: number, status: 'CONFIRMED' | 'REJECTED') => Promise<void>;
  loading?: boolean;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}