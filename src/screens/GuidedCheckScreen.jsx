import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useTranslation } from '../hooks/useTranslation'
import { useAuditLogic } from '../hooks/useAuditLogic'
import TopBar from '../components/TopBar'
import ProgressDots from '../components/ProgressDots'
import { Check } from 'lucide-react'
import { checkResolutionPlausibility, checkCameraCountPlausibility, checkHDDPlausibility } from '../utils/plausibilityChecks'
import styles from './GuidedCheckScreen.module.css'

const TODAY = new Date().toISOString().split('T')[0]

function buildChecks(cameraType) {
  const hasHDD = cameraType === 'dvr' || cameraType === 'nvr'
  const checks = [
    {
      id: 'camera_resolution',
      titleKey: 'check1_title',
      instructionKey: 'check1_instruction',
      inputType: 'resolution',
    },
  ]
  if (hasHDD) {
    checks.push(
      {
        id: 'hdd_size',
        titleKey: 'check2_title',
        instructionKey: 'check2_instruction',
        inputType: 'hdd_gb',
      },
      {
        id: 'hdd_prior_recordings',
        titleKey: 'check3_title',
        instructionKey: 'check3_instruction',
        inputType: 'date',
      }
    )
  }
  checks.push({
    id: 'camera_count',
    titleKey: 'check4_title',
    instructionKey: 'check4_instruction',
    inputType: 'number',
  })
  return checks
}

