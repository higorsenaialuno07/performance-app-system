import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'

function Activities() {
  const { user } = useAuth()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
        title,
        description,
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
      alert('Erro ao excluir atividade')
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

  return (
    <section className="page page-column activities-page">
      <div className="section-header">
        <h1>Atividades</h1>
        <p>Cadastre, acompanhe e conclua suas atividades no sistema Performance.</p>
      </div>

      <div className="goals-layout">
        <div className="form-card goals-form-card">
          <h2>Nova Atividade</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              placeholder="Título da atividade"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Descrição da atividade"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            />

            <button type="submit" className="btn primary full" disabled={saving}>
              {saving ? 'Salvando...' : 'Adicionar Atividade'}
            </button>
          </form>
        </div>

        <div className="list-card goals-list-card">
          <h2>Lista de Atividades</h2>

          {loading ? (
            <p>Carregando atividades...</p>
          ) : activities.length === 0 ? (
            <p>Nenhuma atividade cadastrada ainda.</p>
          ) : (
            <div className="goals-list">
              {activities.map((activity) => (
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