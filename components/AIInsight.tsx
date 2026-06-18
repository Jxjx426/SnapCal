import styles from './AIInsight.module.css'

interface AIInsightProps {
  insight: string
}

export default function AIInsight({ insight }: AIInsightProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.iconWrap}>💬</div>
      <div className={styles.content}>
        <div className={styles.title}>AI Insight</div>
        <div className={styles.text}>{insight}</div>
      </div>
    </div>
  )
}
