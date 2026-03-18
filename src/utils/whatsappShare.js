export function buildWhatsappText(certificate, t) {
  if (!certificate) return ''

  const date = certificate.generatedAt
    ? new Date(certificate.generatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'

  const statusLine = (check) => {
    if (!check) return '—'
    return check.status === 'ok' ? '✅ Matches' : check.status === 'attention' ? '⚠️ Needs attention' : '❓ Could not verify'
  }

  const camResCheck = certificate.checks.find(c => c.id === 'camera_resolution')
  const hddPriorCheck = certificate.checks.find(c => c.id === 'hdd_prior_recordings')
  const hddSizeCheck = certificate.checks.find(c => c.id === 'hdd_size')
  const camCountCheck = certificate.checks.find(c => c.id === 'camera_count')

  let lines = [
    `👁 HakkiEye — Installation Record`,
    `📅 Date: ${date}`,
    `🔖 Ref: ${certificate.id}`,
    ``,
    `Camera quality: ${statusLine(camResCheck)}`,
  ]

  if (hddPriorCheck) lines.push(`HDD recordings: ${statusLine(hddPriorCheck)}`)
  if (hddSizeCheck) lines.push(`HDD size: ${statusLine(hddSizeCheck)}`)
  lines.push(`Camera count: ${statusLine(camCountCheck)}`)

  lines.push(``)
  lines.push(certificate.summary.overallStatus === 'ok'
    ? `Overall: ✅ All items match quotation`
    : `Overall: ⚠️ Some items need your attention`)

  lines.push(``)
  lines.push(`⚠️ This is a personal record based on user-entered information. Not a legal document.`)
  lines.push(`🔗 Free tool: hakki.app`)

  return lines.join('\n')
}
