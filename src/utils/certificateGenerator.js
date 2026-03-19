import { generateCertificateId } from './certificateId.js'
import { resolutionToMP } from '../services/scanService.js'

export function generateCertificate(scanResult) {
  if (!scanResult) return null

  const id = generateCertificateId()
  const now = new Date()

  // Process cameras — calculate MP, preserve dataSource
  const cameras = (scanResult.cameras || []).map(cam => ({
    ...cam,
    mp: resolutionToMP(cam.resolution),
    dataSource: cam.dataSource || 'auto',
  }))

  // Process storage
  const storage = (scanResult.storage || []).map(drive => ({
    ...drive,
    dataSource: drive.dataSource || 'auto',
  }))

  return {
    id,
    generatedAt: now,
    generatedBy: 'HakkiEye — hakki.app',
    protocol: scanResult.protocol || null,
    scanMethod: scanResult.scanMethod || 'manual',
    deviceInfo: scanResult.deviceInfo || null,
    cameras,
    storage,
    disclaimer: 'This is a factual record of data read from the device. It is not a legal document. HakkiEye does not independently verify any information.',
    // SEC: certificate never contains ip, username, or password
  }
}