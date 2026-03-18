import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useTranslation } from '../hooks/useTranslation'
import TopBar from '../components/TopBar'
import ProgressDots from '../components/ProgressDots'
import Certificate from '../components/Certificate'
import StatusBadge from '../components/StatusBadge'
import { CalendarX } from 'lucide-react'
import styles from './ReportScreen.module.css'

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ReportScreen() {
  const { state } = useAppContext()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const cert = state.certificate

  if (!cert) {
    return (
      <div className={styles.screen}>
        <TopBar title={t('report_title')} onBack={() => navigate('/guided-check')} />
        <div className={styles.empty}>
          <p>No certificate found. Please complete the guided check first.</p>
          <button onClick={() => navigate('/')} className={styles.homeBtn}>Start over</button>
        </div>
      </div>
    )
  }

  const hddPriorCheck = cert.checks?.find(c => c.id === 'hdd_prior_recordings')
  const showHDDAlert  = hddPriorCheck?.status === 'attention' && state.quotation?.hddIsNew

  return (
    <div className={styles.screen}>
      <TopBar title={t('report_title')} onBack={() => navigate('/guided-check')} />
      <ProgressDots total={4} current={4} />

      <div className={styles.content}>
        <Certificate certificate={cert} />

        {/* HDD Prior Recordings Alert */}
        {showHDDAlert && (
          <div className={styles.hddAlert}>
            <div className={styles.hddAlertIcon}><CalendarX size={22} color="var(--he-amber)" /></div>
            <p className={styles.hddAlertText}>
              {t('hdd_alert_body', {
                date: formatDate(hddPriorCheck.oldestDate),
                months: hddPriorCheck.monthsDifference,
                installDate: formatDate(cert.installDate),
              })}
            </p>
          </div>
        )}

        {/* Check items */}
        <div className={styles.checkList}>
          {cert.checks?.map(check => (
            <div key={check.id} className={styles.checkItem}>
              <div className={styles.checkTop}>
                <StatusBadge status={check.status} />
                <span className={styles.checkName}>{check.name}</span>
              </div>
              <p className={styles.observation}>{check.observation}</p>
              <div className={styles.comparison}>
                <div className={styles.compCol}>
                  <span className={styles.compLabel}>Quoted</span>
                  <span className={styles.compValue}>{check.quoted || '—'}</span>
                </div>
                <div className={styles.compDivider} />
                <div className={styles.compCol}>
                  <span className={styles.compLabel}>Recorded</span>
                  <span className={styles.compValue}>{check.recorded || '—'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="button" className={styles.shareBtn} onClick={() => navigate('/share')}>
          {t('btn_share_certificate')}
        </button>
      </div>
    </div>
  )
}
