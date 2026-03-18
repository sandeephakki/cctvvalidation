import { jsPDF } from 'jspdf'

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function statusLabel(status) {
  if (status === 'ok') return 'Matches'
  if (status === 'attention') return 'Needs Attention'
  return 'Could Not Verify'
}

export function generatePDF(certificate) {
  if (!certificate) return
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210
  const margin = 18
  const contentW = W - margin * 2
  let y = 0

  // ── Header bar
  doc.setFillColor(24, 119, 200)
  doc.rect(0, 0, W, 28, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('HakkiEye', margin, 12)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Installation Certificate', margin, 20)
  y = 38

  // ── Certificate meta
  doc.setTextColor(26, 25, 23)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Certificate ID', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text(certificate.id, margin + 36, y)
  y += 6
  doc.setFont('helvetica', 'bold')
  doc.text('Date', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text(formatDate(certificate.generatedAt), margin + 36, y)
  y += 6
  doc.setFont('helvetica', 'bold')
  doc.text('Camera Type', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text((certificate.cameraType || '').toUpperCase(), margin + 36, y)
  y += 6
  if (certificate.installDate) {
    doc.setFont('helvetica', 'bold')
    doc.text('Install Date', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(formatDate(certificate.installDate), margin + 36, y)
    y += 6
  }
  y += 4

  // ── Overall status box
  // V3-01 FIX: 3-state overall box — ok=green, unverified=grey, attention=amber
  const status       = certificate.summary?.overallStatus
  const isOk         = status === 'ok'
  const isUnverified = status === 'unverified'
  // Fill colours: green / grey / amber
  doc.setFillColor(
    isOk ? 225 : isUnverified ? 241 : 250,
    isOk ? 245 : isUnverified ? 239 : 238,
    isOk ? 238 : isUnverified ? 232 : 218
  )
  // Border colours: green / grey / amber
  doc.setDrawColor(
    isOk ? 29  : isUnverified ? 107 : 186,
    isOk ? 158 : isUnverified ? 104 : 117,
    isOk ? 117 : isUnverified ? 96  : 23
  )
  doc.roundedRect(margin, y, contentW, 14, 3, 3, 'FD')
  // Text colour: green / grey / amber
  doc.setTextColor(
    isOk ? 29  : isUnverified ? 107 : 186,
    isOk ? 158 : isUnverified ? 104 : 117,
    isOk ? 117 : isUnverified ? 96  : 23
  )
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  const overallText = certificate.summary?.overallObservation || ''
  doc.text(overallText, W / 2, y + 9, { align: 'center' })
  y += 22

  // ── Findings table header
  doc.setFillColor(241, 239, 232)
  doc.rect(margin, y, contentW, 8, 'F')
  doc.setTextColor(26, 25, 23)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  const col = [margin, margin + 52, margin + 104, margin + 148]
  doc.text('Item', col[0] + 2, y + 5.5)
  doc.text('Quoted', col[1], y + 5.5)
  doc.text('Recorded', col[2], y + 5.5)
  doc.text('Status', col[3], y + 5.5)
  y += 10

  // ── Findings rows
  doc.setFont('helvetica', 'normal')
  certificate.checks?.forEach((check, i) => {
    const rowH = 10
    if (i % 2 === 0) {
      doc.setFillColor(249, 248, 245)
      doc.rect(margin, y, contentW, rowH, 'F')
    }
    doc.setTextColor(26, 25, 23)
    doc.setFontSize(8)
    const nameLines = doc.splitTextToSize(check.name, 48)
    doc.text(nameLines, col[0] + 2, y + 4)
    doc.text(doc.splitTextToSize(check.quoted || '—', 48), col[1], y + 4)
    doc.text(doc.splitTextToSize(check.recorded || '—', 40), col[2], y + 4)

    const s = check.status
    doc.setTextColor(s === 'ok' ? 29 : s === 'attention' ? 186 : 107,
                     s === 'ok' ? 158 : s === 'attention' ? 117 : 104,
                     s === 'ok' ? 117 : s === 'attention' ? 23  : 96)
    doc.setFont('helvetica', 'bold')
    doc.text(statusLabel(s), col[3], y + 4)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(26, 25, 23)
    y += rowH
  })
  y += 8

  // ── HDD prior recordings alert (if applicable)
  const hddCheck = certificate.checks?.find(c => c.id === 'hdd_prior_recordings')
  if (hddCheck?.status === 'attention') {
    doc.setFillColor(250, 238, 218)
    doc.setDrawColor(186, 117, 23)
    doc.roundedRect(margin, y, contentW, 22, 3, 3, 'FD')
    doc.setTextColor(186, 117, 23)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('HDD Prior Recordings Alert', margin + 4, y + 7)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    const alertText = `Recordings were found before the installation date. ${hddCheck.monthsDifference || '?'} months of prior recordings detected. Please discuss with your vendor.`
    const alertLines = doc.splitTextToSize(alertText, contentW - 8)
    doc.text(alertLines, margin + 4, y + 14)
    y += 28
  }

  // ── Observations
  doc.setTextColor(26, 25, 23)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Detailed Observations', margin, y)
  y += 6
  certificate.checks?.forEach(check => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text(`• ${check.name}:`, margin, y)
    doc.setFont('helvetica', 'normal')
    const obsLines = doc.splitTextToSize(check.observation, contentW - 6)
    doc.text(obsLines, margin + 4, y + 5)
    y += 5 + obsLines.length * 4 + 2
  })
  y += 6

  // ── Disclaimer box
  doc.setFillColor(245, 244, 241)
  doc.setDrawColor(200, 196, 188)
  doc.roundedRect(margin, y, contentW, 22, 3, 3, 'FD')
  doc.setTextColor(107, 104, 96)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('Disclaimer', margin + 4, y + 7)
  doc.setFont('helvetica', 'normal')
  const discLines = doc.splitTextToSize(certificate.disclaimer, contentW - 8)
  doc.text(discLines, margin + 4, y + 13)
  y += 28

  // ── Footer
  const pageH = 297
  doc.setFillColor(24, 119, 200)
  doc.rect(0, pageH - 14, W, 14, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.text('Generated by HakkiEye — hakki.app | Free, open source, no data collected', W / 2, pageH - 5, { align: 'center' })
  doc.setFontSize(7)
  doc.text('Report generated in English. Full language support coming in Phase 2.', W / 2, pageH - 1.5, { align: 'center' })

  doc.save(`HakkiEye-${certificate.id}.pdf`)
}
