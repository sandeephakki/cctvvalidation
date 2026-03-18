const CERT_KEY_PREFIX = 'hakkieye_cert_'
const CERT_INDEX_KEY = 'hakkieye_cert_index'

export const auditService = {
  saveCertificate(certificate) {
    try {
      localStorage.setItem(`${CERT_KEY_PREFIX}${certificate.id}`, JSON.stringify(certificate))
      const index = JSON.parse(localStorage.getItem(CERT_INDEX_KEY) || '[]')
      if (!index.includes(certificate.id)) index.push(certificate.id)
      localStorage.setItem(CERT_INDEX_KEY, JSON.stringify(index))
      return true
    } catch { return false }
  },
  getCertificate(id) {
    try {
      const raw = localStorage.getItem(`${CERT_KEY_PREFIX}${id}`)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  },
  getAllCertificates() {
    try {
      const index = JSON.parse(localStorage.getItem(CERT_INDEX_KEY) || '[]')
      return index.map(id => this.getCertificate(id)).filter(Boolean)
    } catch { return [] }
  },
}
