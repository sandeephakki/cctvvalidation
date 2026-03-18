import styles from './TopBar.module.css'
import { ArrowLeft } from 'lucide-react'

export default function TopBar({ title, onBack, badge }) {
  return (
    <div className={styles.topbar}>
      <div className={styles.left}>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
        )}
      </div>
      <span className={styles.title}>{title}</span>
      <div className={styles.right}>
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>
    </div>
  )
}
