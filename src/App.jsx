import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import LanguageScreen   from './screens/LanguageScreen'
import CameraTypeScreen from './screens/CameraTypeScreen'
import QuotationScreen  from './screens/QuotationScreen'
import GuidedCheckScreen from './screens/GuidedCheckScreen'
import ReportScreen     from './screens/ReportScreen'
import ShareScreen      from './screens/ShareScreen'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-root">
          <Routes>
            <Route path="/"              element={<LanguageScreen />}    />
            <Route path="/camera-type"   element={<CameraTypeScreen />}  />
            <Route path="/quotation"     element={<QuotationScreen />}   />
            <Route path="/guided-check"  element={<GuidedCheckScreen />} />
            <Route path="/report"        element={<ReportScreen />}      />
            <Route path="/share"         element={<ShareScreen />}       />
            <Route path="*"              element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
