'use client'

import { useState } from 'react'
import { toggleUserPlan } from './actions'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function AdminController({ userId, currentPlan }: { userId: string, currentPlan: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async (newPlan: 'free' | 'premium') => {
    setLoading(true)
    await toggleUserPlan(userId, newPlan)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex gap-4">
      <Button 
        onClick={() => handleToggle('free')} 
        disabled={loading || currentPlan === 'free'}
        className="bg-gray-600"
      >
        Passer en FREE
      </Button>
      <Button 
        onClick={() => handleToggle('premium')} 
        disabled={loading || currentPlan === 'premium'}
        className="bg-red-600"
      >
        Passer en PREMIUM
      </Button>
    </div>
  )
}
