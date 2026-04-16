import { Link } from 'react-router-dom'

function Home() {
  return (
    <section className="home-page">
      <div className="hero hero-enhanced">
        <div className="hero-text">
          <span className="badge">Sistema Web de Produtividade</span>

          <h1>Gerencie metas, atividades e desempenho em um só lugar</h1>

          <p>
            O Performance App System é uma plataforma desenvolvida para
            organização pessoal e profissional, permitindo acompanhar metas,
            controlar atividades, registrar desempenho e visualizar resultados
            em tempo real.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn primary">
              Criar Conta
            </Link>

            <Link to="/login" className="btn secondary">
              Entrar
            </Link>

            <Link to="/dashboard" className="btn secondary">
              Ver Dashboard
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <h3>O que você encontra no sistema</h3>
          <ul>
            <li>Gestão completa de metas</li>
            <li>Controle de atividades diárias</li>
            <li>Registro e análise de desempenho</li>
            <li>Relatórios com visão geral do progresso</li>
            <li>Conta, perfil e preferências integrados</li>
          </ul>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3>Metas com prazo</h3>
          <p>
            Cadastre objetivos, defina prazos e acompanhe o andamento de forma
            simples e organizada.
          </p>
        </div>

        <div className="feature-card">
          <h3>Atividades em andamento</h3>
          <p>
            Registre tarefas do dia a dia e acompanhe o status de execução em
            um ambiente moderno e intuitivo.
          </p>
        </div>

        <div className="feature-card">
          <h3>Desempenho em tempo real</h3>
          <p>
            Salve pontuações, acompanhe evolução e visualize resultados para
            tomar decisões melhores.
          </p>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3>Relatórios inteligentes</h3>
          <p>
            Visualize resumos gerais, metas concluídas, atividades pendentes e
            desempenho médio do usuário.
          </p>
        </div>

        <div className="feature-card">
          <h3>Segurança e autenticação</h3>
          <p>
            Login seguro, proteção de rotas e integração com Supabase para
            armazenamento confiável dos dados.
          </p>
        </div>

        <div className="feature-card">
          <h3>Experiência profissional</h3>
          <p>
            Interface responsiva, visual moderno e estrutura preparada para
            crescer com novas funcionalidades.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Home