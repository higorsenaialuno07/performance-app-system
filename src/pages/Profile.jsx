import { useAuth } from '../contexts/AuthContext'

function Profile() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <p style={{ padding: '20px' }}>Carregando...</p>
  }

  return (
    <section className="page">
      <div className="profile-card">
        <div className="profile-avatar">
          {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>

        <h2>{profile?.name || 'Usuário sem nome'}</h2>
        <p><strong>Email:</strong> {profile?.email || user?.email}</p>
        <p><strong>Telefone:</strong> {profile?.phone || 'Não informado'}</p>
        <p><strong>Perfil:</strong> {profile?.role || 'user'}</p>
        <p><strong>Bio:</strong> {profile?.bio || 'Nenhuma bio cadastrada.'}</p>
      </div>
    </section>
  )
}

export default Profile