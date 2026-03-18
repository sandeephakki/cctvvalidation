import { Check, Loader2, AlertCircle } from 'lucide-react'
import styles from './ScanStep.module.css'

export default function ScanStep({ label, status }) {
  return (
    <div className={`${styles.step} ${styles[status]}`}>
      <div className={styles.icon} aria-label={status}>
        {status === 'done'     && <Check size={18} />}
        {status === 'scanning' && <Loader2 size={18} className={styles.spin} />}
        {status === 'failed'   && <AlertCircle size={18} />}
        {status === 'waiting'  && <span className={styles.num}>●</span>}
      </div>
      <span className={styles.label}>{label}</span>
      <span className={styles.statusText}>
        {status === 'done'     && 'Done'}
        {status === 'scanning' && 'Reading...'}
        {status === 'failed'   && 'Could not read'}
        {status === 'waiting'  && 'Waiting'}
      </span>
    </div>
  )
}
