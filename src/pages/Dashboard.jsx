import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'

function Dashboard() {
  const { user, profile, loading } = useAuth()

  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    totalActivities: 0,
    completedActivities: 0,
    totalPerformanceRecords: 0,
    averageScore: 0,
  })

  const [dashboardLoading, setDashboardLoading] = useState(true)

  const fetchDashboardData = async () => {
    if (!user) return

    setDashboardLoading(true)

    const { data: goalsData, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)

    const { data: activitiesData, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)

    const { data: performanceData, error: performanceError } = await supabase
      .from('performance_records')
      .select('*')
      .eq('user_id', user.id)

    if (goalsError || activitiesError || performanceError) {
      alert('Erro ao carregar dados da dashboard')
      setDashboardLoading(false)
      return
    }

    const totalGoals = goalsData?.length || 0
    const completedGoals =
      goalsData?.filter((goal) => goal.status === 'concluída').length || 0

    const totalActivities = activitiesData?.length || 0
    const completedActivities =
      activitiesData?.filter((activity) => activity.status === 'concluída').length || 0

    const totalPerformanceRecords = performanceData?.length || 0
    const totalScore =
      performanceData?.reduce((acc, item) => acc + (Number(item.score) || 0), 0) || 0

    const averageScore =
      totalPerformanceRecords > 0
        ? (totalScore / totalPerformanceRecords).toFixed(1)
        : 0

    setStats({
      totalGoals,
      completedGoals,
      totalActivities,
      completedActivities,
      totalPerformanceRecords,
      averageScore,
    })

    setDashboardLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  if (loading || dashboardLoading) {
    return <p style={{ padding: '20px' }}>Carregando dashboard...</p>
  }

  return (
    <section className="page page-column">
      <div className="section-header">
        <h1>Dashboard</h1>
        <p>Visualize o resumo completo da sua conta no sistema Performance.</p>
      </div>

      <div className="dashboard-full-layout">
        <div className="dashboard-profile-card profile-card">
          <div className="profile-avatar">
            {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <h2>{profile?.name || 'Usuário'}</h2>
          <p><strong>Email:</strong> {profile?.email || user?.email}</p>
          <p><strong>Telefone:</strong> {profile?.phone || 'Não informado'}</p>
          <p><strong>Perfil:</strong> {profile?.role || 'user'}</p>
          <p><strong>Bio:</strong> {profile?.bio || 'Nenhuma bio cadastrada.'}</p>
        </div>

        <div className="dashboard-main-content">
          <div className="dashboard-grid dashboard-grid-extended">
            <div className="dashboard-card">
              <h3>Total de Metas</h3>
              <p>{stats.totalGoals}</p>
            </div>

            <div className="dashboard-card">
              <h3>Metas Concluídas</h3>
              <p>{stats.completedGoals}</p>
            </div>

            <div className="dashboard-card">
              <h3>Total de Atividades</h3>
              <p>{stats.totalActivities}</p>
            </div>

            <div className="dashboard-card">
              <h3>Atividades Concluídas</h3>
              <p>{stats.completedActivities}</p>
            </div>

            <div className="dashboard-card">
              <h3>Registros de Desempenho</h3>
              <p>{stats.totalPerformanceRecords}</p>
            </div>

            <div className="dashboard-card">
              <h3>Média de Desempenho</h3>
              <p>{stats.averageScore}</p>
            </div>
          </div>

          <div className="dashboard-actions-card form-card">
            <h2>Atalhos Rápidos</h2>

            <div className="dashboard-actions">
              <Link to="/profile" className="btn secondary">
                Editar Perfil
              </Link>

              <Link to="/goals" className="btn secondary">
                Ver Metas
              </Link>

              <Link to="/activities" className="btn secondary">
                Ver Atividades
              </Link>

              <Link to="/performance" className="btn secondary">
                Ver Desempenho
              </Link>

              <Link to="/reports" className="btn secondary">
                Ver Relatórios
              </Link>

              <Link to="/settings" className="btn secondary">
                Configurações
              </Link>
            </div>
          </div>

          <div className="dashboard-summary-card form-card">
            <h2>Resumo Geral</h2>

            <p>
              Você possui <strong>{stats.totalGoals}</strong> metas cadastradas,
              sendo <strong>{stats.completedGoals}</strong> concluídas.
            </p>

            <p>
              Há <strong>{stats.totalActivities}</strong> atividades registradas,
              com <strong>{stats.completedActivities}</strong> concluídas.
            </p>

            <p>
              Seu desempenho possui <strong>{stats.totalPerformanceRecords}</strong>{' '}
              registros, com média de <strong>{stats.averageScore}</strong>.
            </p>

            <p>
              O sistema está <strong>online</strong> e funcionando normalmente.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard