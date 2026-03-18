const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'https://hakkieye-proxy.workers.dev'

export async function testConnection(ip, username, password) {
  // Action: deviceInfo only — quick connectivity test
  const result = await callWorker({ ip, username, password, action: 'deviceInfo' })
  return result
}

export async function runFullScan(ip, username, password, onProgress) {
  onProgress?.(1, 3)  // Step 1: starting
  const result = await callWorker({ ip, username, password, action: 'fullScan' })
  onProgress?.(2, 3)  // Step 2: cameras
  onProgress?.(3, 3)  // Step 3: storage
  return result
}

async function callWorker(payload) {
  // SEC: credentials sent to worker only, never to localStorage, never logged
  let res
  try {
    res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    })
  } catch (e) {
    if (e.name === 'TimeoutError') {
      return { success: false, error: 'TIMEOUT', errors: ['Request timed out'] }
    }
    return { success: false, error: 'NETWORK', errors: [e.message] }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return { success: false, error: `HTTP_${res.status}`, errors: [text] }
  }

  const data = await res.json()

  // Classify error type for plain-language messages
  if (!data.success) {
    const errStr = (data.errors || []).join(' ').toLowerCase()
    if (errStr.includes('auth_failed') || errStr.includes('401')) {
      data.errorType = 'AUTH_FAILED'
    } else if (errStr.includes('timeout') || errStr.includes('timed out')) {
      data.errorType = 'TIMEOUT'
    } else {
      data.errorType = 'UNREACHABLE'
    }
  }

  return data
}

export function resolutionToMP(resolutionString) {
  if (!resolutionString) return null
  const match = resolutionString.match(/(\d+)\s*[xX×]\s*(\d+)/i)
  if (!match) return null
  const w = parseInt(match[1], 10)
  const h = parseInt(match[2], 10)
  if (!w || !h || w === 0 || h === 0) return null
  return Math.round((w * h) / 1_000_000 * 100) / 100
}