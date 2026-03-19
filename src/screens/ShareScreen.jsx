import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { buildWhatsappText } from '../utils/whatsappShare'
import { generatePDF } from '../utils/pdfGenerator'
import TopBar from '../components/TopBar'
import CertificateCard from '../components/CertificateCard'
import WhatsAppButton from '../components/WhatsAppButton'
import { FileText, Copy, Check } from 'lucide-react'
import styles from './ShareScreen.module.css'

export default function ShareScreen() {
  const { state } = useAppContext()
  const navigate = useNavigate()
  const cert = state.certificate
  const [waText, setWaText] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!cert) { navigate('/'); return }
    setWaText(buildWhatsappText(cert))
  }, [cert])

  if (!cert) return null

  function handleCopy() {
    navigator.clipboard.writeText(waText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={styles.screen}>
      <TopBar title="Share" onBack={() => navigate('/certificate')} />
      <div className={styles.content}>

        {/* WhatsApp — most prominent, first */}
        <WhatsAppButton text={waText} />

        {/* Certificate preview */}
        <div className={styles.previewSection}>
          <span className={styles.previewLabel}>Certificate preview</span>
          <pre className={styles.preview}>{waText}</pre>
        </div>

        {/* Secondary actions */}
        <div className={styles.secondaryRow}>
          <button type="button" className={styles.secondaryBtn} onClick={() => generatePDF(cert)}>
            <FileText size={18} />
            <span>Download PDF</span>
          </button>
          <button type="button" className={styles.secondaryBtn} onClick={handleCopy}>
            {copied ? <Check size={18} color="var(--he-green)" /> : <Copy size={18} />}
            <span>{copied ? 'Copied!' : 'Copy text'}</span>
          </button>
        </div>

        <p className={styles.footer}>
          HakkiEye is free and open source. Your data never leaves your phone. No credentials are stored.
        </p>
      </div>
    </div>
  )
}
