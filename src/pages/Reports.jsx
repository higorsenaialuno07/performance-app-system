import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'

function Reports() {
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({
    totalGoals: 0,
    completedGoals: 0,
    pendingGoals: 0,
    totalActivities: 0,
    completedActivities: 0,
    pendingActivities: 0,
    totalPerformanceRecords: 0,
    averageScore: 0,
    bestScore: 0,
  })

  const fetchReports = async () => {
    if (!user) return

    setLoading(true)

    const [
      goalsResponse,
      activitiesResponse,
      performanceResponse,
    ] = await Promise.all([
      supabase.from('goals').select('*').eq('user_id', user.id),
      supabase.from('activities').select('*').eq('user_id', user.id),
      supabase.from('performance_records').select('*').eq('user_id', user.id),
    ])

    const { data: goalsData, error: goalsError } = goalsResponse
    const { data: activitiesData, error: activitiesError } = activitiesResponse
    const { data: performanceData, error: performanceError } = performanceResponse

    if (goalsError || activitiesError || performanceError) {
      alert('Erro ao carregar relatórios')
      setLoading(false)
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

    setSummary({
      totalGoals,
      completedGoals,
      pendingGoals,
      totalActivities,
      completedActivities,
      pendingActivities,
      totalPerformanceRecords,
      averageScore,
      bestScore,
    })

    setLoading(false)
  }

  useEffect(() => {
    fetchReports()
  }, [user])

  if (loading) {
    return <p style={{ padding: '20px' }}>Carregando relatórios...</p>
  }

  const goalsProgress =
    summary.totalGoals > 0
      ? Math.round((summary.completedGoals / summary.totalGoals) * 100)
      : 0

  const activitiesProgress =
    summary.totalActivities > 0
      ? Math.round((summary.completedActivities / summary.totalActivities) * 100)
      : 0

  return (
    <section className="page page-column">
      <div className="section-header">
        <h1>Relatórios</h1>
        <p>
          Visualize indicadores, progresso geral e desempenho médio do sistema.
        </p>
      </div>

      <div className="reports-grid">
        <div className="dashboard-card">
          <h3>Total de Metas</h3>
          <p>{summary.totalGoals}</p>
        </div>

        <div className="dashboard-card">
          <h3>Metas Concluídas</h3>
          <p>{summary.completedGoals}</p>
        </div>

        <div className="dashboard-card">
          <h3>Metas Pendentes</h3>
          <p>{summary.pendingGoals}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total de Atividades</h3>
          <p>{summary.totalActivities}</p>
        </div>

        <div className="dashboard-card">
          <h3>Atividades Concluídas</h3>
          <p>{summary.completedActivities}</p>
        </div>

        <div className="dashboard-card">
          <h3>Atividades Pendentes</h3>
          <p>{summary.pendingActivities}</p>
        </div>

        <div className="dashboard-card">
          <h3>Registros de Desempenho</h3>
          <p>{summary.totalPerformanceRecords}</p>
        </div>

        <div className="dashboard-card">
          <h3>Média de Desempenho</h3>
          <p>{summary.averageScore}</p>
        </div>

        <div className="dashboard-card">
          <h3>Melhor Resultado</h3>
          <p>{summary.bestScore}</p>
        </div>
      </div>

      <div className="dashboard-summary-card form-card">
        <h2>Resumo Analítico</h2>
        <p><strong>Progresso das metas:</strong> {goalsProgress}%</p>
        <p><strong>Progresso das atividades:</strong> {activitiesProgress}%</p>
        <p><strong>Média de desempenho:</strong> {summary.averageScore}</p>
        <p><strong>Melhor resultado:</strong> {summary.bestScore}</p>
      </div>
    </section>
  )
}

export default Reports