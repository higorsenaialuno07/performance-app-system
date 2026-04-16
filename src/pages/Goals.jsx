import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'

function Goals() {
  const { user } = useAuth()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todas')

  const fetchGoals = async () => {
    if (!user) return

    setLoading(true)

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.log('ERRO AO BUSCAR METAS:', error)
      alert('Erro ao buscar metas: ' + error.message)
      setLoading(false)
      return
    }

    setGoals(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchGoals()
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Digite o título da meta')
      return
    }

    if (!user) {
      alert('Usuário não encontrado')
      return
    }

    setSaving(true)

    const { error } = await supabase.from('goals').insert([
      {
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        deadline: deadline || null,
        status: 'pendente',
      },
    ])

    setSaving(false)

    if (error) {
      alert('Erro ao cadastrar meta: ' + error.message)
      return
    }

    setTitle('')
    setDescription('')
    setDeadline('')
    fetchGoals()
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Deseja excluir esta meta?')
    if (!confirmDelete) return

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro ao excluir meta: ' + error.message)
      return
    }

    fetchGoals()
  }

  const handleComplete = async (id, currentStatus) => {
    const newStatus = currentStatus === 'concluída' ? 'pendente' : 'concluída'

    const { error } = await supabase
      .from('goals')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      alert('Erro ao atualizar status: ' + error.message)
      return
    }

    fetchGoals()
  }

  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      const matchesSearch =
        goal.title?.toLowerCase().includes(search.toLowerCase()) ||
        goal.description?.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'todas' ? true : goal.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [goals, search, statusFilter])

  const totalGoals = goals.length
  const completedGoals = goals.filter((goal) => goal.status === 'concluída').length
  const pendingGoals = goals.filter((goal) => goal.status !== 'concluída').length

  return (
    <section className="page page-column goals-page">
      <div className="section-header">
        <h1>Metas</h1>
        <p>Cadastre, acompanhe e conclua suas metas no sistema Performance.</p>
      </div>

      <div className="dashboard-grid dashboard-grid-extended">
        <div className="dashboard-card">
          <h3>Total de Metas</h3>
          <p>{totalGoals}</p>
        </div>

        <div className="dashboard-card">
          <h3>Metas Concluídas</h3>
          <p>{completedGoals}</p>
        </div>

        <div className="dashboard-card">
          <h3>Metas Pendentes</h3>
          <p>{pendingGoals}</p>
        </div>
      </div>

      <div className="goals-layout">
        <div className="form-card goals-form-card">
          <h2>Nova Meta</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label className="form-label">Título da meta</label>
              <input
                type="text"
                placeholder="Digite o título da meta"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="form-label">Descrição</label>
              <textarea
                placeholder="Descrição da meta"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
              />
            </div>

            <div className="input-group">
              <label className="form-label">Prazo</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <button type="submit" className="btn primary full" disabled={saving}>
              {saving ? 'Salvando...' : 'Adicionar Meta'}
            </button>
          </form>
        </div>

        <div className="list-card goals-list-card">
          <div className="list-card-header">
            <div>
              <h2>Lista de Metas</h2>
              <p className="field-hint">Gerencie, filtre e acompanhe suas metas.</p>
            </div>
          </div>

          <div className="filters-row">
            <input
              type="text"
              placeholder="Buscar meta por título ou descrição"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="pendente">Pendentes</option>
              <option value="concluída">Concluídas</option>
            </select>
          </div>

          {loading ? (
            <p>Carregando metas...</p>
          ) : filteredGoals.length === 0 ? (
            <p>Nenhuma meta encontrada.</p>
          ) : (
            <div className="goals-list">
              {filteredGoals.map((goal) => (
                <div key={goal.id} className="goal-item">
                  <div className="goal-top">
                    <h3>{goal.title}</h3>
                    <span
                      className={
                        goal.status === 'concluída'
                          ? 'status-badge completed'
                          : 'status-badge pending'
                      }
                    >
                      {goal.status}
                    </span>
                  </div>

                  <p className="goal-description">
                    {goal.description || 'Sem descrição'}
                  </p>

                  <p className="goal-deadline">
                    <strong>Prazo:</strong>{' '}
                    {goal.deadline
                      ? new Date(goal.deadline).toLocaleDateString('pt-BR')
                      : 'Não definido'}
                  </p>

                  <div className="goal-actions">
                    <button
                      className="btn secondary"
                      onClick={() => handleComplete(goal.id, goal.status)}
                    >
                      {goal.status === 'concluída'
                        ? 'Marcar como Pendente'
                        : 'Concluir'}
                    </button>

                    <button
                      className="btn logout"
                      onClick={() => handleDelete(goal.id)}
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
    </section>
  )
}

export default Goals