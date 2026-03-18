import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { runFullScan } from '../services/scanService'
import HakkiEyeLogo from '../components/HakkiEyeLogo'
import { Eye, EyeOff } from 'lucide-react'
import styles from './ConnectScreen.module.css'

const IP_PATTERN = /^(\d{1,3}\.){3}\d{1,3}$/

const BRANDS = [
  { value: 'cpplus',    label: 'CP Plus'    },
  { value: 'hikvision', label: 'Hikvision'  },
  { value: 'dahua',     label: 'Dahua'      },
  { value: 'other',     label: 'Other'      },
]

export default function ConnectScreen() {
  const { dispatch } = useAppContext()
  const navigate = useNavigate()

  const [ip, setIp] = useState('')
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [deviceType, setDeviceType] = useState(null)
  const [ipError, setIpError] = useState('')

  const ipValid = IP_PATTERN.test(ip.trim())
  const canConnect = ipValid && username.trim().length > 0 && password.length > 0

  function validateIp(val) {
    if (!val) { setIpError(''); return }
    if (!IP_PATTERN.test(val.trim())) {
      setIpError('Enter a valid IP address (e.g. 192.168.1.64)')
    } else {
      setIpError('')
    }
  }

  function handleConnect() {
    if (!canConnect) return
    // SEC: credentials stored in React state only — never in localStorage
    dispatch({ type: 'SET_CONNECTION', payload: { ip: ip.trim(), username: username.trim(), password, deviceType } })
    navigate('/scanning')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.hero}>
        <HakkiEyeLogo size={56} />
        <div className={styles.wordmark}>
          <span className={styles.hakki}>Hakki</span><span className={styles.eye}>Eye</span>
        </div>
        <p className={styles.tagline}>Scan. See. Know.</p>
      </div>

      <div className={styles.form}>
        <h2 className={styles.sectionTitle}>Connect to your CCTV system</h2>

        {/* IP Address */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="ip">Device IP Address</label>
          <input
            id="ip"
            type="text"
            inputMode="numeric"
            placeholder="192.168.1.___"
            value={ip}
            onChange={e => { setIp(e.target.value); validateIp(e.target.value) }}
            className={`${styles.input} ${ipError ? styles.inputError : ''}`}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck="false"
          />
          {ipError && <p className={styles.fieldError} role="alert">{ipError}</p>}
        </div>

        {/* Username */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className={styles.input}
            autoComplete="username"
            autoCorrect="off"
            autoCapitalize="none"
          />
        </div>

        {/* Password */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">Password</label>
          <div className={styles.passwordWrap}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`${styles.input} ${styles.passwordInput}`}
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Brand hint */}
        <div className={styles.field}>
          <label className={styles.label}>What app do you use? <span className={styles.optional}>(optional)</span></label>
          <div className={styles.brandGrid}>
            {BRANDS.map(b => (
              <button
                key={b.value}
                type="button"
                className={`${styles.brandBtn} ${deviceType === b.value ? styles.brandSelected : ''}`}
                onClick={() => setDeviceType(deviceType === b.value ? null : b.value)}
                aria-pressed={deviceType === b.value}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Connect button */}
        <button
          type="button"
          className={styles.connectBtn}
          onClick={handleConnect}
          disabled={!canConnect}
          aria-disabled={!canConnect}
        >
          Connect
        </button>

        <p className={styles.helper}>
          Your device must be on the same WiFi network as this phone
        </p>
      </div>
    </div>
  )
}
