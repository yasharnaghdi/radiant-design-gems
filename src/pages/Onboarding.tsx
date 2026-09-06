import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { CAREER_GOALS, CAREER_STAGES, PERSONAS } from '@/data/taxonomy'

const STEPS = ['Persona', 'Career path', 'Storyline'] as const

export default function Onboarding() {
  const { user, profile, loading, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    display_name: '',
    persona: '',
    career_stage: '',
    career_goal: '',
    storyline: '',
  })

  useEffect(() => {
    if (!loading && !user) navigate('/auth', { replace: true })
  }, [loading, user, navigate])

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name ?? '',
        persona: profile.persona ?? '',
        career_stage: profile.career_stage ?? '',
        career_goal: profile.career_goal ?? '',
        storyline: profile.storyline ?? '',
      })
    }
  }, [profile])

  const save = async () => {
    if (!user) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...form, onboarded: true })
    setSaving(false)
    if (error) {
      toast.error('Could not save your profile.')
      return
    }
    await refreshProfile()
    toast.success('Your creator persona is ready.')
    navigate('/submit')
  }

  const canContinue =
    step === 0
      ? form.display_name.trim() && form.persona
      : step === 1
        ? form.career_stage && form.career_goal
        : form.storyline.trim().length > 20

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground gentle-animation">
          ← Back to the site
        </Link>

        <h1 className="text-4xl sm:text-5xl font-bold mt-6 mb-3">Build your creator persona</h1>
        <p className="text-muted-foreground mb-10">
          Three quick steps. This shapes how the jury reads your work.
        </p>

        <div className="flex gap-3 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={`h-1 rounded-full transition-all duration-700 ${
                  i <= step ? 'bg-accent-purple' : 'bg-white/10'
                }`}
              />
              <span className="mt-2 block text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        <div className="glass-effect clean-border rounded-3xl p-8 space-y-6">
          {step === 0 && (
            <>
              <label className="block">
                <span className="text-sm text-muted-foreground">Your name</span>
                <input
                  value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                  className="mt-2 w-full rounded-xl bg-black/30 clean-border px-4 py-3 outline-none focus:ring-2 focus:ring-accent-purple"
                />
              </label>
              <div>
                <span className="text-sm text-muted-foreground">What do you do?</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PERSONAS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setForm({ ...form, persona: p })}
                      className={`rounded-full px-4 py-2 text-sm gentle-animation ${
                        form.persona === p
                          ? 'bg-accent-purple text-white'
                          : 'clean-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <span className="text-sm text-muted-foreground">Where are you today?</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CAREER_STAGES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm({ ...form, career_stage: s })}
                      className={`rounded-full px-4 py-2 text-sm gentle-animation ${
                        form.career_stage === s
                          ? 'bg-accent-blue text-white'
                          : 'clean-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Where do you want to be?</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CAREER_GOALS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setForm({ ...form, career_goal: g })}
                      className={`rounded-full px-4 py-2 text-sm gentle-animation ${
                        form.career_goal === g
                          ? 'bg-accent-emerald text-white'
                          : 'clean-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <label className="block">
              <span className="text-sm text-muted-foreground">
                Your storyline — the thread that runs through your work
              </span>
              <textarea
                rows={7}
                value={form.storyline}
                onChange={(e) => setForm({ ...form, storyline: e.target.value })}
                placeholder="A lone figure at the edge of an unknown world, waiting for the light to change…"
                className="mt-2 w-full rounded-xl bg-black/30 clean-border px-4 py-3 outline-none focus:ring-2 focus:ring-accent-purple resize-none"
              />
              <span className="mt-2 block text-xs text-muted-foreground">
                At least a couple of sentences — the jury reads this alongside every entry.
              </span>
            </label>
          )}

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="rounded-xl px-5 py-3 text-sm clean-border gentle-animation disabled:opacity-30"
            >
              Back
            </button>
            {step < 2 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canContinue}
                className="rounded-xl bg-accent-purple px-6 py-3 text-sm font-semibold text-white gentle-animation disabled:opacity-40"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={save}
                disabled={!canContinue || saving}
                className="rounded-xl bg-accent-purple px-6 py-3 text-sm font-semibold text-white gentle-animation disabled:opacity-40"
              >
                {saving ? 'Saving…' : 'Finish and submit work'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
