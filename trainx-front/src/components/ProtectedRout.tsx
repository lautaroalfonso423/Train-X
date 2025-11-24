'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface ProtectedRoutesProps {
  children: ReactNode
   adminOnly?: boolean
}

export default function ProtectedRoutes({ children, adminOnly = false }: ProtectedRoutesProps) {
  const { user, token, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user || !token) {
        router.push('/login') 
      } else if (adminOnly && !isAdmin) {
        router.push('/dashboard/user') 
      } else {
        setChecked(true) 
      }
    }
  }, [user, token, loading, isAdmin, adminOnly, router])


  if (loading || !checked) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--background)]">
        <p className="text-lg text-orange-500">Cargando...</p>
      </div>
    )
  }

  return <>{children}</>
}