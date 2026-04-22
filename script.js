const GITHUB_USER = 'aleee4442';

// 1. Manejo de Temas
function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
}

// Cargar tema guardado
const savedTheme = localStorage.getItem('theme') || 'green';
setTheme(savedTheme);

// 2. Carga de Repositorios (Con tu usuario real)
async function fetchRepos() {
    const container = document.getElementById('github-repos');
    const apiStatus = document.getElementById('api-status');

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`);
        if (!response.ok) throw new Error();

        const repos = await response.json();
        apiStatus.innerText = "ONLINE";
        apiStatus.style.color = "var(--primary)";

        container.innerHTML = "";
        repos.filter(r => !r.fork).forEach(repo => {
            const card = document.createElement('div');
            card.className = 'repo-card';
            card.onclick = () => window.open(repo.html_url, '_blank');
            card.innerHTML = `
                <h3>${repo.name.toUpperCase()}</h3>
                <p style="font-size: 0.9rem; color: #aaa; margin: 10px 0;">${repo.description || 'No description provided.'}</p>
                <span style="font-size: 0.7rem; color: var(--primary)">[ ${repo.language || 'Binary'} ]</span>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        apiStatus.innerText = "OFFLINE_MODE";
        container.innerHTML = "<p>GitHub API limit reached. Visit my profile at github.com/aleee4442</p>";
    }
}

document.addEventListener('DOMContentLoaded', fetchRepos);