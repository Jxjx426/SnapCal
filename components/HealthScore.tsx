import styles from './HealthScore.module.css'

interface HealthScoreProps {
  score: number // 0-100
}

function getBadge(score: number): { label: string; className: string; color: string } {
  if (score >= 85) return { label: 'Excellent', className: 'badgeExcellent', color: '#5A9A5A' }
  if (score >= 65) return { label: 'Good', className: 'badgeGood', color: '#D4A95C' }
  if (score >= 45) return { label: 'Average', className: 'badgeAverage', color: '#C98A5C' }
  return { label: 'Treat Meal', className: 'badgeTreat', color: '#D97A78' }
}

export default function HealthScore({ score }: HealthScoreProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)))
  const badge = getBadge(clamped)
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className={styles.panel}>
      <div className={styles.circleWrap}>
        <svg className={styles.circleSvg} viewBox="0 0 92 92">
          <circle className={styles.circleBg} cx="46" cy="46" r={radius} />
          <circle
            className={styles.circleFg}
            cx="46" cy="46" r={radius}
            stroke={badge.color}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
          />
        </svg>
        <div className={styles.circleLabel}>
          <div className={styles.scoreNum}>{clamped}</div>
          <div className={styles.scoreMax}>/ 100</div>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.title}>Health Score</div>
        <div className={`${styles.badge} ${styles[badge.className]}`}>{badge.label}</div>
      </div>
    </div>
  )
}
