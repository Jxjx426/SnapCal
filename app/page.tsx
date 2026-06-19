'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import KeyModal from '@/components/KeyModal'
import UploadZone from '@/components/UploadZone'
import ResultPanel, { NutritionResult } from '@/components/ResultPanel'
import HealthScore from '@/components/HealthScore'
import AIInsight from '@/components/AIInsight'
import styles from './page.module.css'

export default function Home() {
  const [apiKey, setApiKey] = useState('')
  const [keyModalOpen, setKeyModalOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageB64, setImageB64] = useState<string | null>(null)
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState<NutritionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('gemini_key')
    if (stored) setApiKey(stored)
  }, [])

  const handleSaveKey = (key: string) => {
    setApiKey(key)
    if (key) localStorage.setItem('gemini_key', key)
    else localStorage.removeItem('gemini_key')
  }

  const handleImageLoad = (b64: string, url: string) => {
    setImageB64(b64)
    setImageUrl(url)
    setResult(null)
    setError('')
  }

  const analyze = async () => {
    if (!imageB64) { setError('Please upload a photo first!'); return }
    if (!apiKey) { setKeyModalOpen(true); return }

    setIsLoading(true)
    setError('')

    const weightNote = weight
      ? `User provided total weight: ${weight}g.`
      : 'User did not provide weight — please estimate it.'

    const prompt = `You are a professional nutritionist with a warm, friendly tone. Analyse this meal photo and estimate its nutrition. ${weightNote}

Return ONLY this JSON, no extra text or markdown:
{
  "kcal": <number>,
  "protein_g": <number>,
  "carbs_g": <number>,
  "fat_g": <number>,
  "fiber_g": <number>,
  "estimated_weight_g": <number, use user value if provided>,
  "foods_identified": "<brief description in English>",
  "health_score": <number 0-100, how nutritionally balanced this meal is>,
  "ai_insight": "<one short, warm, non-robotic sentence (max 25 words) with friendly feedback on this meal, e.g. praising protein/fats and gently suggesting one improvement>"
}`

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { inline_data: { mime_type: 'image/jpeg', data: imageB64 } },
                { text: prompt },
              ],
            }],
          }),
        }
      )

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || `HTTP ${res.status}`)
      }

      const data = await res.json()
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const clean = raw.replace(/```json|```/g, '').trim()
      const parsed: NutritionResult = JSON.parse(clean)
      setResult(parsed)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError('Analysis failed: ' + msg)
    } finally {
      setIsLoading(false)
    }
  }

  const bubbles = result
    ? { protein: Math.round(result.protein_g), carbs: Math.round(result.carbs_g), fat: Math.round(result.fat_g) }
    : null

  return (
    <>
      <Header hasKey={!!apiKey} onKeyClick={() => setKeyModalOpen(true)} />

      <main className={styles.main}>
        <UploadZone
          imageUrl={imageUrl}
          bubbles={bubbles}
          weight={weight}
          onWeightChange={setWeight}
          onImageLoad={handleImageLoad}
          onAnalyze={analyze}
          isLoading={isLoading}
          error={error}
        />

        <ResultPanel result={result} weightProvided={!!weight} />

        {result && (
          <div className={styles.insightRow}>
            <HealthScore score={result.health_score} />
            <AIInsight insight={result.ai_insight} />
          </div>
        )}

      </main>

      <KeyModal
        isOpen={keyModalOpen}
        currentKey={apiKey}
        onSave={handleSaveKey}
        onClose={() => setKeyModalOpen(false)}
      />
    </>
  )
}
