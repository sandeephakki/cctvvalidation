export function generateCertificateId(lang) {
  const stateMap = { kn:'KA', hi:'IN', mr:'MH', ta:'TN', te:'AP', gu:'GJ', pa:'PB', bn:'WB', en:'IN' }
  const year = new Date().getFullYear()
  const state = stateMap[lang] || 'IN'
  const suffix = Date.now().toString(36).slice(-5).toUpperCase()
  return `HE-${year}-${state}-${suffix}`
}
