import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import exampleAsset from '@/assets/example-entry.png.asset.json'

interface Evaluation {
  description: string
  category: string
  genre: string
  confidence: number
}

interface SubmissionRow {
  id: string
  title: string
  category: string
  genre: string
  ai_description: string
  status: 'pending' | 'approved' | 'rejected'
  jury_notes: string
  jury_score: number | null
  created_at: string
}

const statusStyle: Record<string, string> = {
  pending: 'bg-amber-400/15 text-amber-200',
  approved: 'bg-accent-emerald/20 text-accent-emerald',
  rejected: 'bg-red-500/15 text-red-300',
}

export default function Submit() {
  const { user, profile, loading, roles } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [storyline, setStoryline] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [evaluating, setEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [saving, setSaving] = useState(false)
  const [mine, setMine] = useState<SubmissionRow[]>([])

  useEffect(() => {
    if (!loading && !user) navigate('/auth', { replace: true })
    if (!loading && user && profile && !profile.onboarded) navigate('/onboarding', { replace: true })
  }, [loading, user, profile, navigate])

  const loadMine = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('submissions')
      .select('id,title,category,genre,ai_description,status,jury_notes,jury_score,created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setMine((data as SubmissionRow[]) ?? [])
  }, [user])

  useEffect(() => {
    void loadMine()
  }, [loadMine])

  const toDataUrl = (f: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = reject
      reader.readAsDataURL(f)
    })

  const pickFile = async (f: File) => {
    setFile(f)
    setEvaluation(null)
    setPreview(await toDataUrl(f))
  }

  const loadExample = async () => {
    try {
      const res = await fetch(exampleAsset.url)
      const blob = await res.blob()
      const f = new File([blob], 'example-entry.png', { type: blob.type || 'image/png' })
      setTitle('Waiting for the Second Sun')
      setStoryline(
        'A lone explorer rests at the cliff edge of an unmapped world while a violet river burns below. The frame holds the pause before the next descent.',
      )
      await pickFile(f)
      toast.success('Example entry loaded. Run the pre-evaluation to continue.')
    } catch {
      toast.error('Could not load the example entry.')
    }
  }

  const runEvaluation = async () => {
    if (!preview) return
    setEvaluating(true)
    try {
      const { data, error } = await supabase.functions.invoke('describe-work', {
        body: { imageDataUrl: preview, title, storyline },
      })
      if (error) throw error
      if (data?.error) throw new Error(data.error)
      setEvaluation(data as Evaluation)
      toast.success('Pre-evaluation complete. Category and genre are locked.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Pre-evaluation failed.')
    } finally {
      setEvaluating(false)
    }
  }

  const submit = async () => {
    if (!user || !file || !evaluation) return
    setSaving(true)
    try {
      const ext = file.name.split('.').pop() || 'png'
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`
      const { error: upErr } = await supabase.storage.from('submissions').upload(path, file)
      if (upErr) throw upErr

      const { error: insErr } = await supabase.from('submissions').insert({
        user_id: user.id,
        title: title.trim() || 'Untitled entry',
        storyline,
        image_path: path,
        ai_description: evaluation.description,
        category: evaluation.category,
        genre: evaluation.genre,
        ai_confidence: evaluation.confidence,
      })
      if (insErr) throw insErr

      toast.success('Entry sent to the jury.')
      setTitle('')
      setStoryline('')
      setFile(null)
      setPreview('')
      setEvaluation(null)
      await loadMine()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not send your entry.')
    } finally {
      setSaving(false)
    }
  }

  const isJury = roles.includes('jury') || roles.includes('admin')

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground gentle-animation">
            ← Back to the site
          </Link>
          <div className="flex gap-4 text-sm">
            <Link to="/onboarding" className="text-muted-foreground hover:text-foreground gentle-animation">
              My persona
            </Link>
            {isJury && (
              <Link to="/jury" className="text-accent-purple hover:opacity-80 gentle-animation">
                Jury room
              </Link>
            )}
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-3">Submit work for jury review</h1>
        <p className="text-muted-foreground mb-10">
          Upload a frame. It is described automatically, and the category and genre it lands in are
          set by that description — they cannot be changed by hand.
        </p>

        <div className="glass-effect clean-border rounded-3xl p-8 space-y-6">
          <div className="flex flex-wrap gap-3">
            <label className="rounded-xl bg-accent-purple px-5 py-3 text-sm font-semibold text-white cursor-pointer gentle-animation">
              Choose an image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void pickFile(f)
                }}
              />
            </label>
            <button
              onClick={loadExample}
              className="rounded-xl clean-border px-5 py-3 text-sm gentle-animation hover:bg-white/5"
            >
              Use the example entry
            </button>
          </div>

          {preview && (
            <img
              src={preview}
              alt="Selected entry"
              className="w-full max-h-[420px] object-cover rounded-2xl clean-border"
            />
          )}

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title of the piece"
            className="w-full rounded-xl bg-black/30 clean-border px-4 py-3 outline-none focus:ring-2 focus:ring-accent-purple"
          />
          <textarea
            rows={4}
            value={storyline}
            onChange={(e) => setStoryline(e.target.value)}
            placeholder="The storyline behind this frame"
            className="w-full rounded-xl bg-black/30 clean-border px-4 py-3 outline-none focus:ring-2 focus:ring-accent-purple resize-none"
          />

          <button
            onClick={runEvaluation}
            disabled={!preview || evaluating}
            className="w-full rounded-xl bg-accent-blue px-5 py-3 font-semibold text-white gentle-animation disabled:opacity-40"
          >
            {evaluating ? 'Reading the frame…' : 'Run pre-evaluation'}
          </button>

          {evaluation && (
            <div className="rounded-2xl bg-black/30 clean-border p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-accent-purple/20 text-accent-purple px-3 py-1 text-xs font-medium">
                  {evaluation.category}
                </span>
                <span className="rounded-full bg-accent-emerald/20 text-accent-emerald px-3 py-1 text-xs font-medium">
                  {evaluation.genre}
                </span>
                <span className="text-xs text-muted-foreground">
                  Locked · confidence {Math.round(evaluation.confidence * 100)}%
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{evaluation.description}</p>
              <button
                onClick={submit}
                disabled={saving}
                className="w-full rounded-xl bg-accent-emerald px-5 py-3 font-semibold text-white gentle-animation disabled:opacity-40"
              >
                {saving ? 'Sending…' : 'Send to the jury'}
              </button>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold mt-16 mb-6">Your entries</h2>
        {mine.length === 0 ? (
          <p className="text-muted-foreground">Nothing submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {mine.map((s) => (
              <div key={s.id} className="glass-effect clean-border rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle[s.status]}`}>
                    {s.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {s.category} · {s.genre}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.ai_description}</p>
                {s.jury_notes && (
                  <p className="mt-4 text-sm text-amber-200/80">
                    Jury: {s.jury_notes}
                    {s.jury_score != null && ` · ${s.jury_score}/10`}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
