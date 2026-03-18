import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import ConnectScreen     from './screens/ConnectScreen'
import ScanningScreen    from './screens/ScanningScreen'
import ResultsScreen     from './screens/ResultsScreen'
import CertificateScreen from './screens/CertificateScreen'
import ShareScreen       from './screens/ShareScreen'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-root">
          <Routes>
            <Route path="/"            element={<ConnectScreen />}     />
            <Route path="/scanning"    element={<ScanningScreen />}    />
            <Route path="/results"     element={<ResultsScreen />}     />
            <Route path="/certificate" element={<CertificateScreen />} />
            <Route path="/share"       element={<ShareScreen />}       />
            <Route path="*"            element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
