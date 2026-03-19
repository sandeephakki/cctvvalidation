import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import TopBar from '../components/TopBar'
import CertificateCard from '../components/CertificateCard'
import { X } from 'lucide-react'
import styles from './CertificateScreen.module.css'

const REMINDER_KEY = 'cert_reminder_dismissed'

export default function CertificateScreen() {
  const { state, dispatch } = useAppContext()
  const navigate = useNavigate()
  const cert = state.certificate

  // SEC: allowed localStorage key per SEC-04
  const [showReminder, setShowReminder] = useState(
    !localStorage.getItem(REMINDER_KEY)
  )

  useEffect(() => {
    // Verify credentials are gone (SEC-09)
    if (!cert) { navigate('/'); return }
  }, [cert])

  function dismissReminder() {
    localStorage.setItem(REMINDER_KEY, 'true')
    setShowReminder(false)
  }

  function handleScanAgain() {
    dispatch({ type: 'RESET' })
    navigate('/')
  }

  if (!cert) return null

  return (
    <div className={styles.screen}>
      {/* No back arrow — credentials are gone */}
      <TopBar title="Certificate" />
      <div className={styles.content}>

        {/* One-time credential reminder */}
        {showReminder && (
          <div className={styles.reminder} role="note">
            <p className={styles.reminderText}>
              Your device credentials are not saved. Note them down if you want to scan again.
            </p>
            <button className={styles.dismissBtn} onClick={dismissReminder} aria-label="Dismiss reminder">
              <X size={16} />
            </button>
          </div>
        )}

        <CertificateCard certificate={cert} />

        <div className={styles.actions}>
          <button type="button" className={styles.shareBtn} onClick={() => navigate('/share')}>
            Share Certificate →
          </button>
          <button type="button" className={styles.scanAgainBtn} onClick={handleScanAgain}>
            Scan Again
          </button>
        </div>
      </div>
    </div>
  )
}
