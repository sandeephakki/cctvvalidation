export function generateCertificateId() {
  const year = new Date().getFullYear()
  const suffix = Date.now().toString(36).slice(-5).toUpperCase()
  return `HE-${year}-${suffix}`
}