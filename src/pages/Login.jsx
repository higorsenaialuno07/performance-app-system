import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email, password)
      alert('Login realizado com sucesso!')
      navigate('/')
    } catch (error) {
      console.error(error)
      alert(error.message || 'Email ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page">
      <div className="auth-card">
        <h1>Entrar</h1>
        <p>Acesse sua conta no sistema Performance.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p>
          Não tem conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </section>
  )
}