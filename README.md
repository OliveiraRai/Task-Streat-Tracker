<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
</head>
<body>
    <div align="center">
        <h1>🔥 Task Streak Tracker - V1.0</h1>
        <p><i>Transformando disciplina em chamas.</i></p>
        <img src="https://img.shields.io/github/repo-size/OliveiraRai/task-streak-tracker?style=for-the-badge" alt="Repo Size">
        <img src="https://img.shields.io/github/languages/count/OliveiraRai/task-streak-tracker?style=for-the-badge" alt="Languages">
    </div>

  <hr>
    <h2>🚀 Sobre o Projeto</h2>
    <p>
        O <b>Task Streak Tracker</b> é uma aplicação Full Stack focada em gamificação de hábitos. 
        Diferente de uma lista de tarefas comum, ele monitora a constância do usuário, recompensando o progresso diário com "chamas" (streaks) e protegendo a integridade dos dados com regras de negócio sólidas no Backend.
    </p>
    <h2>✨ Funcionalidades Principais</h2>
    <ul>
        <li><b>Controle de Ofensivas:</b> Lógica que impede múltiplos incrementos no mesmo dia e reseta a contagem caso um dia seja pulado.</li>
        <li><b>Autenticação Completa:</b> Sistema de Login e Registro seguro utilizando tokens via Django REST.</li>
        <li><b>Área do Usuário:</b> Menu dropdown personalizado com suporte a fotos de perfil via URL.</li>
        <li><b>Interface Adaptável:</b> Design responsivo com navegação fluida entre Home e Configurações.</li>
    </ul>
    <h2>🛠️ Tecnologias Utilizadas</h2>
    <table>
        <tr>
            <th>Frontend</th>
            <th>Backend</th>
        </tr>
        <tr>
            <td>React + TypeScript (Vite)</td>
            <td>Django + Django REST Framework</td>
        </tr>
        <tr>
            <td>Lucide React (Ícones)</td>
            <td>SQLite (Banco de Dados v1)</td>
        </tr>
        <tr>
            <td>Axios (API)</td>
            <td>CORS Headers (Segurança)</td>
        </tr>
    </table>
    <h2>📦 Como Instalar</h2>
        <h3>1. Backend</h3>
    <pre><code>
    cd backend
    python -m venv venv
    # Ativar venv e então:
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver
    </code></pre>

  <h3>2. Frontend</h3>
    <pre><code>
    cd frontend
    npm install
    npm run dev
    </code></pre>

  <h2>📝 Regras de Negócio (V1)</h2>
    <blockquote>
        <b>A regra de ouro:</b> O usuário só pode aumentar a "ofensiva" uma vez a cada 24 horas. Se passar de 48 horas sem clicar, o contador volta para 1 automaticamente no próximo check-in.
    </blockquote>
    <hr>
    <div align="center">
        <p>Desenvolvido com ☕ e 💻 por <b>Raí</b></p>
    </div>
</body>
</html>
