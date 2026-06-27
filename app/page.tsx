'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import KeyModal from '@/components/KeyModal'
import UploadZone from '@/components/UploadZone'
import ResultPanel, { NutritionResult } from '@/components/ResultPanel'
import HealthScore from '@/components/HealthScore'
import AIInsight from '@/components/AIInsight'
import { translations, Lang } from '@/lib/translations'
import styles from './page.module.css'

export default function Home() {
  const [lang, setLang] = useState<Lang>('en')
  const [apiKey, setApiKey] = useState('')
  const [keyModalOpen, setKeyModalOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageB64, setImageB64] = useState<string | null>(null)
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState<NutritionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const t = translations[lang]

  useEffect(() => {
    const stored = localStorage.getItem('gemini_key')
    if (stored) setApiKey(stored)
    const storedLang = localStorage.getItem('logit_lang') as Lang | null
    if (storedLang) setLang(storedLang)
  }, [])

  const handleSaveKey = (key: string) => {
    setApiKey(key)
    if (key) localStorage.setItem('gemini_key', key)
    else localStorage.removeItem('gemini_key')
  }

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang)
    localStorage.setItem('logit_lang', newLang)
  }

  const handleImageLoad = (b64: string, url: string) => {
    setImageB64(b64)
    setImageUrl(url)
    setResult(null)
    setError('')
  }

  const analyze = async () => {
    if (!imageB64) { setError(t.errorUploadFirst); return }
    if (!apiKey) { setKeyModalOpen(true); return }

    setIsLoading(true)
    setError('')

    const weightNote = weight
      ? `User provided total weight: ${weight}g.`
      : 'User did not provide weight — please estimate it.'
    
      const languageInstruction = lang === 'zh'
      ? 'IMPORTANT: You must write the values of "foods_identified" and "ai_insight" ENTIRELY in Simplified Chinese (简体中文). Do not use any English in those two fields.'
      : 'Write the values of "foods_identified" and "ai_insight" in English.'
 
    const prompt = `${languageInstruction}
 
You are a professional nutritionist with a warm, friendly tone. Analyse this meal photo and estimate its nutrition. ${weightNote}

Return ONLY this JSON, no extra text or markdown:
{
  "kcal": <number>,
  "protein_g": <number>,
  "carbs_g": <number>,
  "fat_g": <number>,
  "fiber_g": <number>,
  "estimated_weight_g": <number, use user value if provided>,
  "foods_identified": "<brief description${lang === 'zh' ? ' — 必须用简体中文' : ' in English'}>",
  "health_score": <number 0-100, how nutritionally balanced this meal is>,
  "ai_insight": "<one short, warm, non-robotic sentence (max 25 words)${lang === 'zh' ? ' — 必须用简体中文，不要用英文' : ' in English'} with friendly feedback on this meal, e.g. praising protein/fats and gently suggesting one improvement>"
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
      setError(`${t.errorAnalysisFailed} :${msg}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header
        hasKey={!!apiKey}
        onKeyClick={() => setKeyModalOpen(true)}
        lang={lang}
        onLangChange={handleLangChange}
        t={t}
      />

      <main className={styles.main}>
        <UploadZone
          imageUrl={imageUrl}
          bubbles={result ? { protein: Math.round(result.protein_g), carbs: Math.round(result.carbs_g), fat: Math.round(result.fat_g) } : null}
          weight={weight}
          onWeightChange={setWeight}
          onImageLoad={handleImageLoad}
          onAnalyze={analyze}
          isLoading={isLoading}
          error={error}
          t={t}
        />

        <ResultPanel result={result} weightProvided={!!weight} t={t} />

        {result && (
          <div className={styles.insightRow}>
            <HealthScore score={result.health_score} t={t} />
            <AIInsight insight={result.ai_insight} t={t} />
          </div>
        )}
      </main>

      <KeyModal
        isOpen={keyModalOpen}
        currentKey={apiKey}
        onSave={handleSaveKey}
        onClose={() => setKeyModalOpen(false)}
        t={t}
      />
    </>
  )
}