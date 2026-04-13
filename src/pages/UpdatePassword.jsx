import { useState } from 'react'
import { supabase } from '../services/supabase'

function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpdatePassword = async (e) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      alert('Preencha todos os campos')
      return
    }

    if (password !== confirmPassword) {
      alert('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres')
      return
    }

    try {
      setLoading(true)

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        alert('Erro ao redefinir senha: ' + error.message)
        return
      }

      alert('Senha redefinida com sucesso!')
      setPassword('')
      setConfirmPassword('')
      window.location.href = '/login'
    } catch (err) {
      console.log(err)
      alert('Erro inesperado ao redefinir senha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page page-column">
      <div className="form-card" style={{ maxWidth: '500px', margin: '80px auto' }}>
        <h2>Nova Senha</h2>
        <p>Digite sua nova senha abaixo.</p>

        <form onSubmit={handleUpdatePassword} className="auth-form">
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" className="btn primary full" disabled={loading}>
            {loading ? 'Salvando...' : 'Redefinir senha'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default UpdatePassword