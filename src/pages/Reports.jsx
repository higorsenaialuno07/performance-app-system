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
  })

  const fetchReports = async () => {
    if (!user) return

    setLoading(true)

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
      alert('Erro ao carregar relatórios')
      setLoading(false)
      return
    }

    const totalGoals = goalsData?.length || 0
    const completedGoals =
      goalsData?.filter((goal) => goal.status === 'concluída').length || 0
    const pendingGoals =
      goalsData?.filter((goal) => goal.status !== 'concluída').length || 0

    const totalActivities = activitiesData?.length || 0
    const completedActivities =
      activitiesData?.filter((activity) => activity.status === 'concluída').length || 0
    const pendingActivities =
      activitiesData?.filter((activity) => activity.status !== 'concluída').length || 0

    const totalPerformanceRecords = performanceData?.length || 0

    const totalScore =
      performanceData?.reduce((acc, item) => acc + (Number(item.score) || 0), 0) || 0

    const averageScore =
      totalPerformanceRecords > 0
        ? (totalScore / totalPerformanceRecords).toFixed(1)
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
    })

    setLoading(false)
  }

  useEffect(() => {
    fetchReports()
  }, [user])

  if (loading) {
    return <p style={{ padding: '20px' }}>Carregando relatórios...</p>
  }

  return (
    <section className="page page-column">
      <div className="section-header">
        <h1>Relatórios</h1>
        <p>Visualize o resumo geral do seu desempenho no sistema Performance.</p>
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
      </div>
    </section>
  )
}

export default Reports