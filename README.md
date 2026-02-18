# 🔥 Task Streak Tracker

Uma aplicação **Full Stack** para gerenciamento de tarefas e hábitos, focada em produtividade e consistência. O sistema permite que múltiplos usuários gerenciem suas próprias tarefas de forma isolada.

## 🚀 Funcionalidades Atuais

* **Sistema de Usuários:** Cadastro de novas contas e login seguro via Token.
* **Isolamento de Dados:** Cada usuário visualiza e gerencia apenas as suas próprias tarefas.
* **Gestão de Tasks:** Criar, listar e excluir tarefas.
* **Contador de Streaks:** Acompanhamento dinâmico da sequência de conclusão.
* **Dashboard:** Visualização de estatísticas (total de tarefas e maior streak).

## 🛠️ Tecnologias Utilizadas

### Frontend
* **React** (com TypeScript)
* **Vite** (Build tool)
* **Axios** (Consumo de API)

### Backend
* **Python 3**
* **Django** & **Django REST Framework**
* **SQLite** (Banco de dados)
* **Token Authentication** (Segurança)

---

## 📦 Como Rodar o Projeto

### 1. Backend (Django)
```bash
# Entre na pasta do backend
cd backend

# Execute as migrações
python manage.py migrate

# Inicie o servidor
python manage.py runserver
