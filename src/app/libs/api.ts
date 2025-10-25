// libs/api.ts
import { getSession } from 'next-auth/react';
import { Cabin, Reservation } from '@/app/types/reservation';

// Función auxiliar para obtener headers con auth
async function getAuthHeaders() {
  const session = await getSession();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // ✅ Ahora accessToken existe en el tipo Session
  if (session?.accessToken) {
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }
  
  return headers;
}

export const apiClient = {
  async getCabins(): Promise<Cabin[]> {
    const response = await fetch('/api/cabins', {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error fetching cabins');
    return response.json();
  },

  async getReservations(): Promise<Reservation[]> {
    const response = await fetch('/api/reservations', {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error fetching reservations');
    return response.json();
  },

  async createReservation(reservationData: {
    cabinId: number;
    startDate: string;
    endDate: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    numberOfGuests: number;
    specialRequests?: string;
  }) {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(reservationData),
    });
    if (!response.ok) throw new Error('Error creating reservation');
    return response.json();
  },

  async updateReservationStatus(reservationId: number, status: 'CONFIRMED' | 'REJECTED') {
    const response = await fetch(`/api/reservations/${reservationId}`, {
      method: 'PATCH',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Error updating reservation');
    return response.json();
  },
};