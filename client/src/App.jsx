import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ResumeBuilder from './pages/tools/ResumeBuilder.jsx'
import MockInterview from './pages/tools/MockInterview.jsx'
import BusinessIdeaAnalyzer from './pages/tools/BusinessIdeaAnalyzer.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tools/resume"
        element={
          <ProtectedRoute>
            <ResumeBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tools/interview"
        element={
          <ProtectedRoute>
            <MockInterview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tools/business-idea"
        element={
          <ProtectedRoute>
            <BusinessIdeaAnalyzer />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
