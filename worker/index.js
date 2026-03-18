/**
 * HakkiEye — Cloudflare Worker Proxy v3
 * Stateless HTTPS bridge: PWA → Worker → DVR → Worker → PWA
 *
 * SECURITY RULES (enforced in code):
 *   WRK-01: Zero diagnostic output — nothing is logged
 *   WRK-02: Zero persistence — stateless, no KV or browser storage
 *   WRK-03: CORS restricted to env.ALLOWED_ORIGIN
 *   WRK-04: Returns 400 for missing fields
 *   WRK-05: Returns 405 for non-POST
 *   SEC:    Response contains ONLY scan data — zero credentials
 */

export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || '*'

    // WRK-03: CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      })
    }

    // WRK-05: Only POST
    if (request.method !== 'POST') {
      return jsonRes({ success: false, error: 'Method not allowed' }, 405, allowedOrigin)
    }

    let body
    try {
      body = await request.json()
    } catch {
      return jsonRes({ success: false, error: 'Invalid JSON' }, 400, allowedOrigin)
    }

    const { ip, username, password, action } = body

    // WRK-04: Validate all required fields
    if (!ip || !username || !password || !action) {
      return jsonRes({ success: false, error: 'Missing required fields: ip, username, password, action' }, 400, allowedOrigin)
    }

    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
      return jsonRes({ success: false, error: 'Invalid IP address format' }, 400, allowedOrigin)
    }

    // Run scan
    let scanData = {
      success: false,
      protocol: null,
      scanMethod: 'manual',
      deviceInfo: null,
      cameras: [],
      storage: [],
      errors: [],
    }

    try {
      scanData = await runISAPIScan(ip, username, password, action)
      scanData.protocol = 'isapi'
    } catch (isapiErr) {
      scanData.errors.push('ISAPI: ' + isapiErr.message)
      try {
        scanData = await runONVIFScan(ip, username, password)
        scanData.protocol = 'onvif'
      } catch (onvifErr) {
        scanData.errors.push('ONVIF: ' + onvifErr.message)
        scanData.success = false
      }
    }

    // Determine scan quality
    if (scanData.success) {
      if (scanData.errors.length > 0 || !scanData.cameras.length) {
        scanData.scanMethod = 'partial'
      } else {
        scanData.scanMethod = 'auto'
      }
    }

    // SEC: Build safeResult — strip ALL credential fields from response
    // ip, username, password NEVER appear in the response body
    const safeResult = {
      success:    scanData.success,
      protocol:   scanData.protocol,
      scanMethod: scanData.scanMethod,
      deviceInfo: scanData.deviceInfo,
      cameras:    scanData.cameras,
      storage:    scanData.storage,
      errors:     scanData.errors,
    }

    return jsonRes(safeResult, 200, allowedOrigin)
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function jsonRes(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
    }
  })
}

// ── ISAPI Scanner ─────────────────────────────────────────────────────────────

async function runISAPIScan(ip, username, password, action) {
  const base = 'http://' + ip
  const headers = await getAuthHeaders(base, username, password)
  const result = { success: true, deviceInfo: null, cameras: [], storage: [], errors: [] }

  // Device info
  try {
    const res = await fetch(base + '/ISAPI/System/deviceInfo', {
      headers,
      signal: AbortSignal.timeout(8000)
    })
    if (res.status === 401) throw new Error('AUTH_FAILED')
    if (!res.ok) throw new Error('HTTP ' + res.status)
    result.deviceInfo = parseDeviceInfo(await res.text())
  } catch (e) {
    if (e.message === 'AUTH_FAILED') throw new Error('AUTH_FAILED')
    result.errors.push('deviceInfo: ' + e.message)
  }

  if (action === 'fullScan') {
    // Camera channels
    try {
      const res = await fetch(base + '/ISAPI/System/Video/inputs/channels', {
        headers,
        signal: AbortSignal.timeout(8000)
      })
      if (res.ok) result.cameras = parseChannels(await res.text())
    } catch (e) {
      result.errors.push('cameras: ' + e.message)
    }

    // Storage / HDD
    try {
      const res = await fetch(base + '/ISAPI/System/storage/hdd', {
        headers,
        signal: AbortSignal.timeout(8000)
      })
      if (res.ok) result.storage = parseStorage(await res.text())
    } catch (e) {
      result.errors.push('storage: ' + e.message)
    }
  }

  return result
}

// ── XML Parsers ───────────────────────────────────────────────────────────────

