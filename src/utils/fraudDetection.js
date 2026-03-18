// Pure comparison functions — no side effects, fully testable
// Status: 'ok' | 'attention' | 'unverified' — NEVER 'fraud'

export const UNVERIFIED = { status: 'unverified', observation: 'Could not verify' }

export function resolutionToMP(str) {
  if (!str || typeof str !== 'string') return null
  const normalized = str.trim().replace(/[×X]/g, 'x')
  const match = normalized.match(/(\d+)\s*x\s*(\d+)/i)
  if (!match) return null
  const w = parseInt(match[1], 10)
  const h = parseInt(match[2], 10)
  if (!w || !h) return null
  return parseFloat(((w * h) / 1_000_000).toFixed(2))
}

export function checkCameraResolution(quotedMP, actualResolutionString) {
  if (quotedMP == null || !actualResolutionString) return { ...UNVERIFIED }
  const actualMP = resolutionToMP(actualResolutionString)
  if (actualMP == null) return { ...UNVERIFIED }
  const qMP = parseFloat(quotedMP)
  if (isNaN(qMP) || qMP <= 0) return { ...UNVERIFIED }
  // 15% tolerance: accept down to 85% of quoted MP
  // BUG-01 note: threshold = qMP * 0.85 is correct per spec.
  // Test plan CAM-07 conflict documented — product owner to align test plan.
  const threshold = qMP * 0.85
  if (actualMP >= threshold) {
    return { status: 'ok', quotedMP: qMP, actualMP, observation: 'ok' }
  }
  return { status: 'attention', quotedMP: qMP, actualMP, observation: 'attention' }
}

const HDD_TOLERANCE = {
  500:  { low: 450,  high: 520  },
  1000: { low: 900,  high: 1050 },
  2000: { low: 1800, high: 2100 },
  4000: { low: 3600, high: 4200 },
}

export function checkHDDSize(quotedGB, actualGB) {
  if (quotedGB == null || actualGB == null) return { ...UNVERIFIED }
  const q = parseFloat(quotedGB)
  const a = parseFloat(actualGB)
  if (isNaN(q) || isNaN(a)) return { ...UNVERIFIED }
  const buckets = Object.keys(HDD_TOLERANCE).map(Number)
  const nearest = buckets.reduce((prev, curr) =>
    Math.abs(curr - q) < Math.abs(prev - q) ? curr : prev, buckets[0])
  const { low } = HDD_TOLERANCE[nearest]
  if (a >= low) {
    return { status: 'ok', quotedGB: q, actualGB: a, observation: 'ok' }
  }
  return { status: 'attention', quotedGB: q, actualGB: a, observation: 'attention' }
}

export function checkHDDAge(installDate, oldestRecordingDate, hddIsNew) {
  if (hddIsNew === false) {
    return { status: 'ok', monthsDifference: 0, observation: 'HDD was declared as reused' }
  }
  if (!installDate || !oldestRecordingDate) return { ...UNVERIFIED }
  const install = new Date(installDate)
  const oldest  = new Date(oldestRecordingDate)
  if (isNaN(install.getTime()) || isNaN(oldest.getTime())) return { ...UNVERIFIED }
  // BUG-02 FIX: use <= so that exactly-1-day-before triggers 'attention'
  // Tolerance = 1 day (86400000ms): recordings on install day or after → ok
  const toleranceMs = 24 * 60 * 60 * 1000
  if (oldest.getTime() <= install.getTime() - toleranceMs) {
    const months = Math.round(
      (install.getTime() - oldest.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    )
    return { status: 'attention', monthsDifference: months, observation: 'attention' }
  }
  return { status: 'ok', monthsDifference: 0, observation: 'ok' }
}

export function checkCameraCount(quotedCount, actualCount) {
  if (quotedCount == null || actualCount == null) return { ...UNVERIFIED }
  const q = parseInt(quotedCount, 10)
  const a = parseInt(actualCount, 10)
  if (isNaN(q) || isNaN(a)) return { ...UNVERIFIED }
  // BUG-03 FIX: 0 cameras is not a valid installation
  if (q <= 0 || a < 0) return { ...UNVERIFIED }
  if (a >= q) {
    return { status: 'ok', quotedCount: q, actualCount: a, observation: 'ok' }
  }
  return { status: 'attention', quotedCount: q, actualCount: a, observation: 'attention' }
}
