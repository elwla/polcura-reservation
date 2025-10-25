import { Cabin, Reservation, User, SystemConfig } from './reservation';

// Tipos para las respuestas de la base de datos
export interface CabinWithRelations extends Cabin {
  reservations?: Reservation[];
}

export interface ReservationWithCabin extends Reservation {
  cabin: Cabin;
}

// Tipo para el cabin raw de Prisma (con amenities como string)
export interface PrismaCabin {
  id: number;
  name: string;
  description: string;
  capacity: number;
  price: number;
  amenities: string; // JSON string from database
  image: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}