import { useAppContext } from '../context/AppContext'
import { useTranslation } from './useTranslation'
import { generateCertificateId } from '../utils/certificateId'
import {
  checkCameraResolution,
  checkHDDSize,
  checkHDDAge,
  checkCameraCount,
  resolutionToMP,
} from '../utils/fraudDetection'
import { buildWhatsappText } from '../utils/whatsappShare'
import { auditService } from '../services/auditService'  // OBS-01 FIX: persist certificate  // BUG-05 FIX

function formatDate(d) {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return String(d)
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function useAuditLogic() {
  const { state, dispatch } = useAppContext()
  const { t } = useTranslation()

  function generateCertificate(findingsOverride) {
    const { quotation, cameraType, lang } = state
    const findings = findingsOverride || state.findings
    const id  = generateCertificateId(lang)
    const now = new Date()
    const hasHDD = cameraType === 'dvr' || cameraType === 'nvr'

    const resCheck   = checkCameraResolution(quotation.cameraMP, findings.cameraResolution)
    const countCheck = checkCameraCount(quotation.cameraCount, findings.activeCameraCount)

    const checks = []

    // ── Camera resolution
    const resObs =
      resCheck.status === 'ok'
        ? t('check_camera_res_ok')
        : resCheck.status === 'attention'
          ? t('check_camera_res_attention', { quotedMP: resCheck.quotedMP, actualMP: resCheck.actualMP })
          : t('status_unverified')
    checks.push({
      id: 'camera_resolution',
      status: resCheck.status,
      name: t('check_camera_res_name'),
      observation: resObs,
      quoted:   quotation.cameraMP ? `${quotation.cameraMP} MP` : '—',
      recorded: findings.cameraResolution
        ? `${resCheck.actualMP ?? resolutionToMP(findings.cameraResolution) ?? '?'} MP (${findings.cameraResolution})`
        : '—',
    })

    if (hasHDD) {
      // ── HDD prior recordings
      const ageCheck = checkHDDAge(
        quotation.installDate,
        findings.oldestRecordingDate,
        quotation.hddIsNew
      )
      const ageObs =
        ageCheck.status === 'ok'
          ? t('check_hdd_prior_ok')
          : ageCheck.status === 'attention'
            ? t('check_hdd_prior_attention', { months: ageCheck.monthsDifference })
            : t('status_unverified')
      checks.push({
        id: 'hdd_prior_recordings',
        status: ageCheck.status,
        name: t('check_hdd_prior_name'),
        observation: ageObs,
        quoted:   quotation.hddIsNew ? t('field_hdd_new') : t('field_hdd_reused'),
        recorded: findings.oldestRecordingDate
          ? `Oldest: ${formatDate(findings.oldestRecordingDate)}`
          : '—',
        monthsDifference: ageCheck.monthsDifference,
        oldestDate: findings.oldestRecordingDate,
      })

      // ── HDD size
      const sizeCheck = checkHDDSize(quotation.hddSizeGB, findings.hddActualGB)
      const sizeObs =
        sizeCheck.status === 'ok'
          ? t('check_hdd_size_ok')
          : sizeCheck.status === 'attention'
            ? t('check_hdd_size_attention', {
                quotedGB: sizeCheck.quotedGB,
                actualGB: sizeCheck.actualGB,
              })
            : t('status_unverified')
      checks.push({
        id: 'hdd_size',
        status: sizeCheck.status,
        name: t('check_hdd_size_name'),
        observation: sizeObs,
        quoted: quotation.hddSizeGB
          ? quotation.hddSizeGB >= 1000
            ? `${quotation.hddSizeGB / 1000} TB`
            : `${quotation.hddSizeGB} GB`
          : '—',
        recorded: findings.hddActualGB ? `${findings.hddActualGB} GB` : '—',
      })
    }

    // ── Camera count
    const countObs =
      countCheck.status === 'ok'
        ? t('check_camera_count_ok', { actualCount: countCheck.actualCount, quotedCount: countCheck.quotedCount })
        : countCheck.status === 'attention'
          ? t('check_camera_count_attention', {
              quotedCount: countCheck.quotedCount,
              actualCount: countCheck.actualCount,
            })
          : t('status_unverified')
    checks.push({
      id: 'camera_count',
      status: countCheck.status,
      name: t('check_camera_count_name'),
      observation: countObs,
      quoted:   quotation.cameraCount ? String(quotation.cameraCount) : '—',
      recorded: findings.activeCameraCount != null ? String(findings.activeCameraCount) : '—',
    })

    const attentionCount  = checks.filter(c => c.status === 'attention').length
    const okCount         = checks.filter(c => c.status === 'ok').length
    const unverifiedCount = checks.filter(c => c.status === 'unverified').length

    // BUG-04 FIX: all-unverified must not return 'ok'
    // NEW-03 FIX: any unverified check means we cannot claim all items matched
    // Only return 'ok' when every single check passed — a clean sweep
    const overallStatus =
      attentionCount > 0  ? 'attention' :
      okCount === 0       ? 'unverified' :
      unverifiedCount > 0 ? 'unverified' :
      'ok'

    const overallObservation =
      overallStatus === 'ok'         ? t('overall_ok') :
      overallStatus === 'unverified' ? t('status_unverified') :
                                       t('overall_attention')

    // Build certificate — whatsappText populated after (BUG-05 FIX)
    const certificate = {
      id,
      generatedAt: now,
      lang,
      cameraType,
      installDate: quotation.installDate,
      checks,
      summary: {
        totalChecks: checks.length,
        attentionCount,
        okCount,
        unverifiedCount,
        overallStatus,
        overallObservation,
      },
      disclaimer:
        'This report is based entirely on information entered by the user. HakkiEye does not independently verify any installation. This is a personal record tool only — not a legal document.',
      pdfReady: false,
    }

    // BUG-05 FIX: populate whatsappText on the certificate itself
    certificate.whatsappText = buildWhatsappText(certificate, t)

    dispatch({ type: 'SET_CERTIFICATE', payload: certificate })
    auditService.saveCertificate(certificate)  // OBS-01 FIX: persist to localStorage
    return certificate
  }

  return { generateCertificate }
}
