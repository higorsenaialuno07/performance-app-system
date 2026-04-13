import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import AuthGuard from './components/AuthGuard.jsx'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Goals from './pages/Goals'
import Activities from './pages/Activities'
import Performance from './pages/Performance'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './pages/UpdatePassword'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />

            <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/update-password" element={<UpdatePassword />} />

          <Route
            path="/profile"
            element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            }
          />

          <Route
            path="/goals"
            element={
              <AuthGuard>
                <Goals />
              </AuthGuard>
            }
          />

          <Route
            path="/activities"
            element={
              <AuthGuard>
                <Activities />
              </AuthGuard>
            }
          />

          <Route
            path="/performance"
            element={
              <AuthGuard>
                <Performance />
              </AuthGuard>
            }
          />

          <Route
            path="/reports"
            element={
              <AuthGuard>
                <Reports />
              </AuthGuard>
            }
          />

          <Route
            path="/settings"
            element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App