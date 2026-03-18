import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useTranslation } from '../hooks/useTranslation'
import TopBar from '../components/TopBar'
import ProgressDots from '../components/ProgressDots'
import WhatsAppButton from '../components/WhatsAppButton'
import { buildWhatsappText } from '../utils/whatsappShare'
import { generatePDF } from '../utils/pdfGenerator'
import { MessageSquare, FileText, Share2 } from 'lucide-react'
import styles from './ShareScreen.module.css'

export default function ShareScreen() {
  const { state } = useAppContext()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const cert = state.certificate
  const [whatsappText, setWhatsappText] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (cert) setWhatsappText(buildWhatsappText(cert, t))
  }, [cert])

  if (!cert) {
    return (
      <div className={styles.screen}>
        <TopBar title={t('share_title')} onBack={() => navigate('/report')} />
        <div className={styles.empty}>
          <p>No certificate found.</p>
          <button onClick={() => navigate('/')} className={styles.homeBtn}>Start over</button>
        </div>
      </div>
    )
  }

  function handleCopy() {
    navigator.clipboard.writeText(whatsappText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handlePDF() { generatePDF(cert) }

  const nextSteps = [
    { icon: '💬', text: t('next_step_1') },
    { icon: '📋', text: t('next_step_2') },
    { icon: '🔗', text: t('next_step_3') },
  ]

  return (
    <div className={styles.screen}>
      <TopBar title={t('share_title')} onBack={() => navigate('/report')} />
      <ProgressDots total={4} current={4} />

      <div className={styles.content}>
        {/* WhatsApp — most prominent, first */}
        <WhatsAppButton text={whatsappText} />

        {/* Preview */}
        <div className={styles.previewSection}>
          <span className={styles.previewLabel}>{t('share_preview_label')}</span>
          <pre className={styles.preview}>{whatsappText}</pre>
        </div>

        {/* Secondary actions */}
        <div className={styles.secondaryRow}>
          <button type="button" className={styles.secondaryBtn} onClick={handlePDF}>
            <FileText size={18} />
            <span>{t('btn_download_pdf')}</span>
          </button>
          <button type="button" className={styles.secondaryBtn} onClick={handleCopy}>
            <MessageSquare size={18} />
            <span>{copied ? 'Copied!' : t('btn_copy')}</span>
          </button>
        </div>

        {/* What to do next */}
        <div className={styles.nextSection}>
          <h3 className={styles.nextTitle}>{t('next_steps_title')}</h3>
          {nextSteps.map((step, i) => (
            <div key={i} className={styles.nextStep}>
              <span className={styles.nextIcon}>{step.icon}</span>
              <p className={styles.nextText}>{step.text}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className={styles.footerPrivacy}>{t('footer_privacy')}</p>
        <p className={styles.footerContact}>
          Questions? <a href="mailto:contact@hakki.app">contact@hakki.app</a>
        </p>
      </div>
    </div>
  )
}
