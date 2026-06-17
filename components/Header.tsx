'use client'
import styles from './Header.module.css'

interface HeaderProps {
  hasKey: boolean
  onKeyClick: () => void
}

export default function Header({ hasKey, onKeyClick }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🥗</div>
        <div className={styles.logoText}>
          SnapCal <span>AI</span>
        </div>
      </div>
      <button className={styles.btnKey} onClick={onKeyClick}>
        <div className={`${styles.keyDot} ${hasKey ? styles.active : ''}`} />
        <span>{hasKey ? 'Key 已设置' : 'Bring Your Own Key'}</span>
      </button>
    </header>
  )
}
