import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      alert('Email ou senha inválidos')
      return
    }

    navigate('/dashboard')
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Entrar</h2>
        <p>Acesse sua conta no sistema Performance.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit" className="btn primary full">
            Entrar
          </button>
        </form>

        <span className="auth-link">
          Não tem conta? <Link to="/register">Cadastre-se</Link>
        </span>
      </div>
    </section>
  )
}

export default Login