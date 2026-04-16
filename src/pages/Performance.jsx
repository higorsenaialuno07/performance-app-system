import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'

function Performance() {
  const { user } = useAuth()

  const [score, setScore] = useState('')
  const [observation, setObservation] = useState('')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')

  const fetchPerformanceRecords = async () => {
    if (!user) return

    setLoading(true)

    const { data, error } = await supabase
      .from('performance_records')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      alert('Erro ao buscar desempenho')
      setLoading(false)
      return
    }

    setRecords(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPerformanceRecords()
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!score) {
      alert('Digite uma pontuação')
      return
    }

    if (!user) {
      alert('Usuário não encontrado')
      return
    }

    setSaving(true)

    const { error } = await supabase.from('performance_records').insert([
      {
        user_id: user.id,
        score: Number(score),
        observation: observation.trim() || null,
      },
    ])

    setSaving(false)

    if (error) {
      alert('Erro ao registrar desempenho')
      return
    }

    setScore('')
    setObservation('')
    fetchPerformanceRecords()
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Deseja excluir este registro de desempenho?'
    )
    if (!confirmDelete) return

    const { error } = await supabase
      .from('performance_records')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro ao excluir registro')
      return
    }

    fetchPerformanceRecords()
  }

  const getStatus = (scoreValue) => {
    if (scoreValue >= 90) return 'Excelente'
    if (scoreValue >= 70) return 'Bom'
    if (scoreValue >= 50) return 'Regular'
    return 'Ruim'
  }

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const recordStatus = getStatus(Number(record.score))
      const matchesSearch = record.observation
        ?.toLowerCase()
        .includes(search.toLowerCase()) || !search
      const matchesStatus =
        statusFilter === 'todos' ? true : recordStatus === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [records, search, statusFilter])

  const totalRecords = records.length
  const totalScore = records.reduce(
    (acc, item) => acc + (Number(item.score) || 0),
    0
  )
  const averageScore =
    totalRecords > 0 ? (totalScore / totalRecords).toFixed(1) : 0
  const bestScore =
    totalRecords > 0
      ? Math.max(...records.map((item) => Number(item.score) || 0))
      : 0
  const lastScore = totalRecords > 0 ? records[0].score : 0

  return (
    <section className="page page-column">
      <div className="section-header">
        <h1>Desempenho</h1>
        <p>Registre pontuações, acompanhe evolução e visualize resultados.</p>
      </div>

      <div className="performance-layout">
        <div className="form-card performance-form-card">
          <h2>Novo Registro</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label className="form-label">Pontuação</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Digite uma pontuação de 0 a 100"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="form-label">Observação</label>
              <textarea
                placeholder="Observação sobre o desempenho"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                rows="4"
              />
            </div>

            <button type="submit" className="btn primary full" disabled={saving}>
              {saving ? 'Salvando...' : 'Registrar Desempenho'}
            </button>
          </form>
        </div>

        <div className="performance-content">
          <div className="performance-summary-grid">
            <div className="dashboard-card">
              <h3>Total de Registros</h3>
              <p>{totalRecords}</p>
            </div>

            <div className="dashboard-card">
              <h3>Média de Desempenho</h3>
              <p>{averageScore}</p>
            </div>

            <div className="dashboard-card">
              <h3>Melhor Resultado</h3>
              <p>{bestScore}</p>
            </div>

            <div className="dashboard-card">
              <h3>Último Resultado</h3>
              <p>{lastScore}</p>
            </div>
          </div>

          <div className="list-card performance-list-card">
            <div className="list-card-header">
              <div>
                <h2>Histórico de Desempenho</h2>
                <p className="field-hint">
                  Consulte registros, resultados e observações salvas.
                </p>
              </div>
            </div>

            <div className="filters-row">
              <input
                type="text"
                placeholder="Buscar por observação"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="Excelente">Excelente</option>
                <option value="Bom">Bom</option>
                <option value="Regular">Regular</option>
                <option value="Ruim">Ruim</option>
              </select>
            </div>

            {loading ? (
              <p>Carregando registros...</p>
            ) : filteredRecords.length === 0 ? (
              <p>Nenhum registro de desempenho encontrado.</p>
            ) : (
              <div className="performance-list">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="goal-item">
                    <div className="goal-top">
                      <h3>Pontuação: {record.score}</h3>
                      <span
                        className={
                          record.score >= 90
                            ? 'status-badge status-excelente'
                            : record.score >= 70
                            ? 'status-badge status-bom'
                            : record.score >= 50
                            ? 'status-badge status-regular'
                            : 'status-badge status-ruim'
                        }
                      >
                        {getStatus(record.score)}
                      </span>
                    </div>

                    <p className="goal-description">
                      {record.observation || 'Sem observação'}
                    </p>

                    <p className="goal-deadline">
                      <strong>Data:</strong>{' '}
                      {new Date(record.created_at).toLocaleDateString('pt-BR')}
                    </p>

                    <div className="goal-actions">
                      <button
                        className="btn logout"
                        onClick={() => handleDelete(record.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Performance