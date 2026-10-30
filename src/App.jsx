
import { useState, useEffect } from "react"
import "./App.css"

function App() {
const [materias, setMaterias] = useState(() => {
  return JSON.parse(localStorage.getItem("studyflow_materias")) || []
})

const [tarefas, setTarefas] = useState(() => {
  return JSON.parse(localStorage.getItem("studyflow_tarefas")) || []
})

useEffect(() => {
  localStorage.setItem("studyflow_materias", JSON.stringify(materias))
}, [materias])

useEffect(() => {
  localStorage.setItem("studyflow_tarefas", JSON.stringify(tarefas))
}, [tarefas])

  const [novaMateria, setNovaMateria] = useState("")
  const [novaTarefa, setNovaTarefa] = useState("")
  const [prazo, setPrazo] = useState("")

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

  return (
    <div className="app">
      <header>
        <h1>StudyFlow</h1>
        <p>Organize seus estudos de forma simples.</p>
      </header>

      <main>
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
            <strong>{tarefas.length - concluidas}</strong>
          </div>
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
                }>Excluir</button>
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
                <div>
                  <span className={tarefa.concluida ? "concluida" : ""}>
                    {tarefa.nome}
                  </span>
                  <small>Entrega: {tarefa.prazo}</small>
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
