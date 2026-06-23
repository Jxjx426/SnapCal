'use client'
import { useRef } from 'react'
import styles from './UploadZone.module.css'
import { translations } from '@/lib/translations'

interface NutritionBubbles {
  protein: number
  carbs: number
  fat: number
}

interface UploadZoneProps {
  imageUrl: string | null
  bubbles: NutritionBubbles | null
  weight: string
  onWeightChange: (v: string) => void
  onImageLoad: (b64: string, url: string) => void
  onAnalyze: () => void
  isLoading: boolean
  error: string
  t: typeof translations.en
}

export default function UploadZone({
  imageUrl, bubbles, weight, onWeightChange,
  onImageLoad, onAnalyze, isLoading, error, t,
}: UploadZoneProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      onImageLoad(result.split(',')[1], result)
    }
    reader.readAsDataURL(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>📷 {t.mealPhoto}</div>

      <div
        className={`${styles.dropZone} ${imageUrl ? styles.hasImage : ''}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
      >
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="meal preview" className={styles.preview} />

            {bubbles && (
              <>
                <div className={`${styles.bubble} ${styles.bubbleProtein}`}>
                  <span className={styles.bubbleLabel}>🥩 {t.protein}</span>
                  <span className={styles.bubbleVal}>{bubbles.protein}g</span>
                </div>
                <div className={`${styles.bubble} ${styles.bubbleCarbs}`}>
                  <span className={styles.bubbleLabel}>🌾 {t.carbs}</span>
                  <span className={styles.bubbleVal}>{bubbles.carbs}g</span>
                </div>
                <div className={`${styles.bubble} ${styles.bubbleFat}`}>
                  <span className={styles.bubbleLabel}>🫒 {t.fats}</span>
                  <span className={styles.bubbleVal}>{bubbles.fat}g</span>
                </div>

                <svg
                  className={styles.overlaySvg}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <marker id="ag" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 Z" fill="#3daa72" />
                    </marker>
                    <marker id="ao" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 Z" fill="#f07d3a" />
                    </marker>
                    <marker id="ay" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 Z" fill="#b8900a" />
                    </marker>
                  </defs>
                  <line x1="30" y1="26" x2="40" y2="40" stroke="#3daa72" strokeWidth="0.8" markerEnd="url(#ag)" />
                  <line x1="70" y1="42" x2="58" y2="50" stroke="#f07d3a" strokeWidth="0.8" markerEnd="url(#ao)" />
                  <line x1="35" y1="74" x2="45" y2="65" stroke="#b8900a" strokeWidth="0.8" markerEnd="url(#ay)" />
                </svg>
              </>
            )}
          </>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>🍽️</div>
            <div className={styles.placeholderText}>{t.tapToUpload}</div>
            <div className={styles.placeholderSub}>{t.fileTypes}</div>
          </div>
        )}
      </div>

      <div className={styles.weightRow}>
        <label>{t.weight}</label>
        <input
          type="number"
          placeholder={t.weightPlaceholder}
          value={weight}
          onChange={e => onWeightChange(e.target.value)}
          min={1}
          max={5000}
        />
        <span className={styles.unit}>g</span>
      </div>

      <div className={styles.btnRow}>
        <button className={styles.btnUpload} onClick={() => fileRef.current?.click()}>
          ↑ {t.changeImage}
        </button>
        <button className={styles.btnAnalyze} onClick={onAnalyze} disabled={isLoading}>
          {isLoading ? (
            <><span className={styles.spin} /> {t.analyzing}</>
          ) : t.analyzeButton
          }
        </button>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
