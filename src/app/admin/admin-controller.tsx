'use client'

import { useState } from 'react'
import { toggleUserPlan } from './actions'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Loader2, Zap } from 'lucide-react'

export function AdminController({ userId, currentPlan }: { userId: string, currentPlan: string }) {
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const router = useRouter()

  const handleToggle = async (newPlan: 'free' | 'premium') => {
    setLoading(true)
    setFeedback(null)
    const res = await toggleUserPlan(userId, newPlan)
    if (res.error) {
        setFeedback(`Erreur: ${res.error}`)
    } else {
        setFeedback(res.message || 'Plan mis à jour')
        setTimeout(() => setFeedback(null), 3000)
    }
    setLoading(false)
    router.refresh()
  }

  return (
    <Card className="bg-[#141418] border-border/50">
        <CardContent className="pt-6 space-y-4">
            <div className="flex gap-4">
            <Button 
                onClick={() => handleToggle('free')} 
                disabled={loading || currentPlan === 'free'}
                variant="outline"
                className="flex-1 rounded-xl"
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Passer en FREE
            </Button>
            <Button 
                onClick={() => handleToggle('premium')} 
                disabled={loading || currentPlan === 'premium'}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700"
            >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                Passer en PREMIUM
            </Button>
            </div>
            
            {feedback && (
                <div className="flex items-center gap-2 text-sm text-emerald-400 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4" />
                    {feedback}
                </div>
            )}
        </CardContent>
    </Card>
  )
}
