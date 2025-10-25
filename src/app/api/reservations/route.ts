import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const where = status ? { status } : {}
    
    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        cabin: {
          select: {
            name: true,
            price: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(reservations)
  } catch (error) {
    console.error('❌ Error fetching reservations:', error)
    return NextResponse.json(
      { 
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {    
    const body = await request.json()
    
    const {
      cabinId,
      startDate,
      endDate,
      guestName,
      guestEmail,
      guestPhone,
      numberOfGuests,
      specialRequests
    } = body

    if (!cabinId || !startDate || !endDate || !guestName || !guestEmail || !guestPhone) {
      return NextResponse.json(
        { message: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const cabin = await prisma.cabin.findFirst({
      where: { id: parseInt(cabinId), isActive: true }
    })

    if (!cabin) {
      return NextResponse.json(
        { message: 'Cabaña no encontrada' },
        { status: 404 }
      )
    }

    const nights = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    )
    const totalPrice = nights * cabin.price

    const reservation = await prisma.reservation.create({
      data: {
        cabinId: parseInt(cabinId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        guestName,
        guestEmail,
        guestPhone,
        numberOfGuests: parseInt(numberOfGuests),
        totalPrice,
        specialRequests: specialRequests || '',
        status: 'PENDING'
      },
      include: {
        cabin: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Reserva creada exitosamente',
      reservation
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating reservation:', error)
    return NextResponse.json(
      { 
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}