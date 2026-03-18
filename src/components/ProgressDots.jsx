import styles from './ProgressDots.module.css'

export default function ProgressDots({ total, current }) {
  return (
    <div className={styles.dots} role="progressbar" aria-valuenow={current} aria-valuemax={total}>
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        let cls = styles.dot
        if (step < current) cls += ' ' + styles.done
        else if (step === current) cls += ' ' + styles.active
        else cls += ' ' + styles.future
        return <span key={i} className={cls} aria-label={`Step ${step}`} />
      })}
    </div>
  )
}
