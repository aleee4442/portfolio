const GITHUB_USER = 'aleee4442';

// ESCRIBE AQUÍ LOS NOMBRES DE TUS REPOS QUE QUIERES QUE SALGAN PRIMERO
const PRIORITY_REPOS = [
    'portfolio', // Ejemplo
    'lab'
];

async function fetchRepos() {
    const container = document.getElementById('github-repos');
    const status = document.getElementById('api-status');

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=50&sort=updated`);
        if (!response.ok) throw new Error("API_ERROR");

        let repos = await response.json();
        status.innerText = "CONNECTED";

        // Filtrar forks y ordenar por prioridad
        repos = repos.filter(r => !r.fork).sort((a, b) => {
            const indexA = PRIORITY_REPOS.indexOf(a.name);
            const indexB = PRIORITY_REPOS.indexOf(b.name);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return 0;
        });

        render(repos.slice(0, 12), container);
    } catch (e) {
        status.innerText = "OFFLINE_MODE";
        status.style.color = "orange";
        // Fallback: mostrar un mensaje si la API falla por la caída de hoy
        container.innerHTML = "<p>GitHub API is currently unstable. Please check my profile manually at github.com/aleee4442</p>";
    }
}

function render(repos, container) {
    container.innerHTML = "";
    repos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'repo-card';
        card.onclick = () => window.open(repo.html_url, '_blank');
        card.innerHTML = `
            <h3>${repo.name.toUpperCase()}</h3>
            <p>${repo.description || "Source code for security project."}</p>
            <span style="font-size:0.6rem; color: #00ff41;">[ ${repo.language || 'Documentation'} ]</span>
        `;
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', fetchRepos);