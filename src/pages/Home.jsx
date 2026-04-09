import { Link } from 'react-router-dom'

function Home() {
  return (
    <section className="home-page">
      <div className="hero">
        <div className="hero-text">
          <span className="badge">Sistema Web + App</span>
          <h1>Gerencie perfis com visual profissional e acesso seguro</h1>
          <p>
            O Performance foi desenvolvido para cadastro, login e gerenciamento
            de perfis de usuários com interface moderna, responsiva e integrada
            ao Supabase.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn primary">
              Criar Conta
            </Link>
            <Link to="/login" className="btn secondary">
              Entrar
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <h3>Recursos do sistema</h3>
          <ul>
            <li>Cadastro de usuário</li>
            <li>Login seguro</li>
            <li>Perfil integrado ao banco</li>
            <li>Dashboard com informações</li>
            <li>Layout responsivo</li>
          </ul>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3>Cadastro inteligente</h3>
          <p>Crie usuários com armazenamento real no banco de dados.</p>
        </div>
        <div className="feature-card">
          <h3>Acesso protegido</h3>
          <p>Somente usuários autenticados acessam Perfil e Dashboard.</p>
        </div>
        <div className="feature-card">
          <h3>Visual moderno</h3>
          <p>Interface bonita para apresentação e uso em celular e PC.</p>
        </div>
      </div>
    </section>
  )
}

export default Home