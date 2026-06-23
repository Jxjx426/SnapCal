'use client'
import { useState } from 'react'
import styles from './KeyModal.module.css'
import { translations } from '@/lib/translations'

interface KeyModalProps {
  isOpen: boolean
  currentKey: string
  onSave: (key: string) => void
  onClose: () => void
  t: typeof translations.en
}

export default function KeyModal({ isOpen, currentKey, onSave, onClose, t }: KeyModalProps) {
  const [value, setValue] = useState(currentKey)

  if (!isOpen) return null

  const handleSave = () => {
    onSave(value.trim())
    onClose()
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2>{t.keyModalTitle}</h2>
        <p>
          {t.keyModalDesc}<br />
          {t.keyModalNoKey}{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
            {t.keyModalGetFree}
          </a>
        </p>
        <input
          type="password"
          placeholder="AIza..."
          value={value}
          onChange={e => setValue(e.target.value)}
          autoComplete="off"
          onKeyDown={e => e.key === 'Enter' && handleSave()}
        />
        <div className={styles.actions}>
          <button className={styles.btnSave} onClick={handleSave}>{t.save}</button>
          <button className={styles.btnCancel} onClick={onClose}>{t.cancel}</button>
        </div>
      </div>
    </div>
  )
}
