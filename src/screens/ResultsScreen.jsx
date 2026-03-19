import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { generateCertificate } from '../utils/certificateGenerator'
import TopBar from '../components/TopBar'
import CameraTable from '../components/CameraTable'
import StorageTable from '../components/StorageTable'
import styles from './ResultsScreen.module.css'

export default function ResultsScreen() {
  const { state, dispatch } = useAppContext()
  const navigate = useNavigate()
  const scan = state.scanResult

  if (!scan) {
    navigate('/')
    return null
  }

  function handleUpdateCamera(idx, field, value, source) {
    const updated = scan.cameras.map((c, i) =>
      i === idx ? { ...c, [field]: value, dataSource: source } : c
    )
    dispatch({ type: 'SET_SCAN_RESULT', payload: { ...scan, cameras: updated, scanMethod: 'partial' } })
  }

  function handleGenerate() {
    const cert = generateCertificate(state.scanResult)
    dispatch({ type: 'SET_CERTIFICATE', payload: cert })
    // SEC: clear credentials before navigating — no going back
    dispatch({ type: 'CLEAR_CREDENTIALS' })
    navigate('/certificate')
  }

  const { deviceInfo, cameras, storage, scanMethod, protocol } = scan

  const showNote = scanMethod === 'partial' || scanMethod === 'manual'
  const noteText = scanMethod === 'manual'
    ? "Some fields could not be read automatically. You can tap any field to enter it manually."
    : "Most fields were read automatically. A few could not be read. Tap a field to fill it in."

  return (
    <div className={styles.screen}>
      <TopBar title="Scan Results" onBack={() => navigate('/')} />
      <div className={styles.content}>

        {/* Device info card */}
        {deviceInfo && (
          <div className={styles.deviceCard}>
            <div className={styles.deviceIcon}>📷</div>
            <div>
              <div className={styles.deviceModel}>{deviceInfo.model || 'CCTV Device'}</div>
              {deviceInfo.serialNumber && <div className={styles.deviceMeta}>Serial: {deviceInfo.serialNumber}</div>}
              <div className={styles.deviceMeta}>Protocol: {protocol?.toUpperCase() || '—'}</div>
            </div>
          </div>
        )}

        {/* Scan note — amber info, NOT a warning */}
        {showNote && (
          <div className={styles.infoNote} role="note">
            <span className={styles.infoIcon}>ℹ️</span>
            <p className={styles.infoText}>{noteText}</p>
          </div>
        )}

        {/* Cameras section — NO verdict labels, just data */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Cameras</h3>
          <CameraTable cameras={cameras} onUpdate={handleUpdateCamera} />
        </div>

        {/* Storage section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Storage</h3>
          <StorageTable storage={storage} />
        </div>

        {/* Generate — always enabled */}
        <button type="button" className={styles.generateBtn} onClick={handleGenerate}>
          Generate Certificate →
        </button>
      </div>
    </div>
  )
}
