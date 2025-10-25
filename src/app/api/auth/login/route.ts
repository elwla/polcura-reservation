import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Simple JWT implementation for development
const simpleJwt = {
  sign: (payload: any) => {
    return Buffer.from(JSON.stringify(payload)).toString('base64')
  },
  verify: (token: string) => {
    try {
      return JSON.parse(Buffer.from(token, 'base64').toString())
    } catch {
      return null
    }
  }
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  try {
    console.log('🔐 Login attempt for:', email)
    
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('❌ User not found:', email)
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Usar bcrypt.compare para verificar la contraseña encriptada
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email)
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    const token = simpleJwt.sign({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    console.log('✅ Login successful for:', email)

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('❌ Login error:', error)
    return NextResponse.json(
      { 
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}