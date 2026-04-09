import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function AuthGuard({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <p style={{ padding: '20px' }}>Carregando...</p>
  }

  return user ? children : <Navigate to="/login" replace />
}

export default AuthGuard