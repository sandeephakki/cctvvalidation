import { useAppContext } from '../context/AppContext.jsx'
import strings from '../i18n/strings.js'

export function useTranslation() {
  const { state } = useAppContext()
  const lang = state.lang || 'en'
  const dict = strings[lang] || strings['en']

  function t(key, vars = {}) {
    let str = dict[key] ?? strings['en'][key] ?? key
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replaceAll(`{${k}}`, v ?? '')
    })
    return str
  }

  return { t, lang }
}
