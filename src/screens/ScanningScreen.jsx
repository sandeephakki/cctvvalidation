import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { runFullScan } from '../services/scanService'
import TopBar from '../components/TopBar'
import ScanStep from '../components/ScanStep'
import styles from './ScanningScreen.module.css'

const PLAIN_ERRORS = {
  AUTH_FAILED: 'Wrong username or password. Try again.',
  TIMEOUT:     'The device took too long to respond. Check your WiFi connection.',
  UNREACHABLE: 'Could not reach the device. Check the IP address and make sure you are on the same WiFi.',
  NETWORK:     'Could not reach the device. Check the IP address and make sure you are on the same WiFi.',
  default:     'Something went wrong. Please try again.',
}

export default function ScanningScreen() {
  const { state, dispatch } = useAppContext()
  const navigate = useNavigate()

  const [steps, setSteps] = useState([
    { label: 'Device information', status: 'waiting' },
    { label: 'Camera channels',    status: 'waiting' },
    { label: 'Storage',            status: 'waiting' },
  ])
  const [error, setError] = useState(null)

  function setStep(idx, status) {
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, status } : s))
  }

  useEffect(() => {
    const { ip, username, password } = state.connection || {}
    if (!ip || !username || !password) {
      navigate('/')
      return
    }

    async function doScan() {
      setStep(0, 'scanning')

      const result = await runFullScan(ip, username, password, (step, total) => {
        // Progress: step 1=device, 2=cameras, 3=storage
        if (step >= 1) setStep(0, 'done')
        if (step >= 2) setStep(1, 'scanning')
        if (step >= 3) { setStep(1, 'done'); setStep(2, 'scanning') }
      })

      // Mark remaining steps
      if (result.success || result.scanMethod === 'partial') {
        setStep(0, result.deviceInfo ? 'done' : 'failed')
        setStep(1, result.cameras?.length ? 'done' : 'failed')
        setStep(2, result.storage?.length ? 'done' : 'failed')

        dispatch({ type: 'SET_SCAN_RESULT', payload: result })
        setTimeout(() => navigate('/results'), 800)
      } else {
        // Total failure
        setStep(0, 'failed')
        setStep(1, 'failed')
        setStep(2, 'failed')
        const msg = PLAIN_ERRORS[result.errorType] || PLAIN_ERRORS.default
        setError(msg)
      }
    }

    doScan()
  }, [])

  return (
    <div className={styles.screen}>
      {/* No back arrow — prevent navigating back mid-scan */}
      <TopBar title="HakkiEye" />
      <div className={styles.content}>
        <h2 className={styles.heading}>Reading your CCTV system...</h2>
        <div className={styles.steps}>
          {steps.map((step, i) => (
            <ScanStep key={i} label={step.label} status={step.status} />
          ))}
        </div>

        {error && (
          <div className={styles.errorBox} role="alert">
            <p className={styles.errorText}>{error}</p>
            <button
              className={styles.retryBtn}
              onClick={() => navigate('/')}
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
