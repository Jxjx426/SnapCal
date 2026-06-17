'use client'
import { useState } from 'react'
import styles from './KeyModal.module.css'

interface KeyModalProps {
  isOpen: boolean
  currentKey: string
  onSave: (key: string) => void
  onClose: () => void
}

export default function KeyModal({ isOpen, currentKey, onSave, onClose }: KeyModalProps) {
  const [value, setValue] = useState(currentKey)

  if (!isOpen) return null

  const handleSave = () => {
    onSave(value.trim())
    onClose()
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2>🔑 填入你的 Gemini API Key</h2>
        <p>
          Key 只存在你的浏览器里，不会传到任何服务器。
          <br />
          还没有 key？{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
            免费获取 →
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
          <button className={styles.btnSave} onClick={handleSave}>
            保存
          </button>
          <button className={styles.btnCancel} onClick={onClose}>
            取消
          </button>
        </div>
      </div>
    </div>
  )
}
