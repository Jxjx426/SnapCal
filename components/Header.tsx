'use client'
import styles from './Header.module.css'
import { Lang, translations } from '@/lib/translations'

interface HeaderProps {
  hasKey: boolean
  onKeyClick: () => void
  lang: Lang
  onLangChange: (lang: Lang) => void
  t: typeof translations.en
}

export default function Header({ hasKey, onKeyClick, lang, onLangChange, t }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🥗</div>
          <div className={styles.logoText}>{t.appName} <span>{t.appNameAccent} </span></div>
        </div>

        <div className={styles.langSwitch}>
          <button
            className={`${styles.langBtn} ${lang === 'en' ? styles.langActive : ''}`}
            onClick={() => onLangChange('en')}
          >
            EN
          </button>
          <button
            className={`${styles.langBtn} ${lang === 'zh' ? styles.langActive : ''}`}
            onClick={() => onLangChange('zh')}
          >
            中文
          </button>
        </div>

        <button className={styles.btnKey} onClick={onKeyClick}>
          <div className={`${styles.keyDot} ${hasKey ? styles.active : ''}`} />
          <span>{hasKey ? t.keySet : t.byok}</span>
        </button>
      </div>
    </header>
  )
}
