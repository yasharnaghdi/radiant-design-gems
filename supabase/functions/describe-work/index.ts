// Pre-evaluation: describes an uploaded image and locks its category + genre.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const CATEGORIES = [
  'Commercial',
  'Cinematography',
  'Color',
  'Post-Production',
  'Studio',
  'Delivery',
] as const

const GENRES = [
  'Sci-Fi',
  'Drama',
  'Documentary',
  'Adventure',
  'Thriller',
  'Fantasy',
  'Experimental',
  'Lifestyle',
] as const

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('LOVABLE_API_KEY')
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'AI is not configured.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { imageDataUrl, title, storyline } = await req.json()
    if (!imageDataUrl || typeof imageDataUrl !== 'string') {
      return new Response(JSON.stringify({ error: 'No image provided.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const systemPrompt = [
      'You pre-evaluate creative work submitted to a jury.',
      'Look at the image and read the optional title and storyline.',
      'Return strict JSON only, no prose, with exactly these keys:',
      '{"description": string, "category": string, "genre": string, "confidence": number}',
      `"category" MUST be one of: ${CATEGORIES.join(', ')}.`,
      `"genre" MUST be one of: ${GENRES.join(', ')}.`,
      '"description" is 2-3 sentences describing what is visible and its cinematic qualities.',
      '"confidence" is between 0 and 1.',
    ].join(' ')

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Lovable-AIG-SDK': 'fetch',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5.6-sol',
        reasoning_effort: 'none',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Title: ${title || '(none)'}\nStoryline: ${storyline || '(none)'}\nReturn the json now.`,
              },
              { type: 'image_url', image_url: { url: imageDataUrl } },
            ],
          },
        ],
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('AI gateway error', res.status, body)
      const message =
        res.status === 429
          ? 'The pre-evaluation service is busy. Please try again in a moment.'
          : res.status === 402
            ? 'AI credits are exhausted for this workspace.'
            : 'The pre-evaluation could not be completed.'
      return new Response(JSON.stringify({ error: message }), {
        status: res.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await res.json()
    const raw = data?.choices?.[0]?.message?.content ?? '{}'

    let parsed: Record<string, unknown> = {}
    try {
      parsed = JSON.parse(raw)
    } catch {
      const match = String(raw).match(/\{[\s\S]*\}/)
      if (match) parsed = JSON.parse(match[0])
    }

    const category = CATEGORIES.includes(parsed.category as never)
      ? (parsed.category as string)
      : 'Cinematography'
    const genre = GENRES.includes(parsed.genre as never)
      ? (parsed.genre as string)
      : 'Experimental'
    const description =
      typeof parsed.description === 'string' && parsed.description.trim()
        ? parsed.description.trim()
        : 'No description could be generated for this frame.'
    const confidenceRaw = Number(parsed.confidence)
    const confidence = Number.isFinite(confidenceRaw)
      ? Math.min(1, Math.max(0, confidenceRaw))
      : 0.5

    return new Response(
      JSON.stringify({ description, category, genre, confidence }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('describe-work failed', err)
    return new Response(JSON.stringify({ error: 'Unexpected error during pre-evaluation.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
