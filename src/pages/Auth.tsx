import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { supabase } from '@/integrations/supabase/client'
import { lovable } from '@/integrations/lovable/index'
import { useAuth } from '@/hooks/useAuth'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const { session } = useAuth()

  useEffect(() => {
    if (session) navigate('/onboarding', { replace: true })
  }, [session, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
            data: { display_name: displayName },
          },
        })
        if (error) throw error
        toast.success('Account created. You can start your onboarding now.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    })
    if (result.error) {
      toast.error('Google sign-in failed. Please try again.')
      return
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md glass-effect rounded-3xl p-8 clean-border">
        <h1 className="text-3xl font-bold mb-2">
          {mode === 'signin' ? 'Welcome back' : 'Join the roster'}
        </h1>
        <p className="text-muted-foreground mb-8">
          {mode === 'signin'
            ? 'Sign in to continue your career path.'
            : 'Create an account to build your persona and submit work.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl bg-black/30 clean-border px-4 py-3 outline-none focus:ring-2 focus:ring-accent-purple"
            />
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl bg-black/30 clean-border px-4 py-3 outline-none focus:ring-2 focus:ring-accent-purple"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl bg-black/30 clean-border px-4 py-3 outline-none focus:ring-2 focus:ring-accent-purple"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-accent-purple px-4 py-3 font-semibold text-white gentle-animation disabled:opacity-50"
          >
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full rounded-xl clean-border px-4 py-3 font-medium gentle-animation hover:bg-white/5"
        >
          Continue with Google
        </button>

        <button
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="mt-6 w-full text-sm text-muted-foreground hover:text-foreground gentle-animation"
        >
          {mode === 'signin'
            ? "Don't have an account? Create one"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
