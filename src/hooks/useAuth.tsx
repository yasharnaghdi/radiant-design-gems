import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'

import { supabase } from '@/integrations/supabase/client'

export interface Profile {
  id: string
  display_name: string
  persona: string
  career_stage: string
  career_goal: string
  storyline: string
  onboarded: boolean
}

interface AuthState {
  session: Session | null
  user: User | null
  profile: Profile | null
  roles: string[]
  loading: boolean
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [roles, setRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const loadExtras = async (userId: string) => {
    const [{ data: profileRow }, { data: roleRows }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', userId),
    ])
    setProfile((profileRow as Profile) ?? null)
    setRoles((roleRows ?? []).map((r: { role: string }) => r.role))
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession?.user) {
        // Defer extra reads out of the auth callback
        setTimeout(() => void loadExtras(newSession.user.id), 0)
      } else {
        setProfile(null)
        setRoles([])
      }
    })

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user) void loadExtras(data.session.user.id)
      setLoading(false)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      roles,
      loading,
      refreshProfile: async () => {
        if (session?.user) await loadExtras(session.user.id)
      },
      signOut: async () => {
        await supabase.auth.signOut()
        setProfile(null)
        setRoles([])
      },
    }),
    [session, profile, roles, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
