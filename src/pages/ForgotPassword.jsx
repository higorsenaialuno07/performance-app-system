import { useState } from 'react'
import { supabase } from '../services/supabase'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (!email) {
      alert('Digite seu e-mail')
      return
    }

    try {
      setLoading(true)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/update-password',
      })

      if (error) {
        alert('Erro ao enviar email: ' + error.message)
        return
      }

      alert('Email de recuperação enviado com sucesso!')
      setEmail('')
    } catch (err) {
      console.log(err)
      alert('Erro inesperado ao enviar recuperação de senha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page page-column">
      <div className="form-card" style={{ maxWidth: '500px', margin: '80px auto' }}>
        <h2>Recuperar Senha</h2>
        <p>Digite seu e-mail para receber o link de recuperação.</p>

        <form onSubmit={handleResetPassword} className="auth-form">
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="btn primary full" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default ForgotPassword