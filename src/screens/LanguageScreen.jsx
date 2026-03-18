import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useTranslation } from '../hooks/useTranslation'
import HakkiEyeLogo from '../components/HakkiEyeLogo'
import styles from './LanguageScreen.module.css'

const LANGUAGES = [
  { code: 'en', native: 'English',   english: 'English'   },
  { code: 'kn', native: 'ಕನ್ನಡ',     english: 'Kannada'   },
  { code: 'hi', native: 'हिन्दी',    english: 'Hindi'     },
  { code: 'mr', native: 'मराठी',     english: 'Marathi'   },
  { code: 'ta', native: 'தமிழ்',     english: 'Tamil'     },
  { code: 'te', native: 'తెలుగు',    english: 'Telugu'    },
  { code: 'gu', native: 'ગુજરાતી',   english: 'Gujarati'  },
  { code: 'pa', native: 'ਪੰਜਾਬੀ',    english: 'Punjabi'   },
  { code: 'bn', native: 'বাংলা',     english: 'Bengali'   },
]

export default function LanguageScreen() {
  const { dispatch } = useAppContext()
  const { t } = useTranslation()  // NEW-06 FIX
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('hakkieye_lang')
    if (saved) {
      setSelected(saved)
      dispatch({ type: 'SET_LANG', payload: saved })  // BUG-06 FIX: restore to context
    }
  }, [])

  function handleContinue() {
    if (!selected) return
    localStorage.setItem('hakkieye_lang', selected)
    dispatch({ type: 'SET_LANG', payload: selected })
    navigate('/camera-type')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.hero}>
        <HakkiEyeLogo size={64} />
        <div className={styles.wordmark}>
          <span className={styles.hakki}>Hakki</span><span className={styles.eye}>Eye</span>
        </div>
        <p className={styles.tagline}>The eye that never misses</p>
        <p className={styles.instruction}>Select your language to get started</p>
      </div>

      <div className={styles.grid}>
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            type="button"
            className={`${styles.langBtn} ${selected === lang.code ? styles.selected : ''}`}
            onClick={() => setSelected(lang.code)}
            aria-pressed={selected === lang.code}
          >
            <span className={styles.native}>{lang.native}</span>
            <span className={styles.english}>{lang.english}</span>
          </button>
        ))}
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
