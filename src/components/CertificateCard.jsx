import HakkiEyeLogo from './HakkiEyeLogo'
import CameraTable from './CameraTable'
import StorageTable from './StorageTable'
import styles from './CertificateCard.module.css'

function fmtDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
}

export default function CertificateCard({ certificate }) {
  if (!certificate) return null
  const { id, generatedAt, deviceInfo, cameras, storage, disclaimer, protocol, scanMethod, generatedBy } = certificate

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <HakkiEyeLogo size={36} />
        <div>
          <div className={styles.wordmark}><span className={styles.hakki}>Hakki</span><span className={styles.eye}>Eye</span></div>
          <div className={styles.certLabel}>Installation Scan Certificate</div>
        </div>
      </div>

      <div className={styles.idRow}>
        <span className={styles.idBadge}>ID</span>
        <span className={styles.id}>{id}</span>
      </div>

      <div className={styles.meta}>
        <span>📅 {fmtDate(generatedAt)}</span>
        {protocol && <span>🔌 {protocol.toUpperCase()}</span>}
        {scanMethod && <span>📡 {scanMethod}</span>}
      </div>

      {deviceInfo && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Device</div>
          <div className={styles.deviceInfo}>
            {deviceInfo.model && <div><span className={styles.fieldLabel}>Model</span> {deviceInfo.model}</div>}
            {deviceInfo.serialNumber && <div><span className={styles.fieldLabel}>Serial</span> {deviceInfo.serialNumber}</div>}
            {deviceInfo.firmwareVersion && <div><span className={styles.fieldLabel}>Firmware</span> {deviceInfo.firmwareVersion}</div>}
          </div>
        </div>
      )}

      {cameras?.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Cameras ({cameras.length})</div>
          <CameraTable cameras={cameras} />
        </div>
      )}

      {storage?.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Storage</div>
          <StorageTable storage={storage} />
        </div>
      )}

      <div className={styles.disclaimer}>{disclaimer}</div>
      <div className={styles.generatedBy}>{generatedBy}</div>
    </div>
  )
}
