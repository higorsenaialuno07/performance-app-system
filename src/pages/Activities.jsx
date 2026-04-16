import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'

function Activities() {
  const { user } = useAuth()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todas')

  const fetchActivities = async () => {
    if (!user) return

    setLoading(true)

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.log('Erro ao buscar atividades:', error)
      alert(error.message)
      setLoading(false)
      return
    }

    setActivities(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchActivities()
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Digite o título da atividade')
      return
    }

    if (!user) {
      alert('Usuário não encontrado')
      return
    }

    setSaving(true)

    const { error } = await supabase.from('activities').insert([
      {
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        status: 'pendente',
      },
    ])

    setSaving(false)

    if (error) {
      console.log(error)
      alert(error.message)
      return
    }

    setTitle('')
    setDescription('')
    fetchActivities()
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Deseja excluir esta atividade?')
    if (!confirmDelete) return

    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro ao excluir atividade: ' + error.message)
      return
    }

    fetchActivities()
  }

  const handleComplete = async (id, currentStatus) => {
    const newStatus = currentStatus === 'concluída' ? 'pendente' : 'concluída'

    const { error } = await supabase
      .from('activities')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      console.log('Erro ao cadastrar atividade:', error)
      alert(error.message)
      return
    }

    fetchActivities()
  }

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch =
        activity.title?.toLowerCase().includes(search.toLowerCase()) ||
        activity.description?.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'todas' ? true : activity.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [activities, search, statusFilter])

  const totalActivities = activities.length
  const completedActivities =
    activities.filter((activity) => activity.status === 'concluída').length
  const pendingActivities =
    activities.filter((activity) => activity.status !== 'concluída').length

  return (
    <section className="page page-column activities-page">
      <div className="section-header">
        <h1>Atividades</h1>
        <p>Cadastre, acompanhe e conclua suas atividades no sistema Performance.</p>
      </div>

      <div className="dashboard-grid dashboard-grid-extended">
        <div className="dashboard-card">
          <h3>Total de Atividades</h3>
          <p>{totalActivities}</p>
        </div>

        <div className="dashboard-card">
          <h3>Atividades Concluídas</h3>
          <p>{completedActivities}</p>
        </div>

        <div className="dashboard-card">
          <h3>Atividades Pendentes</h3>
          <p>{pendingActivities}</p>
        </div>
      </div>

      <div className="goals-layout">
        <div className="form-card goals-form-card">
          <h2>Nova Atividade</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label className="form-label">Título da atividade</label>
              <input
                type="text"
                placeholder="Digite a atividade"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="form-label">Descrição</label>
              <textarea
                placeholder="Descrição da atividade"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
              />
            </div>

            <button type="submit" className="btn primary full" disabled={saving}>
              {saving ? 'Salvando...' : 'Adicionar Atividade'}
            </button>
          </form>
        </div>

        <div className="list-card goals-list-card">
          <div className="list-card-header">
            <div>
              <h2>Lista de Atividades</h2>
              <p className="field-hint">
                Acompanhe a execução das tarefas do seu dia a dia.
              </p>
            </div>
          </div>

          <div className="filters-row">
            <input
              type="text"
              placeholder="Buscar atividade por título ou descrição"
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
            <p>Carregando atividades...</p>
          ) : filteredActivities.length === 0 ? (
            <p>Nenhuma atividade encontrada.</p>
          ) : (
            <div className="goals-list">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="goal-item">
                  <div className="goal-top">
                    <h3>{activity.title}</h3>
                    <span
                      className={
                        activity.status === 'concluída'
                          ? 'status-badge completed'
                          : 'status-badge pending'
                      }
                    >
                      {activity.status}
                    </span>
                  </div>

                  <p className="goal-description">
                    {activity.description || 'Sem descrição'}
                  </p>

                  <div className="goal-actions">
                    <button
                      className="btn secondary"
                      onClick={() => handleComplete(activity.id, activity.status)}
                    >
                      {activity.status === 'concluída'
                        ? 'Marcar como Pendente'
                        : 'Concluir'}
                    </button>

                    <button
                      className="btn logout"
                      onClick={() => handleDelete(activity.id)}
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

export default Activities