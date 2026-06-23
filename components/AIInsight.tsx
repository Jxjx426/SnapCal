import styles from './AIInsight.module.css'
import { translations } from '@/lib/translations'

interface AIInsightProps {
  insight: string
  t: typeof translations.en
}

export default function AIInsight({ insight, t }: AIInsightProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.iconWrap}>💬</div>
      <div className={styles.content}>
        <div className={styles.title}>{t.aiInsightTitle}</div>
        <div className={styles.text}>{insight}</div>
      </div>
    </div>
  )
}
