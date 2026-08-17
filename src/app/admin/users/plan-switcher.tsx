'use client'

import { useState } from 'react'
import { toggleUserPlan } from '../actions'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Loader2, Zap } from 'lucide-react'

export function PlanSwitcher({ userId, currentPlan }: { userId: string, currentPlan: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async (newPlan: 'free' | 'premium') => {
    setLoading(true)
    await toggleUserPlan(userId, newPlan)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex gap-2">
        {currentPlan === 'free' ? (
            <Button onClick={() => handleToggle('premium')} size="sm" className="bg-red-600 hover:bg-red-700">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 mr-1" />}
                Passer Premium
            </Button>
        ) : (
            <Button onClick={() => handleToggle('free')} size="sm" variant="outline">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Rendre Gratuit"}
            </Button>
        )}
    </div>
  )
}
