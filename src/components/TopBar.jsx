import { ArrowLeft } from 'lucide-react'
import styles from './TopBar.module.css'

export default function TopBar({ title, onBack }) {
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        {onBack && (
          <button className={styles.back} onClick={onBack} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
        )}
      </div>
      <span className={styles.title}>{title}</span>
      <div className={styles.right} />
    </div>
  )
}
