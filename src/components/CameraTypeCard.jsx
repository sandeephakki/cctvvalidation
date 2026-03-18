import styles from './CameraTypeCard.module.css'

function DVRIllustration() {
  return (
    <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
      <rect x="18" y="14" width="28" height="16" rx="3" fill="#1877C8" opacity="0.15" stroke="#1877C8" strokeWidth="1.5"/>
      <rect x="22" y="18" width="4" height="3" rx="1" fill="#1877C8" opacity="0.5"/>
      <rect x="28" y="18" width="4" height="3" rx="1" fill="#1877C8" opacity="0.5"/>
      <rect x="34" y="18" width="4" height="3" rx="1" fill="#1877C8" opacity="0.5"/>
      {/* Wires to camera shapes */}
      <line x1="20" y1="14" x2="8" y2="6" stroke="#1877C8" strokeWidth="1" opacity="0.6"/>
      <rect x="4" y="3" width="8" height="6" rx="1.5" fill="#1877C8" opacity="0.4"/>
      <line x1="44" y1="14" x2="56" y2="6" stroke="#1877C8" strokeWidth="1" opacity="0.6"/>
      <rect x="52" y="3" width="8" height="6" rx="1.5" fill="#1877C8" opacity="0.4"/>
      <line x1="20" y1="30" x2="8" y2="37" stroke="#1877C8" strokeWidth="1" opacity="0.6"/>
      <rect x="4" y="34" width="8" height="6" rx="1.5" fill="#1877C8" opacity="0.4"/>
      <line x1="44" y1="30" x2="56" y2="37" stroke="#1877C8" strokeWidth="1" opacity="0.6"/>
      <rect x="52" y="34" width="8" height="6" rx="1.5" fill="#1877C8" opacity="0.4"/>
    </svg>
  )
}

function NVRIllustration() {
  return (
    <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
      <rect x="18" y="12" width="28" height="16" rx="3" fill="#1877C8" opacity="0.15" stroke="#1877C8" strokeWidth="1.5"/>
      <circle cx="26" cy="20" r="3" fill="#1877C8" opacity="0.4"/>
      <rect x="30" y="18" width="12" height="4" rx="1" fill="#1877C8" opacity="0.3"/>
      {/* Ethernet lines */}
      <line x1="18" y1="20" x2="6" y2="14" stroke="#1877C8" strokeWidth="1.5" opacity="0.6"/>
      <rect x="2" y="11" width="6" height="5" rx="1" fill="#1877C8" opacity="0.4"/>
      <line x1="18" y1="20" x2="6" y2="26" stroke="#1877C8" strokeWidth="1.5" opacity="0.6"/>
      <rect x="2" y="23" width="6" height="5" rx="1" fill="#1877C8" opacity="0.4"/>
      <line x1="46" y1="20" x2="58" y2="14" stroke="#1877C8" strokeWidth="1.5" opacity="0.6"/>
      <rect x="56" y="11" width="6" height="5" rx="1" fill="#1877C8" opacity="0.4"/>
    </svg>
  )
}

function WiFiIllustration() {
  return (
    <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
      <rect x="22" y="16" width="20" height="14" rx="3" fill="#1877C8" opacity="0.15" stroke="#1877C8" strokeWidth="1.5"/>
      <circle cx="32" cy="23" r="3" fill="#1877C8" opacity="0.5"/>
      {/* WiFi arcs */}
      <path d="M24 10 Q32 5 40 10" stroke="#1877C8" strokeWidth="1.5" fill="none" opacity="0.8" strokeLinecap="round"/>
      <path d="M27 13 Q32 9 37 13" stroke="#1877C8" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round"/>
      <path d="M29.5 16 Q32 14 34.5 16" stroke="#1877C8" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round"/>
    </svg>
  )
}

function CloudIllustration() {
  return (
    <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
      <rect x="22" y="22" width="20" height="14" rx="3" fill="#1877C8" opacity="0.15" stroke="#1877C8" strokeWidth="1.5"/>
      <circle cx="32" cy="29" r="3" fill="#1877C8" opacity="0.5"/>
      {/* Cloud */}
      <path d="M18 16 Q18 10 24 10 Q25 6 30 6 Q36 6 37 10 Q42 10 42 16 Q42 20 37 20 L22 20 Q18 20 18 16Z" fill="#1877C8" opacity="0.15" stroke="#1877C8" strokeWidth="1.5"/>
      {/* Arrow up */}
      <line x1="32" y1="20" x2="32" y2="22" stroke="#1877C8" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M29 17 L32 14 L35 17" stroke="#1877C8" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const ILLUSTRATIONS = { dvr: DVRIllustration, nvr: NVRIllustration, wifi: WiFiIllustration, cloud: CloudIllustration }

export default function CameraTypeCard({ type, label, sub, selected, onSelect }) {
  const Illustration = ILLUSTRATIONS[type] || DVRIllustration
  return (
    <button
      type="button"
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={() => onSelect(type)}
      aria-pressed={selected}
    >
      <div className={styles.illustration}><Illustration /></div>
      <span className={styles.label}>{label}</span>
      <span className={styles.sub}>{sub}</span>
    </button>
  )
}
