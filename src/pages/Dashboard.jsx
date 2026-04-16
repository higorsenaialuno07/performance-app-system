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
    pendingGoals: 0,
    pendingActivities: 0,
    bestScore: 0,
  })

  const [recentGoals, setRecentGoals] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [dashboardLoading, setDashboardLoading] = useState(true)

  const fetchDashboardData = async () => {
    if (!user) return

    setDashboardLoading(true)

    const [
      goalsResponse,
      activitiesResponse,
      performanceResponse,
      recentGoalsResponse,
      recentActivitiesResponse,
    ] = await Promise.all([
      supabase.from('goals').select('*').eq('user_id', user.id),
      supabase.from('activities').select('*').eq('user_id', user.id),
      supabase.from('performance_records').select('*').eq('user_id', user.id),
      supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3),
      supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3),
    ])

    const { data: goalsData, error: goalsError } = goalsResponse
    const { data: activitiesData, error: activitiesError } = activitiesResponse
    const { data: performanceData, error: performanceError } = performanceResponse
    const { data: recentGoalsData } = recentGoalsResponse
    const { data: recentActivitiesData } = recentActivitiesResponse

    if (goalsError || activitiesError || performanceError) {
      alert('Erro ao carregar dados da dashboard')
      setDashboardLoading(false)
      return
    }

    const totalGoals = goalsData?.length || 0
    const completedGoals =
      goalsData?.filter((goal) => goal.status === 'concluída').length || 0
    const pendingGoals = totalGoals - completedGoals

    const totalActivities = activitiesData?.length || 0
    const completedActivities =
      activitiesData?.filter((activity) => activity.status === 'concluída').length || 0
    const pendingActivities = totalActivities - completedActivities

    const totalPerformanceRecords = performanceData?.length || 0
    const totalScore =
      performanceData?.reduce((acc, item) => acc + (Number(item.score) || 0), 0) || 0

    const averageScore =
      totalPerformanceRecords > 0
        ? Number(totalScore / totalPerformanceRecords).toFixed(1)
        : 0

    const bestScore =
      totalPerformanceRecords > 0
        ? Math.max(...performanceData.map((item) => Number(item.score) || 0))
        : 0

    setStats({
      totalGoals,
      completedGoals,
      totalActivities,
      completedActivities,
      totalPerformanceRecords,
      averageScore,
      pendingGoals,
      pendingActivities,
      bestScore,
    })

    setRecentGoals(recentGoalsData || [])
    setRecentActivities(recentActivitiesData || [])
    setDashboardLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  if (loading || dashboardLoading) {
    return <p style={{ padding: '20px' }}>Carregando dashboard...</p>
  }

  const goalsProgress =
    stats.totalGoals > 0
      ? Math.round((stats.completedGoals / stats.totalGoals) * 100)
      : 0

  const activitiesProgress =
    stats.totalActivities > 0
      ? Math.round((stats.completedActivities / stats.totalActivities) * 100)
      : 0

  return (
    <section className="page page-column">
      <div className="section-header">
        <h1>Dashboard</h1>
        <p>
          Acompanhe seu progresso, visualize indicadores e acesse rapidamente as
          principais áreas do sistema.
        </p>
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
              <h3>Metas Pendentes</h3>
              <p>{stats.pendingGoals}</p>
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
              <h3>Atividades Pendentes</h3>
              <p>{stats.pendingActivities}</p>
            </div>

            <div className="dashboard-card">
              <h3>Registros de Desempenho</h3>
              <p>{stats.totalPerformanceRecords}</p>
            </div>

            <div className="dashboard-card">
              <h3>Média de Desempenho</h3>
              <p>{stats.averageScore}</p>
            </div>

            <div className="dashboard-card">
              <h3>Melhor Resultado</h3>
              <p>{stats.bestScore}</p>
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

          <div className="dashboard-summary-card form-card">
            <h2>Progresso Atual</h2>

            <p><strong>Metas concluídas:</strong> {goalsProgress}%</p>
            <p><strong>Atividades concluídas:</strong> {activitiesProgress}%</p>
            <p><strong>Média de desempenho:</strong> {stats.averageScore}</p>
          </div>

          <div className="dashboard-summary-card form-card">
            <h2>Últimas Metas</h2>

            {recentGoals.length === 0 ? (
              <p>Nenhuma meta recente cadastrada.</p>
            ) : (
              recentGoals.map((goal) => (
                <div key={goal.id} style={{ marginBottom: '12px' }}>
                  <p><strong>{goal.title}</strong></p>
                  <p>Status: {goal.status}</p>
                </div>
              ))
            )}
          </div>

          <div className="dashboard-summary-card form-card">
            <h2>Últimas Atividades</h2>

            {recentActivities.length === 0 ? (
              <p>Nenhuma atividade recente cadastrada.</p>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} style={{ marginBottom: '12px' }}>
                  <p><strong>{activity.title}</strong></p>
                  <p>Status: {activity.status}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard