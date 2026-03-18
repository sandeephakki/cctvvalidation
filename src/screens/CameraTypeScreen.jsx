import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useTranslation } from '../hooks/useTranslation'
import TopBar from '../components/TopBar'
import CameraTypeCard from '../components/CameraTypeCard'
import styles from './CameraTypeScreen.module.css'

export default function CameraTypeScreen() {
  const { state, dispatch } = useAppContext()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(state.cameraType)

  const types = [
    { type: 'dvr',   label: t('camtype_dvr_label'),   sub: t('camtype_dvr_sub')   },
    { type: 'nvr',   label: t('camtype_nvr_label'),   sub: t('camtype_nvr_sub')   },
    { type: 'wifi',  label: t('camtype_wifi_label'),  sub: t('camtype_wifi_sub')  },
    { type: 'cloud', label: t('camtype_cloud_label'), sub: t('camtype_cloud_sub') },
  ]

  function handleContinue() {
    if (!selected) return
    dispatch({ type: 'SET_CAMERA_TYPE', payload: selected })
    navigate('/quotation')
  }

  return (
    <div className={styles.screen}>
      <TopBar title={t('screen_camtype_title')} onBack={() => navigate('/')} />

      <div className={styles.content}>
        <div className={styles.grid}>
          {types.map(({ type, label, sub }) => (
            <CameraTypeCard
              key={type}
              type={type}
              label={label}
              sub={sub}
              selected={selected === type}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.continueBtn}
          onClick={handleContinue}
          disabled={!selected}
          aria-disabled={!selected}
        >
          {t('btn_continue')}
        </button>
      </div>
    </div>
  )
}
