import HakkiEyeLogo from './HakkiEyeLogo'
import styles from './Certificate.module.css'
import { useTranslation } from '../hooks/useTranslation'

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function Certificate({ certificate }) {
  const { t } = useTranslation()
  if (!certificate) return null
  const isOk = certificate.summary?.overallStatus === 'ok'

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <HakkiEyeLogo size={36} />
        <div>
          <div className={styles.wordmark}>
            <span className={styles.hakki}>Hakki</span><span className={styles.eye}>Eye</span>
          </div>
          <div className={styles.certLabel}>{t('cert_label')}</div>
        </div>
      </div>

      <div className={styles.idRow}>
        <span className={styles.idLabel}>ID</span>
        <span className={styles.id}>{certificate.id}</span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaItem}>📅 {formatDate(certificate.generatedAt)}</span>
        <span className={styles.metaItem}>📷 {(certificate.cameraType || '').toUpperCase()}</span>
      </div>

      <div className={`${styles.overallPill} ${isOk ? styles.pillOk : styles.pillAttention}`}>
        {isOk ? '✅' : '⚠️'} {certificate.summary?.overallObservation}
      </div>

      {/* QR placeholder — Phase 2 will make this live */}
      <div className={styles.qrRow}>
        <div className={styles.qrPlaceholder}>
          <span className={styles.qrText}>QR</span>
          <span className={styles.qrSub}>Phase 2</span>
        </div>
        <p className={styles.disclaimer}>{t('cert_disclaimer')}</p>
      </div>
    </div>
  )
}
