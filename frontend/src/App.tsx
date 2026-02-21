import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";

interface User {
  id: number;
  username: string;
}

interface Task {
  id: number;
  user: User;
  title: string;
  streak: number;
  date: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>("");
  
  // Inicializa o estado verificando se já existe um token no navegador
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

  // 1. BUSCAR (GET) - Agora depende de estar autenticado
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      api
        .get<Task[]>("tasks/")
        .then((res) => {
          setTasks(res.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          // Se der erro 401 (não autorizado), deslogamos o usuário
          handleLogout();
        });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue
    try {
      const response = await api.post('http://127.0.0.1:8000/api-token-auth/', {
        username,
        password
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username); 
      setIsAuthenticated(true);
      setCurrentUser(username);
      // Limpa os campos de login
      setUsername("");
      setPassword("");
    } catch (err) {
      alert("Usuário ou senha inválidos");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setTasks([]);
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle) return;
    try {
      const response = await api.post<Task>("tasks/", {
        title: newTaskTitle,
        streak: 0,
      });
      setTasks([...tasks, response.data]);
      setNewTaskTitle("");
    } catch (err) {
      alert("Erro ao criar tarefa");
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await api.delete(`tasks/${id}/`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      alert("Erro ao deletar");
    }
  };

  const handleCheck = async (taskId: number) => {
  try {
    const response = await api.post(`tasks/${taskId}/increment_streak/`);
    // Atualiza a lista local com o novo valor do streak
    setTasks(tasks.map(t => t.id === taskId ? { ...t, streak: response.data.streak } : t));
  } catch (err) {
    alert("Erro ao atualizar streak");
  }
};

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // we use the route /register/ created
      await api.post('register/', { username, password });

      alert("Conta criada com sucesso!");
      setIsRegistering(false); // volta para tela de login
      setPassword("");
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao cadastrar");
    }
  }

  if (loading) return <h1>Carregando...</h1>;

  // VIEW 1: SE NÃO ESTIVER LOGADO, MOSTRA LOGIN
  if (!isAuthenticated) {
  return (
    <div className="container">
      <form onSubmit={isRegistering ? handleRegister : handleLogin} className="login-form">
        <h1>{isRegistering ? "📝 Criar Conta" : "🔒 Login"}</h1>
        
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button type="submit">
          {isRegistering ? "Cadastrar Agora" : "Entrar"}
        </button>

        <p 
          onClick={() => setIsRegistering(!isRegistering)} 
          style={{ cursor: 'pointer', color: '#007bff', marginTop: '15px', textAlign: 'center' }}
        >
          {isRegistering 
            ? "Já tem uma conta? Faça login" 
            : "Novo por aqui? Crie sua conta"}
        </p>
      </form>
    </div>
  );
}

  // VIEW 2: SE ESTIVER LOGADO, MOSTRA O APP
  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🔥 Task Streak Tracker</h1>
        <button onClick={handleLogout} className="btn-logout">Sair</button>
      </header>

      <div className="add-task">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Digite uma nova tarefa..."
        />
        <button onClick={handleCreateTask}>Adicionar</button>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <div>
              <h3>{task.title}</h3>
              <p>Streak: {task.streak} 🔥</p>
            </div>
            <div className="actions">
              <button onClick={() => handleCheck(task.id)}>✅ Feito!</button>
              <button onClick={() => handleDeleteTask(task.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;