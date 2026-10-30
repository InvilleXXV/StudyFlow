
import { useState, useEffect } from "react"
import "./App.css"

function App() {

  const [mostrarBoasVindas, setMostrarBoasVindas] = useState(true)

useEffect(() => {
  const temporizador = setTimeout(() => {
    setMostrarBoasVindas(false)
  }, 3500)

  return () => clearTimeout(temporizador)
}, [])

  const [materias, setMaterias] = useState(() => {
    return JSON.parse(localStorage.getItem("studyflow_materias")) || []
  })

  const [tarefas, setTarefas] = useState(() => {
    return JSON.parse(localStorage.getItem("studyflow_tarefas")) || []
  })

  const [novaMateria, setNovaMateria] = useState("")
  const [novaTarefa, setNovaTarefa] = useState("")
  const [prazo, setPrazo] = useState("")

  useEffect(() => {
    localStorage.setItem("studyflow_materias", JSON.stringify(materias))
  }, [materias])

  useEffect(() => {
    localStorage.setItem("studyflow_tarefas", JSON.stringify(tarefas))
  }, [tarefas])

  function adicionarMateria() {
    if (!novaMateria.trim()) return

    setMaterias([...materias, {
      id: Date.now(),
      nome: novaMateria
    }])

    setNovaMateria("")
  }

  function adicionarTarefa() {
    if (!novaTarefa.trim() || !prazo) return

    setTarefas([...tarefas, {
      id: Date.now(),
      nome: novaTarefa,
      prazo,
      concluida: false
    }])

    setNovaTarefa("")
    setPrazo("")
  }

  function concluirTarefa(id) {
    setTarefas(tarefas.map(tarefa =>
      tarefa.id === id
        ? { ...tarefa, concluida: !tarefa.concluida }
        : tarefa
    ))
  }

  function excluirTarefa(id) {
    setTarefas(tarefas.filter(tarefa => tarefa.id !== id))
  }

  const concluidas = tarefas.filter(t => t.concluida).length
  const pendentes = tarefas.length - concluidas

  const progresso = tarefas.length > 0
    ? Math.round((concluidas / tarefas.length) * 100)
    : 0

  function formatarData(data) {
    return new Date(data + "T00:00:00").toLocaleDateString("pt-BR")
  }

  function situacaoPrazo(tarefa) {
    if (tarefa.concluida) return "Concluída"

    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const dataEntrega = new Date(tarefa.prazo + "T00:00:00")

    if (dataEntrega < hoje) return "Atrasada"
    if (dataEntrega.getTime() === hoje.getTime()) return "Hoje"

    return "Próxima"
  }

  return (
    <div className="app">
      
      {mostrarBoasVindas && (
  <div className="boas-vindas-overlay">
    <div className="mensagem-boas-vindas">
      <h1>Oi! 👋</h1>
      <p>Que bom ter você por aqui!</p>
      <small>Vamos organizar seus estudos?</small>
    </div>
  </div>
)}
      <header>
        <h1>StudyFlow</h1>
        <p>Organize seus estudos de forma simples.</p>
      </header>

      <main>
        <section className="boas-vindas">
          <div>
            <h2>Olá! Vamos organizar seus estudos? 👋</h2>
            <p>Acompanhe suas atividades e mantenha tudo em dia.</p>
          </div>

          <span>{new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
          })}</span>
        </section>

        <section className="resumo">
          <div className="card">
            <h3>Matérias</h3>
            <strong>{materias.length}</strong>
          </div>

          <div className="card">
            <h3>Tarefas</h3>
            <strong>{tarefas.length}</strong>
          </div>

          <div className="card">
            <h3>Concluídas</h3>
            <strong>{concluidas}</strong>
          </div>

          <div className="card">
            <h3>Pendentes</h3>
            <strong>{pendentes}</strong>
          </div>
        </section>

        <section className="progresso-bloco">
          <div className="progresso-titulo">
            <h2>Meu progresso</h2>
            <strong>{progresso}%</strong>
          </div>

          <div className="barra-fundo">
            <div
              className="barra-preenchida"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>

          <p>{concluidas} de {tarefas.length} tarefas concluídas</p>
        </section>

        <section className="painel">
          <div className="bloco">
            <h2>Minhas matérias</h2>

            <div className="formulario">
              <input
                value={novaMateria}
                onChange={e => setNovaMateria(e.target.value)}
                placeholder="Nome da matéria"
              />

              <button onClick={adicionarMateria}>Adicionar</button>
            </div>

            {materias.map(materia => (
              <div className="item" key={materia.id}>
                {materia.nome}

                <button onClick={() =>
                  setMaterias(materias.filter(m => m.id !== materia.id))
                }>
                  Excluir
                </button>
              </div>
            ))}
          </div>

          <div className="bloco">
            <h2>Minhas tarefas</h2>

            <div className="formulario">
              <input
                value={novaTarefa}
                onChange={e => setNovaTarefa(e.target.value)}
                placeholder="Nome da tarefa"
              />

              <input
                type="date"
                value={prazo}
                onChange={e => setPrazo(e.target.value)}
              />

              <button onClick={adicionarTarefa}>Adicionar</button>
            </div>

            {tarefas.map(tarefa => (
              <div className="item" key={tarefa.id}>
                <div className="informacao-tarefa">
                  <span className={tarefa.concluida ? "concluida" : ""}>
                    {tarefa.nome}
                  </span>

                  <small>Entrega: {formatarData(tarefa.prazo)}</small>

                  <span className={`status ${situacaoPrazo(tarefa).toLowerCase()}`}>
                    {situacaoPrazo(tarefa)}
                  </span>
                </div>

                <div className="acoes">
                  <button onClick={() => concluirTarefa(tarefa.id)}>
                    {tarefa.concluida ? "Desfazer" : "Concluir"}
                  </button>

                  <button onClick={() => excluirTarefa(tarefa.id)}>
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
