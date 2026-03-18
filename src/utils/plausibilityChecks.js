// Plausibility checks — warn user before saving, never block
export function checkResolutionPlausibility(resolutionStr) {
  if (!resolutionStr) return null
  const match = resolutionStr.replace('×','x').match(/(\d+)x(\d+)/i)
  if (!match) return 'Format should be like 1920×1080'
  const mp = (parseInt(match[1]) * parseInt(match[2])) / 1_000_000
  if (mp < 0.5) return 'This resolution seems very low — are you sure?'
  if (mp > 20)  return 'This resolution seems very high — are you sure?'
  return null
}
export function checkCameraCountPlausibility(count) {
  const n = parseInt(count, 10)
  if (isNaN(n)) return null
  if (n > 16) return 'More than 16 cameras is unusual — please double-check.'
  return null
}
export function checkHDDPlausibility(gb) {
  const n = parseInt(gb, 10)
  if (isNaN(n)) return null
  if (n < 50)   return 'This seems very small for an HDD — are you sure?'
  if (n > 8000) return 'This seems very large — please double-check.'
  return null
}
