import { createContext, useContext, useReducer } from 'react'

const initialState = {
  connection: {
    ip: null,
    username: null,
    password: null,
    deviceType: null,
  },
  scanResult: null,
  certificate: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CONNECTION':
      return { ...state, connection: { ...state.connection, ...action.payload } }
    case 'SET_SCAN_RESULT':
      return { ...state, scanResult: action.payload }
    case 'SET_CERTIFICATE':
      return { ...state, certificate: action.payload }
    case 'CLEAR_CREDENTIALS':
      // SEC: wipe credentials from memory before navigating to certificate
      return { ...state, connection: { ip: null, username: null, password: null, deviceType: state.connection.deviceType } }
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be inside AppProvider')
  return ctx
}
