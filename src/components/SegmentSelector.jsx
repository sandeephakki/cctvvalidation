import styles from './SegmentSelector.module.css'

export default function SegmentSelector({ options = [], value, onChange, scrollable = false }) {
  return (
    <div className={scrollable ? styles.wrapScrollable : styles.wrap}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          className={`${styles.btn} ${value === opt.value ? styles.selected : ''}`}
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
        >
          {opt.icon && <span className={styles.icon}>{opt.icon}</span>}
          <span className={styles.label}>{opt.label}</span>
          {opt.sub && <span className={styles.sub}>{opt.sub}</span>}
        </button>
      ))}
    </div>
  )
}
