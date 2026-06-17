import styles from './ResultPanel.module.css'

export interface NutritionResult {
  kcal: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g: number
  estimated_weight_g: number
  foods_identified: string
}

interface ResultPanelProps {
  result: NutritionResult | null
  weightProvided: boolean
}

export default function ResultPanel({ result, weightProvided }: ResultPanelProps) {
  if (!result) {
    return (
      <div className={styles.panel}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🤖</div>
          <div className={styles.emptyText}>上传一张餐食照片</div>
          <div className={styles.emptySub}>AI 会帮你估算卡路里和营养成分</div>
        </div>
      </div>
    )
  }

  const p = Math.round(result.protein_g)
  const c = Math.round(result.carbs_g)
  const f = Math.round(result.fat_g)
  const fi = Math.round(result.fiber_g)

  const pCal = p * 4, cCal = c * 4, fCal = f * 9
  const total = pCal + cCal + fCal || 1
  const pPct = Math.round(pCal / total * 100)
  const cPct = Math.round(cCal / total * 100)
  const fPct = 100 - pPct - cPct

  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>⭐ Estimated Calories</div>

      <div className={styles.kcalBlock}>
        <div className={styles.kcalNum}>~{Math.round(result.kcal)}</div>
        <div className={styles.kcalUnit}>kcal</div>
      </div>

      <div className={styles.macroBarWrap}>
        <div className={styles.macroBar}>
          <div className={styles.barSeg} style={{ background: 'var(--green)', width: `${pPct}%` }} />
          <div className={styles.barSeg} style={{ background: 'var(--orange)', width: `${cPct}%` }} />
          <div className={styles.barSeg} style={{ background: 'var(--yellow)', width: `${fPct}%` }} />
        </div>
        <div className={styles.barPct}>
          <span style={{ color: 'var(--green)' }}>{pPct}%</span>
          <span style={{ color: 'var(--orange)' }}>{cPct}%</span>
          <span style={{ color: '#b8900a' }}>{fPct}%</span>
        </div>
      </div>

      <div className={styles.macroList}>
        {[
          { emoji: '🥩', label: 'Protein', val: p, bg: 'var(--green-light)' },
          { emoji: '🌾', label: 'Carbs', val: c, bg: 'var(--orange-light)' },
          { emoji: '🫒', label: 'Fats', val: f, bg: 'var(--yellow-light)' },
          { emoji: '🔥', label: 'Fiber', val: fi, bg: '#f0f0f0' },
        ].map(m => (
          <div className={styles.macroItem} key={m.label}>
            <div className={styles.macroDot} style={{ background: m.bg }}>{m.emoji}</div>
            <div className={styles.macroName}>{m.label}</div>
            <div className={styles.macroVal}>{m.val}g</div>
          </div>
        ))}
      </div>

      {!weightProvided && result.estimated_weight_g && (
        <div className={styles.weightAuto}>
          🤖 AI 估算总重量：<strong>{result.estimated_weight_g}g</strong>
        </div>
      )}

      {result.foods_identified && (
        <div className={styles.foodId}>
          <strong>识别到的食物：</strong>{result.foods_identified}
        </div>
      )}

      <div className={styles.disclaimer}>
        💡 结果仅供参考，实际值因烹饪方式、食材品种而异
      </div>
    </div>
  )
}
