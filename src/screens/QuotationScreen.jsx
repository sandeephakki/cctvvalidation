import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useTranslation } from '../hooks/useTranslation'
import TopBar from '../components/TopBar'
import ProgressDots from '../components/ProgressDots'
import SegmentSelector from '../components/SegmentSelector'
import styles from './QuotationScreen.module.css'

const TODAY = new Date().toISOString().split('T')[0]

const DVR_APPS  = ['XMEye','iCSee','SmartPSS','DMSS','Other']
const NVR_APPS  = ['EasyView Pro','iVMS-4500','Hik-Connect','Other']
const WIFI_APPS = ['Tapo','Mi Home','Realme Home','Other']
const CLOUD_APPS = ['Imou Life','Ezviz','YI Home','Other']

function getApps(cameraType) {
  if (cameraType === 'dvr')   return DVR_APPS
  if (cameraType === 'nvr')   return NVR_APPS
  if (cameraType === 'wifi')  return WIFI_APPS
  if (cameraType === 'cloud') return CLOUD_APPS
  return ['Other']
}

export default function QuotationScreen() {
  const { state, dispatch } = useAppContext()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const hasHDD = state.cameraType === 'dvr' || state.cameraType === 'nvr'
  const q = state.quotation

  const [installDate, setInstallDate] = useState(q.installDate || '')
  const [cameraCount, setCameraCount] = useState(q.cameraCount ? String(q.cameraCount) : null)
  const [otherCount, setOtherCount] = useState('')
  const [showOtherCount, setShowOtherCount] = useState(false)
  const [cameraMP, setCameraMP] = useState(q.cameraMP ? String(q.cameraMP) : null)
  const [hddSizeGB, setHddSizeGB] = useState(q.hddSizeGB ? String(q.hddSizeGB) : null)
  const [hddIsNew, setHddIsNew] = useState(q.hddIsNew !== false)
  const [nvrBrand, setNvrBrand] = useState(q.nvrBrand || null)

  const apps = getApps(state.cameraType)
  const cameraCountOptions = [
    { value: '2', label: '2' },
    { value: '4', label: '4' },
    { value: '6', label: '6' },
    { value: '8', label: '8' },
    { value: '12', label: '12' },
    { value: 'other', label: 'Other' },
  ]
  const mpOptions = [
    { value: '2',  label: '2 MP', sub: 'Basic' },
    { value: '4',  label: '4 MP', sub: 'Clear' },
    { value: '5',  label: '5 MP', sub: 'Sharp' },
    { value: '8',  label: '8 MP', sub: 'HD' },
  ]
  const hddOptions = [
    { value: '500',  label: '500 GB' },
    { value: '1000', label: '1 TB'   },
    { value: '2000', label: '2 TB'   },
    { value: '4000', label: '4 TB'   },
  ]
  const appOptions = apps.map(a => ({ value: a, label: a }))

  // BUG-08 FIX: validate range, not just truthiness
  function effectiveCountIsValid() {
    if (cameraCount !== 'other') return !!cameraCount
    const n = parseInt(otherCount, 10)
    return !isNaN(n) && n >= 1 && n <= 64
  }

  function effectiveCount() {
    if (cameraCount === 'other') return otherCount
    return cameraCount
  }

  const isValid =
    installDate &&
    new Date(installDate) <= new Date(TODAY) &&  // NEW-05 FIX: block manually-typed future dates
    effectiveCountIsValid() &&
    cameraMP &&
    (hasHDD ? hddSizeGB : true) &&
    nvrBrand

  function handleContinue() {
    if (!isValid) return
    dispatch({
      type: 'SET_QUOTATION',
      payload: {
        installDate,
        cameraCount: parseInt(effectiveCount(), 10),
        cameraMP: parseFloat(cameraMP),
        hddSizeGB: hasHDD ? parseInt(hddSizeGB, 10) : null,
        hddIsNew: hasHDD ? hddIsNew : null,
        nvrBrand,
      }
    })
    navigate('/guided-check')
  }

  return (
    <div className={styles.screen}>
      <TopBar title={t('screen2_title')} onBack={() => navigate('/camera-type')} />
      <ProgressDots total={4} current={2} />

      <div className={styles.content}>
        {/* Install date */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="installDate">{t('field_install_date')}</label>
          <input
            id="installDate"
            type="date"
            max={TODAY}
            value={installDate}
            onChange={e => setInstallDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>

        {/* Camera count */}
        <div className={styles.field}>
          <label className={styles.label}>{t('field_camera_count')}</label>
          <SegmentSelector
            options={cameraCountOptions}
            value={cameraCount}
            onChange={v => {
              setCameraCount(v)
              setShowOtherCount(v === 'other')
            }}
            scrollable
          />
          {showOtherCount && (
            <>
              <input
                type="number"
                min="1"
                max="64"
                value={otherCount}
                onChange={e => setOtherCount(e.target.value)}
                placeholder="e.g. 16"
                className={styles.numInput}
                aria-label="Number of cameras"
              />
              {/* NEW-04 FIX: show why the Continue button is disabled */}
              {otherCount !== '' && parseInt(otherCount, 10) > 64 && (
                <p className={styles.fieldError}>{t('field_count_max_error')}</p>
              )}
              {otherCount !== '' && (isNaN(parseInt(otherCount, 10)) || parseInt(otherCount, 10) < 1) && (
                <p className={styles.fieldError}>{t('field_count_min_error')}</p>
              )}
            </>
          )}
        </div>

        {/* Camera MP */}
        <div className={styles.field}>
          <label className={styles.label}>{t('field_camera_mp')}</label>
          <SegmentSelector options={mpOptions} value={cameraMP} onChange={setCameraMP} />
        </div>

        {/* HDD fields — DVR/NVR only */}
        {hasHDD && (
          <>
            <div className={styles.field}>
              <label className={styles.label}>{t('field_hdd_size')}</label>
              <SegmentSelector options={hddOptions} value={hddSizeGB} onChange={setHddSizeGB} scrollable />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t('field_hdd_type')}</label>
              <SegmentSelector
                options={[
                  { value: 'new',    label: t('field_hdd_new')    },
                  { value: 'reused', label: t('field_hdd_reused') },
                ]}
                value={hddIsNew ? 'new' : 'reused'}
                onChange={v => setHddIsNew(v === 'new')}
              />
            </div>
          </>
        )}

        {/* App brand */}
        <div className={styles.field}>
          <label className={styles.label}>{t('field_app_brand')}</label>
          <SegmentSelector options={appOptions} value={nvrBrand} onChange={setNvrBrand} scrollable />
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.continueBtn}
          onClick={handleContinue}
          disabled={!isValid}
          aria-disabled={!isValid}
        >
          {t('btn_continue')}
        </button>
      </div>
    </div>
  )
}