export default function GuidedCheckScreen() {
  const { state, dispatch } = useAppContext()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { generateCertificate } = useAuditLogic()
  const checks = buildChecks(state.cameraType)

  const [currentStep, setCurrentStep] = useState(0)
  const [values, setValues]   = useState({})
  const [done, setDone]       = useState({})

  const appName = state.quotation?.nvrBrand || 'your CCTV app'

  function getValue(id) { return values[id] || '' }
  function setValue(id, v) { setValues(prev => ({ ...prev, [id]: v })) }

  function isInputValid(check) {
    const v = getValue(check.id)
    if (!v) return false
    if (check.inputType === 'resolution') return /\d+[xX×]\d+/.test(v)
    if (check.inputType === 'hdd_gb')     return parseInt(v, 10) > 0
    if (check.inputType === 'number')     return parseInt(v, 10) > 0
    if (check.inputType === 'date') {
      // BUG-09 FIX: JS-side validation — reject future dates even if typed manually
      const entered = new Date(v)
      const today   = new Date(TODAY)
      return !isNaN(entered.getTime()) && entered <= today
    }
    return true
  }

  // NEW-01 FIX: was imported+used but never defined — caused ReferenceError crash on Screen 3
  // V3-02 FIX: suppress warnings until input is complete enough to evaluate
  function getPlausibilityWarning(check) {
    const v = getValue(check.id)
    if (!v || v === '__unverified__') return null
    if (check.inputType === 'resolution') {
      // Only warn once both width×height parts are present — not on first keystroke
      if (!/\d[xX×]\d/.test(v)) return null
      return checkResolutionPlausibility(v)
    }
    if (check.inputType === 'hdd_gb') {
      // Wait for at least 2 digits — avoids firing "too small" on first keystroke
      if (v.length < 2) return null
      return checkHDDPlausibility(v)
    }
    if (check.inputType === 'number') {
      // Camera count is a single digit — evaluate immediately but only if non-empty
      if (!v.length) return null
      return checkCameraCountPlausibility(v)
    }
    return null
  }

  function advance(check) {
    setDone(prev => ({ ...prev, [check.id]: true }))
    if (currentStep < checks.length - 1) {
      setCurrentStep(s => s + 1)
    }
  }

  function handleSkip(check) {
    setValue(check.id, '__unverified__')
    advance(check)
  }

  function handleSave(check) {
    if (!isInputValid(check)) return
    advance(check)
  }

  const allDone = checks.every(c => done[c.id])

  function handleGenerate() {
    // Build findings from current values (don't wait for context)
    const findings = {}
    checks.forEach(c => {
      const v = values[c.id]
      if (!v || v === '__unverified__') return
      if (c.id === 'camera_resolution') findings.cameraResolution    = v
      if (c.id === 'hdd_size')          findings.hddActualGB         = parseInt(v, 10)
      if (c.id === 'hdd_prior_recordings')         findings.oldestRecordingDate = v
      if (c.id === 'camera_count')      findings.activeCameraCount   = parseInt(v, 10)
    })

    // Save to context for future reference
    dispatch({ type: 'SET_FINDINGS', payload: findings })

    // Pass findings directly so certificate generation doesn't depend on
    // React's async state update settling first
    generateCertificate(findings)
    navigate('/report')
  }

  return (
    <div className={styles.screen}>
      <TopBar
        title={t('screen3_title')}
        onBack={() => navigate('/quotation')}
        badge={t('screen3_badge', { count: checks.length })}
      />
      <ProgressDots total={4} current={3} />

      <div className={styles.content}>
        {checks.map((check, idx) => {
          const isDone   = !!done[check.id]
          const isActive = idx === currentStep
          const isLocked = idx > currentStep
          const instrText = t(check.instructionKey, { appName })

          return (
            <div
              key={check.id}
              className={[
                styles.card,
                isLocked ? styles.locked   : '',
                isDone   ? styles.cardDone : '',
              ].join(' ')}
            >
              {/* Step circle */}
              <div
                className={[
                  styles.stepCircle,
                  isDone   ? styles.circleOk     : '',
                  isActive ? styles.circleActive : '',
                  isLocked ? styles.circleFuture : '',
                ].join(' ')}
              >
                {isDone ? <Check size={14} /> : <span>{idx + 1}</span>}
              </div>

              <div className={styles.body}>
                <h3 className={styles.title}>{t(check.titleKey)}</h3>

                {/* Screenshot placeholder */}
                <div className={styles.screenshotPlaceholder}>
                  <div className={styles.phoneFrame}>
                    <p className={styles.placeholderLabel}>{appName} — {t(check.titleKey)}</p>
                    <svg className={styles.annotation} viewBox="0 0 120 80" fill="none" aria-hidden="true">
                      <rect x="10" y="10" width="100" height="60" rx="4"
                        fill="#E6F1FB" stroke="#1877C8" strokeWidth="1.5" strokeDasharray="4 3"/>
                      <text x="60" y="36" textAnchor="middle" fontSize="9" fill="#6B6860">
                        Tap the area shown in your app
                      </text>
                      <path d="M72 44 L88 44 L84 40 M88 44 L84 48"
                        stroke="#BA7517" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="50" cy="44" r="8" stroke="#1877C8"
                        strokeWidth="1.5" fill="#E6F1FB"/>
                      <line x1="50" y1="40" x2="50" y2="48"
                        stroke="#1877C8" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="46" y1="44" x2="54" y2="44"
                        stroke="#1877C8" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>

                <p className={styles.instruction}>{instrText}</p>

                {/* Input */}
                {check.inputType === 'resolution' && (
                  <input
                    type="text"
                    className={styles.input}
                    placeholder={t('resolution_placeholder')}
                    value={getValue(check.id)}
                    onChange={e => setValue(check.id, e.target.value)}
                    disabled={isLocked || isDone}
                    aria-label={t(check.titleKey)}
                  />
                )}
                {check.inputType === 'hdd_gb' && (
                  <div className={styles.inputRow}>
                    <input
                      type="number"
                      className={styles.input}
                      placeholder={t('hdd_gb_placeholder')}
                      value={getValue(check.id)}
                      onChange={e => setValue(check.id, e.target.value)}
                      disabled={isLocked || isDone}
                      min="1"
                      aria-label={t(check.titleKey)}
                    />
                    <span className={styles.unit}>GB</span>
                  </div>
                )}
                {check.inputType === 'date' && (
                  <input
                    type="date"
                    className={styles.input}
                    max={TODAY}
                    value={getValue(check.id)}
                    onChange={e => setValue(check.id, e.target.value)}
                    disabled={isLocked || isDone}
                    aria-label={t(check.titleKey)}
                  />
                )}
                {check.inputType === 'number' && (
                  <input
                    type="number"
                    className={styles.input}
                    placeholder={t('camera_count_placeholder')}
                    value={getValue(check.id)}
                    onChange={e => setValue(check.id, e.target.value)}
                    disabled={isLocked || isDone}
                    min="1"
                    max="64"
                    aria-label={t(check.titleKey)}
                  />
                )}

                {/* Actions */}
                {/* Plausibility warning — soft, non-blocking. OBS-A FIX: called once */}
                {(() => {
                  const warning = isActive && !isDone ? getPlausibilityWarning(check) : null
                  return warning ? (
                    <p style={{fontSize:'12px', color:'var(--he-amber)', marginTop:'4px'}}>
                      ⚠️ {warning}
                    </p>
                  ) : null
                })()}

                {!isDone && isActive && (
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.saveBtn}
                      onClick={() => handleSave(check)}
                      disabled={!isInputValid(check)}
          aria-disabled={!isInputValid(check)}
                    >
                      {t('btn_save_next')}
                    </button>
                    <button
                      type="button"
                      className={styles.skipBtn}
                      onClick={() => handleSkip(check)}
                    >
                      {t('btn_cant_find')}
                    </button>
                  </div>
                )}

                {isDone && (
                  <div className={styles.doneRow}>
                    <Check size={16} color="var(--he-green)" />
                    <span className={styles.doneText}>
                      {values[check.id] === '__unverified__'
                        ? t('status_unverified')
                        : values[check.id]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {allDone && (
          <button
            type="button"
            className={styles.generateBtn}
            onClick={handleGenerate}
          >
            {t('btn_generate')}
          </button>
        )}
      </div>
    </div>
  )
}
