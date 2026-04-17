const GITHUB_USER = 'aleee4442';

// PROYECTOS MANUALES (Plan B)
// Mientras GitHub arregla sus servidores, pon aquí tus 3 proyectos más importantes.
const LOCAL_PROJECTS = [
    {
        name: "Network-Scanner-Tool",
        description: "Automated Python script for network discovery and port vulnerability assessment.",
        html_url: "https://github.com/aleee4442/tu-repo-1",
        language: "Python"
    },
    {
        name: "Security-Audit-Scripts",
        description: "Bash scripts collection for Linux system hardening and log analysis.",
        html_url: "https://github.com/aleee4442/tu-repo-2",
        language: "Shell"
    },
    {
        name: "Encryption-Algorithm-Study",
        description: "Analysis and implementation of AES and RSA encryption methods in C++.",
        html_url: "https://github.com/aleee4442/tu-repo-3",
        language: "C++"
    }
];

async function initTerminal() {
    const container = document.getElementById('github-repos');
    const statusText = document.getElementById('api-status');
    
    try {
        statusText.innerText = "ATTEMPTING_CONNECTION...";
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated`);
        
        if (!response.ok) throw new Error("GitHub_Infrastructure_Degraded");

        const repos = await response.json();
        statusText.innerText = "CONNECTION_ESTABLISHED";
        renderRepos(repos, container);

    } catch (error) {
        console.error("Incident detected:", error);
        statusText.innerText = "CRITICAL_ERROR: GITHUB_API_DOWN";
        statusText.style.color = "#ff4444";
        
        // Cargar proyectos locales si la API falla
        renderRepos(LOCAL_PROJECTS, container, true);
    }
}

function renderRepos(repos, container, isFallback = false) {
    container.innerHTML = ''; 
    
    if (isFallback) {
        const warning = document.createElement('p');
        warning.style.color = "#ffaa00";
        warning.style.gridColumn = "1/-1";
        warning.innerText = "[!] OFFLINE_MODE: GitHub API is experiencing issues. Loading local repository cache...";
        container.appendChild(warning);
    }

    repos.slice(0, 9).forEach(repo => {
        if (!repo.fork) {
            const card = document.createElement('div');
            card.className = 'repo-card';
            card.onclick = () => window.open(repo.html_url, '_blank');

            card.innerHTML = `
                <div class="repo-header">
                    <span class="folder">📁</span>
                    <h3>${repo.name.toUpperCase()}</h3>
                </div>
                <p>${repo.description || "Project documentation and source code available on GitHub."}</p>
                <div class="repo-footer">
                    <span class="repo-lang">${repo.language || 'Documentation'}</span>
                    <span class="repo-link">ACCESS_FILE >></span>
                </div>
            `;
            container.appendChild(card);
        }
    });
}

document.addEventListener('DOMContentLoaded', initTerminal);