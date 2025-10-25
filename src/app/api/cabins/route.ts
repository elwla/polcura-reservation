import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parseAmenities } from '../../libs/db-helper';
import { PrismaCabin } from '../../types/prisma';

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log('📦 Fetching cabins from database...')
    
    const cabins = await prisma.cabin.findMany({
      where: { isActive: true }
    })

    console.log(`✅ Found ${cabins.length} cabins`)

    // Convertir amenities de JSON string a array
    const cabinsWithParsedAmenities = cabins.map((cabin: PrismaCabin) => ({
      id: cabin.id,
      name: cabin.name,
      description: cabin.description,
      capacity: cabin.capacity,
      price: cabin.price,
      amenities: parseAmenities(cabin.amenities),
      image: cabin.image,
      isActive: cabin.isActive,
      createdAt: cabin.createdAt,
      updatedAt: cabin.updatedAt
    }))

    return NextResponse.json(cabinsWithParsedAmenities)
  } catch (error) {
    console.error('❌ Error fetching cabins:', error)
    return NextResponse.json(
      { 
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}