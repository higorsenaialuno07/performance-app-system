import { useEffect, useState } from 'react'
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

  const { data, error } = await supabase
    .from('goals')
    .insert([
      {
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        deadline: deadline || null,
        status: 'pendente',
      },
    ])
    .select()

  setSaving(false)

  console.log('USER:', user)
  console.log('DATA INSERT:', data)
  console.log('ERROR INSERT:', error)

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
  console.log(error)
  alert('Erro ao atualizar status: ' + error.message)
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
      alert('Erro ao atualizar status')
      return
    }

    fetchGoals()
  }

  return (
    <section className="page page-column goals-page">
      <div className="section-header">
        <h1>Metas</h1>
        <p>Cadastre, acompanhe e conclua suas metas no sistema Performance.</p>
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

            <textarea
              placeholder="Descrição da meta"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            />

            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            <button type="submit" className="btn primary full" disabled={saving}>
              {saving ? 'Salvando...' : 'Adicionar Meta'}
            </button>
          </form>
        </div>

        <div className="list-card goals-list-card">
          <h2>Lista de Metas</h2>

          {loading ? (
            <p>Carregando metas...</p>
          ) : goals.length === 0 ? (
            <p>Nenhuma meta cadastrada ainda.</p>
          ) : (
            <div className="goals-list">
              {goals.map((goal) => (
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
                    {goal.deadline ? goal.deadline : 'Não definido'}
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