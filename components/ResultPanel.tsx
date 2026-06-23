import styles from './ResultPanel.module.css'
import { translations } from '@/lib/translations'

export interface NutritionResult {
  kcal: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g: number
  estimated_weight_g: number
  foods_identified: string
  health_score: number
  ai_insight: string
}

interface ResultPanelProps {
  result: NutritionResult | null
  weightProvided: boolean
  t: typeof translations.en
}

export default function ResultPanel({ result, weightProvided, t }: ResultPanelProps) {
  if (!result) {
    return (
      <div className={styles.panel}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🤖</div>
          <div className={styles.emptyText}>{t.noAnalysisYet}</div>
          <div className={styles.emptySub} style={{ whiteSpace: 'pre-line' }}>
            {t.noAnalysisSub}
          </div>
        </div>
      </div>
    )
  }

  const p  = Math.round(result.protein_g)
  const c  = Math.round(result.carbs_g)
  const f  = Math.round(result.fat_g)
  const fi = Math.round(result.fiber_g)

  const pCal = p * 4, cCal = c * 4, fCal = f * 9
  const total = pCal + cCal + fCal || 1
  const pPct = Math.round(pCal / total * 100)
  const cPct = Math.round(cCal / total * 100)
  const fPct = 100 - pPct - cPct

  const macros = [
    { emoji: '🥩', label: t.protein, val: p,  bg: '#EDF7ED', color: '#5A9A5A' },
    { emoji: '🌾', label: t.carbs,   val: c,  bg: '#FDF5E6', color: '#B07A20' },
    { emoji: '🫒', label: t.fats,    val: f,  bg: '#FBF0EA', color: '#A06040' },
    { emoji: '🌱', label: t.fiber,   val: fi, bg: '#F5F5F0', color: '#7A8A70' },
  ]

  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>{t.estimatedNutrition}</div>

      <div className={styles.kcalBlock}>
        <div className={styles.kcalLabelSmall}>{t.calories}</div>
        <div className={styles.kcalNum}>~{Math.round(result.kcal)}</div>
        <div className={styles.kcalUnit}>kcal</div>
      </div>

      <div className={styles.macroBarWrap}>
        <div className={styles.macroBar}>
          <div className={styles.barSeg} style={{ background: 'var(--protein)', width: `${pPct}%` }} />
          <div className={styles.barSeg} style={{ background: 'var(--carbs)',   width: `${cPct}%` }} />
          <div className={styles.barSeg} style={{ background: 'var(--fat)',     width: `${fPct}%` }} />
        </div>
        <div className={styles.barPct}>
          <span style={{ color: '#5A9A5A' }}>{pPct}% P</span>
          <span style={{ color: '#B07A20' }}>{cPct}% C</span>
          <span style={{ color: '#A06040' }}>{fPct}% F</span>
        </div>
      </div>

      <div className={styles.macroList}>
        {macros.map(m => (
          <div className={styles.macroItem} key={m.label}>
            <div className={styles.macroDot} style={{ background: m.bg, color: m.color }}>{m.emoji}</div>
            <div className={styles.macroName}>{m.label}</div>
            <div className={styles.macroVal}>{m.val}g</div>
          </div>
        ))}
      </div>

      {!weightProvided && result.estimated_weight_g && (
        <div className={styles.weightAuto}>
          {t.aiEstimatedWeight}: <strong>{result.estimated_weight_g}g</strong>
        </div>
      )}

      {result.foods_identified && (
        <div className={styles.foodId}>
          <strong>{t.identified}:</strong> {result.foods_identified}
        </div>
      )}

      <div className={styles.disclaimer}>
        💡 {t.disclaimer}
      </div>
    </div>
  )
}
