const GITHUB_USER = 'aleee4442';

// 1. FUNCIÓN PARA CAMBIAR ENTRE MODO CLARO Y OSCURO
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Cambiar el texto del botón
    const btn = document.getElementById('theme-toggle');
    btn.innerText = newTheme === 'dark' ? '[ LIGHT_MODE ]' : '[ DARK_MODE ]';
}

// Cargar el tema preferido del usuario al entrar
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
window.onload = () => {
    const btn = document.getElementById('theme-toggle');
    if(btn) btn.innerText = savedTheme === 'dark' ? '[ LIGHT_MODE ]' : '[ DARK_MODE ]';
}

// 2. CARGA DE REPOSITORIOS DE GITHUB
async function fetchRepos() {
    const container = document.getElementById('github-repos');
    const apiStatus = document.getElementById('api-status');

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`);
        if (!response.ok) throw new Error();

        const repos = await response.json();
        apiStatus.innerText = "ONLINE";

        container.innerHTML = "";
        repos.filter(r => !r.fork).forEach(repo => {
            const card = document.createElement('div');
            card.className = 'repo-card';
            card.onclick = () => window.open(repo.html_url, '_blank');
            card.innerHTML = `
                <h3>${repo.name.toUpperCase()}</h3>
                <p style="font-size: 0.85rem; color: #aaa; margin: 8px 0;">${repo.description || 'No description provided.'}</p>
                <span style="font-size: 0.75rem; color: var(--primary)">[ ${repo.language || 'Code'} ]</span>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        apiStatus.innerText = "OFFLINE_MODE";
        apiStatus.style.color = "orange";
        container.innerHTML = "<p>GitHub API limit reached or down. Visit my profile at github.com/aleee4442</p>";
    }
}

document.addEventListener('DOMContentLoaded', fetchRepos);