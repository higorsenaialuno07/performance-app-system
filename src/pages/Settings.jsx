import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'

function Settings() {
  const { user, signOut } = useAuth()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const [notifications, setNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [publicProfile, setPublicProfile] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('notifications, dark_mode, public_profile')
        .eq('id', user.id)
        .single()

      if (error) {
        console.log('Erro ao carregar preferências:', error)
        return
      }

      if (data) {
        setNotifications(data.notifications || false)
        setDarkMode(data.dark_mode || false)
        setPublicProfile(data.public_profile || false)
      }
    }

    fetchProfile()
  }, [user])

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

    if (newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      console.log('SESSION:', session)
      console.log('SESSION ERROR:', sessionError)

      if (sessionError || !session) {
        alert('Sessão não encontrada. Faça login novamente.')
        return
      }

      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Tempo esgotado ao alterar senha')), 10000)
      )

      const request = supabase.auth.updateUser({
        password: newPassword,
      })

      const result = await Promise.race([request, timeout])

      console.log('RESULTADO UPDATE:', result)

      if (result.error) {
        alert('Erro ao alterar senha: ' + result.error.message)
        return
      }

      alert('Senha alterada com sucesso!')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.log('ERRO:', err)
      alert(err.message || 'Erro inesperado ao alterar senha')
    } finally {
      setLoading(false)
    }
  }

  const handleSavePreferences = async () => {
    if (!user) {
      alert('Usuário não encontrado')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        notifications,
        dark_mode: darkMode,
        public_profile: publicProfile,
      })
      .eq('id', user.id)

    if (error) {
      console.log('Erro ao salvar preferências:', error)
      alert('Erro ao salvar preferências')
      return
    }

    alert('Preferências salvas com sucesso!')
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

            <button type="submit" className="btn primary full" disabled={loading}>
              {loading ? 'Salvando...' : 'Alterar Senha'}
            </button>
          </form>
        </div>

        <div className="form-card">
          <h2>Conta</h2>

          <div className="settings-actions">
            <button type="button" className="btn secondary full" onClick={signOut}>
              Sair da Conta
            </button>

            <button type="button" className="btn logout full" onClick={handleDeleteAccount}>
              Excluir Conta
            </button>
          </div>
        </div>

        <div className="form-card">
          <h2>Preferências</h2>

          <div className="settings-options">
            <label>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              Ativar notificações
            </label>

            <label>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              Tema escuro
            </label>

            <label>
              <input
                type="checkbox"
                checked={publicProfile}
                onChange={(e) => setPublicProfile(e.target.checked)}
              />
              Perfil público
            </label>
          </div>

          <button
            type="button"
            className="btn primary full"
            onClick={handleSavePreferences}
            style={{ marginTop: '16px' }}
          >
            Salvar Preferências
          </button>
        </div>
      </div>
    </section>
  )
}

export default Settings