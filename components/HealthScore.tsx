import styles from './HealthScore.module.css'
import { translations } from '@/lib/translations'

interface HealthScoreProps {
  score: number // 0-100
  t: typeof translations.en
}

function getBadge(score: number, t: typeof translations.en): { label: string; className: string; color: string } {
  if (score >= 85) return { label: t.badgeExcellent, className: 'badgeExcellent', color: '#5A9A5A' }
  if (score >= 65) return { label: t.badgeGood, className: 'badgeGood', color: '#D4A95C' }
  if (score >= 45) return { label: t.badgeAverage, className: 'badgeAverage', color: '#C98A5C' }
  return { label: t.badgeTreat, className: 'badgeTreat', color: '#D97A78' }
}

export default function HealthScore({ score, t }: HealthScoreProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)))
  const badge = getBadge(clamped, t)
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
        <div className={styles.title}>{t.healthScore}</div>
        <div className={`${styles.badge} ${styles[badge.className]}`}>{badge.label}</div>
      </div>
    </div>
  )
}
