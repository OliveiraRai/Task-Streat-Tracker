import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";
import { User, Flame, Trash2, Plus, Settings, LogOut } from "lucide-react";

// --- INTERFACES ---
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

interface SettingsProps {
  onBack: () => void;
  profilePic: string;
  setProfilePic: (url: string) => void;
}

// --- COMPONENTE SETTINGS (FORA DO APP) ---
function SettingsView({ onBack, profilePic, setProfilePic }: SettingsProps) {
  const [tempUrl, setTempUrl] = useState(profilePic);

  const handleSave = () => {
    localStorage.setItem("profilePic", tempUrl);
    setProfilePic(tempUrl);
    alert("Foto atualizada!");
    onBack();
  };

  return (
    <div
      className="settings-screen"
      style={{ paddingTop: "100px", textAlign: "center" }}
    >
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          cursor: "pointer",
          padding: "10px",
        }}
      >
        Voltar
      </button>

      <h2>Configurações de Perfil</h2>

      <div className="avatar-container" style={{ margin: "20px auto" }}>
        {tempUrl ? (
          <img src={tempUrl} className="avatar-large" alt="Preview" />
        ) : (
          <User size={30} />
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "300px",
          margin: "0 auto",
        }}
      >
        <input
          type="text"
          placeholder="Cole a URL da foto"
          value={tempUrl}
          onChange={(e) => setTempUrl(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSave}
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Salvar Foto
        </button>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState("home");
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profilePic") || "",
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token"),
  );

  const formatUsername = (name: string) => {
    return name.length > 12 ? name.substring(0, 10) + "..." : name;
  };

  // Fecha menu ao clicar fora
  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    if (menuOpen) window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, [menuOpen]);

  // Suporte ao botão voltar do navegador
  useEffect(() => {
    const handlePopState = () => {
      if (view !== "home") setView("home");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [view]);

  const openSettings = () => {
    window.history.pushState({ page: "settings" }, "");
    setView("settings");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setTasks([]);
  };

  // Carregar Tarefas
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
          handleLogout();
        });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("http://127.0.0.1:8000/api-token-auth/", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", username);
      setIsAuthenticated(true);
    } catch (err) {
      alert("Erro no login");
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle) return;
    try {
      const res = await api.post<Task>("tasks/", {
        title: newTaskTitle,
        streak: 0,
      });
      setTasks([...tasks, res.data]);
      setNewTaskTitle("");
    } catch (err) {
      alert("Erro ao criar");
    }
  };

  const handleCheck = async (taskId: number) => {
    try {
      const res = await api.post(`tasks/${taskId}/increment_streak/`);

      // 1. Verificamos se a mensagem de "Já completado" está dentro de 'status'
      // que foi o nome que demos no dicionário do Python (Response({'status': ...}))
      if (res.data.status === "Já completado hoje!") {
        alert("🔥 Você já manteve sua chama acesa hoje! Volte amanhã.");
        return; // Interrompe a função aqui para não atualizar o estado à toa
      }

      // 2. Se não caiu no if acima, atualizamos o streak normalmente
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, streak: res.data.streak } : t,
        ),
      );
    } catch (err: any) {
      // 3. Caso o Django retorne um erro real (status 400 ou 500)
      const errorMsg =
        err.response?.data?.status ||
        err.response?.data?.detail ||
        "Erro ao atualizar streak";
      alert(errorMsg);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await api.delete(`tasks/${id}/`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      alert("Erro ao deletar");
    }
  };

  if (loading) return <h1>Carregando...</h1>;

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <form
          onSubmit={isRegistering ? (e) => e.preventDefault() : handleLogin}
          className="login-form"
        >
          <h1>{isRegistering ? "Criar Conta" : "Entrar"}</h1>
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
            {isRegistering ? "Cadastrar" : "Entrar"}
          </button>
          <p
            onClick={() => setIsRegistering(!isRegistering)}
            style={{
              cursor: "pointer",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            {isRegistering ? "Ir para Login" : "Criar conta"}
          </p>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="container" onClick={(e) => e.stopPropagation()}>
        <header>
          <h1>Task Streak Tracker</h1>
        </header>
        <button className="user-area" onClick={() => setMenuOpen(!menuOpen)}>
          {profilePic ? (
            <img src={profilePic} alt="Perfil" className="avatar-mini" />
          ) : (
            <User />
          )}
        </button>

        {menuOpen && (
          <div className="user-dropdown">
            <div className="user-info-header">
              <div className="avatar-container">
                {profilePic ? (
                  <img src={profilePic} className="avatar-large" alt="Perfil" />
                ) : (
                  <User size={30} />
                )}
              </div>
              <span>
                {formatUsername(localStorage.getItem("username") || "Usuário")}
              </span>
            </div>
            <button onClick={openSettings} className="settings-btn">
              <Settings size={15} /> Configurações
            </button>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={15} /> Sair
            </button>
          </div>
        )}
      </div>

      {view === "home" ? (
        <div className="main">
          <div className="taskCreator">
            <input
              type="text"
              placeholder="Nova tarefa..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <button onClick={handleCreateTask}>
              <Plus />
            </button>
          </div>
          <div className="task-list">
            {tasks.length === 0 ? (
              <p style={{ color: "gray" }}>
                Nenhuma chama acesa. Comece agora!
              </p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="task-card">
                  <div className="data">
                    <p style={{ fontWeight: "bold" }}>{task.title}</p>
                    <div className="streak-info">
                      <Flame size={16} color="#ff5722" />
                      <span>{task.streak} dias</span>
                    </div>
                  </div>
                  <div className="actions">
                    <button onClick={() => handleCheck(task.id)}>🔥</button>
                    <button onClick={() => handleDeleteTask(task.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <SettingsView
          onBack={() => setView("home")}
          profilePic={profilePic}
          setProfilePic={setProfilePic}
        />
      )}
    </>
  );
}

export default App;
