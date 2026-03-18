import { CheckCircle, AlertCircle, HelpCircle } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'
import styles from './StatusBadge.module.css'

export default function StatusBadge({ status }) {
  const { t } = useTranslation()
  if (status === 'ok') {
    return (
      <span className={`${styles.badge} ${styles.ok}`}>
        <CheckCircle size={14} /> {t('status_ok')}
      </span>
    )
  }
  if (status === 'attention') {
    return (
      <span className={`${styles.badge} ${styles.attention}`}>
        <AlertCircle size={14} /> {t('status_attention')}
      </span>
    )
  }
  return (
    <span className={`${styles.badge} ${styles.unverified}`}>
      <HelpCircle size={14} /> {t('status_unverified')}
    </span>
  )
}
