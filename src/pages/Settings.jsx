import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'

function Settings() {
  const { user, signOut } = useAuth()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (!newPassword || !confirmPassword) {
      alert('Preencha todos os campos')
      return
    }

    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    setLoading(false)

    if (error) {
      alert('Erro ao alterar senha')
      return
    }

    alert('Senha alterada com sucesso!')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.'
    )

    if (!confirmDelete) return

    alert('Para excluir conta completamente, precisa fazer via backend (segurança)')
  }

  return (
    <section className="page page-column">
      <div className="section-header">
        <h1>Configurações</h1>
        <p>Gerencie sua conta e preferências do sistema.</p>
      </div>

      <div className="settings-layout">
        {/* ALTERAR SENHA */}
        <div className="form-card">
          <h2>Alterar Senha</h2>

          <form onSubmit={handleChangePassword} className="auth-form">
            <input
              type="password"
              placeholder="Nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirmar nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button className="btn primary full" disabled={loading}>
              {loading ? 'Salvando...' : 'Alterar Senha'}
            </button>
          </form>
        </div>

        {/* CONTA */}
        <div className="form-card">
          <h2>Conta</h2>

          <div className="settings-actions">
            <button className="btn secondary full" onClick={signOut}>
              Sair da Conta
            </button>

            <button className="btn logout full" onClick={handleDeleteAccount}>
              Excluir Conta
            </button>
          </div>
        </div>

        {/* PREFERÊNCIAS */}
        <div className="form-card">
          <h2>Preferências</h2>

          <div className="settings-options">
            <label>
              <input type="checkbox" /> Ativar notificações
            </label>

            <label>
              <input type="checkbox" /> Tema escuro
            </label>

            <label>
              <input type="checkbox" /> Perfil público
            </label>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Settings 