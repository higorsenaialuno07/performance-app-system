import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

function Register() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem.')
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
    })

    if (error) {
      alert(error.message)
      return
    }

    const userId = data?.user?.id

    if (!userId) {
      alert('Usuário criado, mas o ID não foi retornado.')
      return
    }

    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: userId,
        name: nome,
        email,
        phone: '',
        role: 'user',
        bio: '',
        avatar_url: '',
      },
    ])

    if (profileError) {
      alert(profileError.message)
      return
    }

    alert('Conta criada com sucesso!')
    navigate('/login')
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Criar Conta</h2>
        <p>Cadastre-se para acessar o sistema.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Crie uma senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirme sua senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />

          <button type="submit" className="btn primary full">
            Cadastrar
          </button>
        </form>

        <span className="auth-link">
          Já tem conta? <Link to="/login">Entrar</Link>
        </span>
      </div>
    </section>
  )
}

export default Register