import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Navbar() {
  const { user, profile, signOut } = useAuth()

  return (
    <header className="navbar">
      <div className="logo">⚡ Performance</div>

      <nav className="nav-links">
        <NavLink to="/">Início</NavLink>

        {user ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/profile">Perfil</NavLink>
            <NavLink to="/goals">Metas</NavLink>
            <NavLink to="/activities">Atividades</NavLink>
            <NavLink to="/performance">Desempenho</NavLink>
            <NavLink to="/reports">Relatórios</NavLink>
            <NavLink to="/settings">Configurações</NavLink>

            <span className="user-name">{profile?.name || 'Usuário'}</span>

            <button onClick={signOut} className="btn logout">
              Sair
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register" className="btn primary">
              Criar Conta
            </NavLink>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar