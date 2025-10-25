import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

const prisma = new PrismaClient()

interface Params {
  params: {
    id: string
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
  
  if (!session) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!['CONFIRMED', 'REJECTED', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        { message: 'Estado inválido' },
        { status: 400 }
      )
    }

    const reservation = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        cabin: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      message: `Reserva ${status.toLowerCase()}`,
      reservation
    })
  } catch (error) {
    console.error('❌ Error updating reservation status:', error)
    return NextResponse.json(
      { 
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}