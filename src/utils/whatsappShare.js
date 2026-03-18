import { resolutionToMP } from '../services/scanService.js'

function fmtDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function buildWhatsappText(certificate) {
  if (!certificate) return ''
  const { id, generatedAt, deviceInfo, cameras, storage, disclaimer } = certificate

  const lines = [
    '👁 HakkiEye — Installation Scan Certificate',
    `🔖 ${id}`,
    `📅 ${fmtDate(generatedAt)}`,
    '',
  ]

  if (deviceInfo?.model || deviceInfo?.serialNumber) {
    lines.push(`Device: ${deviceInfo.model || 'Unknown'}`)
    if (deviceInfo.serialNumber) lines.push(`Serial: ${deviceInfo.serialNumber}`)
    lines.push('')
  }

  if (cameras?.length) {
    lines.push('Cameras:')
    cameras.forEach(cam => {
      const mp = cam.mp || resolutionToMP(cam.resolution)
      const res = cam.resolution ? `${cam.resolution}${mp ? ` (${mp}MP)` : ''}` : 'Could not read'
      lines.push(`  CH${cam.channelId} — ${cam.name}: ${res}`)
    })
    lines.push('')
  }

  if (storage?.length) {
    lines.push('Storage:')
    storage.forEach(d => {
      lines.push(`  ${d.type}: ${d.totalGB != null ? `${d.totalGB} GB` : 'Could not read'}`)
    })
    lines.push('')
  }

  // Truncate gracefully for WhatsApp 4096 char limit
  const textSoFar = lines.join('\n')
  const footer = `⚠️ This is a factual record from the device. Not a legal document.\n🔗 Free scan tool: hakki.app`
  const full = textSoFar + footer

  if (full.length > 4000) {
    return textSoFar.slice(0, 3900) + '...\n\n' + footer
  }
  return full
}