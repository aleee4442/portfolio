const GITHUB_USER = 'aleee4442';

/** 
 * CONFIGURACIÓN DE PRIORIDADES
 * Escribe aquí el nombre EXACTO de tus repositorios de GitHub 
 * en el orden en que quieres que aparezcan.
 */
const PRIORITY_REPOS = [
    'lab', 
    'password-generator',
    'MIPS_processor'
];

// PROYECTOS LOCALES (Fallback por si GitHub falla)
const LOCAL_PROJECTS = [
    {
        name: "Security-Hardening-Tool",
        description: "Custom scripts for automated Linux server hardening and audit.",
        html_url: `https://github.com/${GITHUB_USER}`,
        language: "Bash"
    },
    {
        name: "Python-Nmap-Scanner",
        description: "A multithreaded network scanner with vulnerability detection.",
        html_url: `https://github.com/${GITHUB_USER}`,
        language: "Python"
    }
];

async function initTerminal() {
    const container = document.getElementById('github-repos');
    const statusText = document.getElementById('api-status');
    
    try {
        statusText.innerText = "HANDSHAKE_INITIATED...";
        // Pedimos más repositorios (ej. 30) para poder filtrar y ordenar bien
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=30&sort=updated`);
        
        if (!response.ok) throw new Error("API_LIMIT_OR_DOWN");

        let repos = await response.json();
        statusText.innerText = "SUCCESS: DATA_FETCHED";

        // 1. Filtrar para quitar los que son forks
        repos = repos.filter(repo => !repo.fork);

        // 2. Lógica de Ordenación Custom
        repos.sort((a, b) => {
            const indexA = PRIORITY_REPOS.indexOf(a.name);
            const indexB = PRIORITY_REPOS.indexOf(b.name);

            // Si ambos están en la lista de prioridad, respetar el orden de la lista
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            // Si solo A está en la lista, ponerlo primero
            if (indexA !== -1) return -1;
            // Si solo B está en la lista, ponerlo primero
            if (indexB !== -1) return 1;
            // Si ninguno está en la lista, ordenar por estrellas (o fecha)
            return b.stargazers_count - a.stargazers_count;
        });

        renderRepos(repos, container);

    } catch (error) {
        console.error("Connection error:", error);
        statusText.innerText = "ERROR: OFFLINE_MODE_ACTIVE";
        statusText.style.color = "#ff4444";
        renderRepos(LOCAL_PROJECTS, container, true);
    }
}

function renderRepos(repos, container, isFallback = false) {
    container.innerHTML = ''; 
    
    // Si quieres mostrar todos, quita el .slice(0, 12)
    // He puesto 12 porque suele quedar bien en cuadrículas de 3 en 3.
    repos.slice(0, 12).forEach(repo => {
        const card = document.createElement('div');
        card.className = 'repo-card';
        
        // Si el repo es de prioridad, le añadimos una clase especial por si quieres destacarlo visualmente
        if (PRIORITY_REPOS.includes(repo.name)) {
            card.classList.add('featured');
        }

        card.onclick = () => window.open(repo.html_url, '_blank');

        card.innerHTML = `
            <div class="repo-header">
                <span class="folder">${PRIORITY_REPOS.includes(repo.name) ? '⭐' : '📁'}</span>
                <h3>${repo.name.toUpperCase()}</h3>
            </div>
            <p>${repo.description || "Technical project related to computer science and security."}</p>
            <div class="repo-footer">
                <span class="repo-lang">[ ${repo.language || 'Code'} ]</span>
                <span class="repo-link">OPEN_SOURCE >></span>
            </div>
        `;
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', initTerminal);