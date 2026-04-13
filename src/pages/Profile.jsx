import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'

function Profile() {
  const { user, profile, loading } = useAuth()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [role, setRole] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setPhone(profile.phone || '')
      setBio(profile.bio || '')
      setRole(profile.role || 'user')
    }
  }, [profile])

  const handleSave = async (e) => {
    e.preventDefault()

    if (!user) {
      alert('Usuário não encontrado.')
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        phone,
        bio,
        role,
      })
      .eq('id', user.id)

    setSaving(false)

    if (error) {
      console.log('Erro ao atualizar perfil:', error)
      alert(error.message)
      return
    }

    alert('Perfil atualizado com sucesso!')
    window.location.reload()
  }

  if (loading) {
    return <p style={{ padding: '20px' }}>Carregando...</p>
  }

  return (
    <section className="page page-column">
      <div className="section-header">
        <h1>Perfil</h1>
        <p>Gerencie seus dados pessoais no sistema Performance.</p>
      </div>

      <div className="profile-layout">
        <div className="profile-card profile-summary-card">
          <div className="profile-avatar">
            {name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <h2>{name || 'Usuário'}</h2>
          <p><strong>Email:</strong> {profile?.email || user?.email}</p>
          <p><strong>Telefone:</strong> {phone || 'Não informado'}</p>
          <p><strong>Perfil:</strong> {role || 'user'}</p>
          <p><strong>Bio:</strong> {bio || 'Nenhuma bio cadastrada.'}</p>
        </div>

        <div className="form-card profile-edit-card">
          <h2>Editar Perfil</h2>

          <form onSubmit={handleSave} className="auth-form profile-form">
            <div className="input-group">
  <label className="form-label">Nome</label>
  <input
    type="text"
    placeholder="Digite seu nome"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
</div>
            <input
              type="text"
              placeholder="Seu telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              type="text"
              placeholder="Cargo ou perfil"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />

            <textarea
              placeholder="Sua bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="5"
            />

            <button type="submit" className="btn primary full" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Profile