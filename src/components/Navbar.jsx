import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Navbar() {
  const { user, profile, signOut } = useAuth()

  return (
    <header className="navbar">
      <div className="logo">⚡ Performance</div>

      <nav className="nav-links">
        <Link to="/">Início</Link>

        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Perfil</Link>
            <Link to="/goals">Metas</Link>
            <Link to="/activities">Atividades</Link>
            <Link to="/performance">Desempenho</Link>
            <Link to="/reports">Relatórios</Link>
            <Link to="/settings">Configurações</Link>

            <span className="user-name">{profile?.name || 'Usuário'}</span>

            <button onClick={signOut} className="btn logout">
              Sair
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn primary">
              Criar Conta
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar