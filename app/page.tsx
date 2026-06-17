'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import KeyModal from '@/components/KeyModal'
import UploadZone from '@/components/UploadZone'
import ResultPanel, { NutritionResult } from '@/components/ResultPanel'
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
    if (!imageB64) { setError('请先上传图片！'); return }
    if (!apiKey) { setKeyModalOpen(true); return }

    setIsLoading(true)
    setError('')

    const weightNote = weight
      ? `用户提供的总重量：${weight}g。`
      : '用户未提供重量，请你估算。'

    const prompt = `你是一位专业营养师。请分析这张餐食图片，估算其营养成分。${weightNote}

请只返回以下 JSON 格式，不要任何额外文字或 markdown：
{
  "kcal": <数字>,
  "protein_g": <数字>,
  "carbs_g": <数字>,
  "fat_g": <数字>,
  "fiber_g": <数字>,
  "estimated_weight_g": <数字，如用户已提供则用用户的值>,
  "foods_identified": "<简短描述识别到的食物，中文>"
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
      const msg = e instanceof Error ? e.message : '未知错误'
      setError('分析失败：' + msg + '。请检查 API Key 是否正确。')
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

        <div className={styles.motivation}>
          <div className={styles.motivationIcon}>🌱</div>
          <div className={styles.motivationText}>
            You didn&apos;t come this far to only come this far.
            <br />
            <span>You&apos;ve got this! ♥</span>
          </div>
        </div>
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