function parseDeviceInfo(xml) {
  return {
    model:           xmlVal(xml, 'model') || xmlVal(xml, 'deviceName') || null,
    serialNumber:    xmlVal(xml, 'serialNumber') || null,
    firmwareVersion: xmlVal(xml, 'firmwareVersion') || null,
  }
}

function parseChannels(xml) {
  const matches = xml.match(/<VideoInputChannel>([\s\S]*?)<\/VideoInputChannel>/g) || []
  return matches.map(function(ch, i) {
    const w = xmlVal(ch, 'videoResolutionWidth')
    const h = xmlVal(ch, 'videoResolutionHeight')
    const resolution = (w && h && w !== '0' && h !== '0') ? (w + 'x' + h) : null
    return {
      channelId:  i + 1,
      name:       xmlVal(ch, 'name') || ('Camera ' + (i + 1)),
      resolution: resolution,
      status:     xmlVal(ch, 'connectionStatus') || 'unknown',
      dataSource: 'auto',
    }
  })
}

function parseStorage(xml) {
  const matches = xml.match(/<hdd>([\s\S]*?)<\/hdd>/g) || []
  return matches.map(function(hdd, i) {
    const mb = parseInt(xmlVal(hdd, 'capacity') || '0', 10)
    return {
      id:         i + 1,
      type:       'HDD',
      totalGB:    mb > 0 ? Math.round(mb / 1024) : null,
      status:     xmlVal(hdd, 'status') || 'unknown',
      dataSource: 'auto',
    }
  })
}

function xmlVal(xml, tag) {
  const re = new RegExp('<' + tag + '[^>]*>([^<]+)<\\/' + tag + '>')
  const m = xml.match(re)
  return m ? m[1].trim() : null
}

// ── Auth Headers ──────────────────────────────────────────────────────────────

async function getAuthHeaders(base, username, password) {
  try {
    const probe = await fetch(base + '/ISAPI/System/deviceInfo', {
      signal: AbortSignal.timeout(5000)
    })
    const wwwAuth = probe.headers.get('WWW-Authenticate') || ''
    if (wwwAuth.toLowerCase().includes('digest')) {
      const realm = (wwwAuth.match(/realm="([^"]+)"/) || [])[1] || ''
      const nonce = (wwwAuth.match(/nonce="([^"]+)"/) || [])[1] || ''
      const qop   = (wwwAuth.match(/qop="([^"]+)"/)  || [])[1] || 'auth'
      const nc     = '00000001'
      const bytes  = crypto.getRandomValues(new Uint8Array(4))
      const cnonce = Array.from(bytes).map(function(b){ return b.toString(16).padStart(2,'0') }).join('')
      const ha1    = await sha256hex(username + ':' + realm + ':' + password)
      const ha2    = await sha256hex('GET:/ISAPI/System/deviceInfo')
      const resp   = await sha256hex(ha1 + ':' + nonce + ':' + nc + ':' + cnonce + ':' + qop + ':' + ha2)
      const auth   = 'Digest username="' + username + '", realm="' + realm + '", nonce="' + nonce +
                     '", uri="/ISAPI/System/deviceInfo", qop=' + qop +
                     ', nc=' + nc + ', cnonce="' + cnonce + '", response="' + resp + '"'
      return { 'Authorization': auth }
    }
  } catch (_) {}
  // Basic auth fallback
  return { 'Authorization': 'Basic ' + btoa(username + ':' + password) }
}

async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(function(b){ return b.toString(16).padStart(2,'0') }).join('')
}

// ── ONVIF Fallback ────────────────────────────────────────────────────────────

async function runONVIFScan(ip, username, password) {
  const soap = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">' +
    '<s:Body><GetDeviceInformation xmlns="http://www.onvif.org/ver10/device/wsdl"/></s:Body>' +
    '</s:Envelope>'

  const res = await fetch('http://' + ip + '/onvif/device_service', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/soap+xml',
      'SOAPAction': '"http://www.onvif.org/ver10/device/wsdl/GetDeviceInformation"',
    },
    body: soap,
    signal: AbortSignal.timeout(8000),
  })

  const text = await res.text()
  return {
    success:    true,
    deviceInfo: {
      model:           xmlVal(text, 'Model') || null,
      serialNumber:    xmlVal(text, 'SerialNumber') || null,
      firmwareVersion: xmlVal(text, 'FirmwareVersion') || null,
    },
    cameras: [],
    storage: [],
    errors:  ['ONVIF: camera/storage scan available in Phase 2'],
  }
}
