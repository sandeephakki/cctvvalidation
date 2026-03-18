export const notificationService = {
  async requestPermission() {
    if (!('Notification' in window)) return false
    const perm = await Notification.requestPermission()
    return perm === 'granted'
  },
  async scheduleReminder() {
    // TODO Phase 2: Push notifications via service worker + backend
    console.log('[notificationService] Push reminders coming in Phase 2')
    return false
  },
}
