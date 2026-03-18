import { createContext, useContext, useReducer } from 'react'

const initialState = {
  lang: 'en',
  cameraType: null,
  quotation: {
    installDate: null,
    cameraCount: null,
    cameraMP: null,
    hddSizeGB: null,
    hddIsNew: true,
    nvrBrand: null,  // V3-04 FIX: matches dispatch and read sites in QuotationScreen/GuidedCheckScreen
  },
  findings: {
    cameraResolution: null,
    hddActualGB: null,
    oldestRecordingDate: null,
    activeCameraCount: null,
    cameraModel: '',
  },
  certificate: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LANG':
      return { ...state, lang: action.payload }
    case 'SET_CAMERA_TYPE':
      return { ...state, cameraType: action.payload }
    case 'SET_QUOTATION':
      return { ...state, quotation: { ...state.quotation, ...action.payload } }
    case 'SET_FINDINGS':
      return { ...state, findings: { ...state.findings, ...action.payload } }
    case 'SET_CERTIFICATE':
      return { ...state, certificate: action.payload }
    case 'RESET':
      return { ...initialState, lang: state.lang }
    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
