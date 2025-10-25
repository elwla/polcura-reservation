// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear usuario administrador
  const adminUser = await prisma.user.upsert({
    where: { email: 'wladimir.msb@gmail.com' },
    update: {},
    create: {
      email: 'wladimir.msb@gmail.com',
      password: await bcrypt.hash('ca1Ca203', 12),
      name: 'Administrador',
    },
  })
  console.log('✅ Usuario administrador creado:', adminUser.email)

  // Eliminar cabañas existentes para evitar duplicados
  await prisma.cabin.deleteMany({})
  console.log('🧹 Cabins existentes eliminados')

  // Crear cabañas iniciales
  const cabin1 = await prisma.cabin.create({
    data: {
      name: "Cabaña del Bosque",
      description: "Acogedora cabaña con chimenea y vista al bosque",
      capacity: 4,
      price: 120,
      amenities: {
        create: [
          { name: "WiFi" },
          { name: "Terraza" },
          { name: "Cocina completa" },
          { name: "Vista al lago" }
        ]
      },
      image: "/cabin1.jpg",
      isActive: true
    }
  })

  const cabin2 = await prisma.cabin.create({
    data: {
      name: "Cabaña del Lago",
      description: "Cabaña frente al lago con terraza privada",
      capacity: 4,
      price: 120,
      amenities: {
        create: [
          { name: "WiFi" },
          { name: "Terraza" },
          { name: "Cocina completa" },
          { name: "Vista al lago" }
        ]
      },
      image: "/cabin2.jpg",
      isActive: true
    }
  })

  const cabin3 = await prisma.cabin.create({
    data: {
      name: "Cabaña Premium",
      description: "Amplia cabaña con jacuzzi y vista panorámica",
      capacity: 6,
      price: 200,
      amenities: {
        create: [
          { name: "WiFi" },
          { name: "Jacuzzi" },
          { name: "Cocina gourmet" },
          { name: "TV 4K" },
          { name: "Terraza privada" }
        ]
      },
      image: "/cabin3.jpg",
      isActive: true
    }
  })

  console.log('✅ Cabañas creadas:', cabin1.name, cabin2.name, cabin3.name)

  // Eliminar configuraciones existentes
  await prisma.systemConfig.deleteMany({})

  // Configuración del sistema
  const config = await prisma.systemConfig.createMany({
    data: [
      { key: 'MIN_RESERVATION_DAYS', value: '1' },
      { key: 'MAX_RESERVATION_DAYS', value: '30' },
      { key: 'CHECK_IN_TIME', value: '15:00' },
      { key: 'CHECK_OUT_TIME', value: '11:00' }
    ]
  })

  console.log('✅ Configuración del sistema creada')

  // Crear algunas reservas de ejemplo
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)

  const reservation1 = await prisma.reservation.create({
    data: {
      cabinId: cabin1.id,
      startDate: tomorrow,
      endDate: nextWeek,
      guestName: "Juan Pérez",
      guestEmail: "juan@example.com",
      guestPhone: "+56912345678",
      numberOfGuests: 2,
      totalPrice: 720,
      status: 'CONFIRMED',
      specialRequests: "Llegaremos tarde en la noche"
    }
  })

  console.log('✅ Reserva de ejemplo creada')

  console.log('🎉 Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })