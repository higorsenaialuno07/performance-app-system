import { useAuth } from '../contexts/AuthContext'

function Dashboard() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <p style={{ padding: '20px' }}>Carregando...</p>
  }

  return (
    <section className="page">
      <div className="dashboard-wrapper">
        <h1 className="dashboard-title">Dashboard</h1>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Usuário</h3>
            <p>{profile?.name || 'Não encontrado'}</p>
          </div>

          <div className="dashboard-card">
            <h3>Email</h3>
            <p>{profile?.email || user?.email || 'Não encontrado'}</p>
          </div>

          <div className="dashboard-card">
            <h3>Tipo de Conta</h3>
            <p>{profile?.role || 'user'}</p>
          </div>

          <div className="dashboard-card">
            <h3>Status</h3>
            <p>Sistema online</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard