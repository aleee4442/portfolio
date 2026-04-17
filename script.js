const GITHUB_USER = 'aleee4442';

// 1. Proyectos de respaldo (En caso de que la API falle o de Error 403)
const FALLBACK_REPOS = [
    {
        name: "Cybersecurity-Lab",
        description: "A collection of scripts and tools for security auditing and network analysis.",
        html_url: `https://github.com/${GITHUB_USER}`,
        language: "Python"
    },
    {
        name: "Main-Project-2",
        description: "Detailed description of your second most important project.",
        html_url: `https://github.com/${GITHUB_USER}`,
        language: "C++"
    }
];

async function fetchRepos() {
    const container = document.getElementById('github-repos');
    
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=10`);
        
        if (!response.ok) throw new Error(`API Status: ${response.status}`);

        const repos = await response.json();
        renderRepos(repos, container);

    } catch (error) {
        console.warn("GitHub API Limit reached or error. Loading fallback projects...", error);
        renderRepos(FALLBACK_REPOS, container, true);
    }
}

function renderRepos(repos, container, isFallback = false) {
    container.innerHTML = ''; 
    
    if (isFallback) {
        container.innerHTML = '<p style="color: #888; grid-column: 1/-1; margin-bottom: 10px;">[!] Note: Offline mode active. Showing featured projects.</p>';
    }

    repos.forEach(repo => {
        if (!repo.fork) {
            const card = document.createElement('div');
            card.className = 'repo-card';
            card.onclick = () => window.open(repo.html_url, '_blank');

            let desc = repo.description || "Source code and technical documentation.";
            if(desc.length > 85) desc = desc.substring(0, 82) + "...";

            card.innerHTML = `
                <h3>${repo.name.toUpperCase()}</h3>
                <p>${desc}</p>
                <div class="repo-footer">
                    <span class="repo-lang">[ ${repo.language || 'Code'} ]</span>
                    <span class="repo-link">VIEW_REPO >></span>
                </div>
            `;
            container.appendChild(card);
        }
    });
}

document.addEventListener('DOMContentLoaded', fetchRepos);