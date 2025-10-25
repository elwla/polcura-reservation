import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cabinId = searchParams.get('cabinId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!cabinId || !startDate || !endDate) {
      return NextResponse.json(
        { message: 'Parámetros requeridos: cabinId, startDate, endDate' },
        { status: 400 }
      )
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        cabinId: Number(cabinId),
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) }
          }
        ]
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true
      }
    })

    // También obtener información de la cabaña
    const cabin = await prisma.cabin.findFirst({
      where: { id: Number(cabinId), isActive: true },
      select: {
        id: true,
        name: true,
        capacity: true,
        price: true
      }
    })

    if (!cabin) {
      return NextResponse.json(
        { message: 'Cabaña no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      available: reservations.length === 0,
      cabin,
      conflictingReservations: reservations
    })
  } catch (error) {
    console.error('❌ Error checking availability:', error)
    return NextResponse.json(
      { 
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}