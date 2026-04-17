const GITHUB_USER = 'aleee4442'; // Asegúrate de que este es tu usuario de GitHub

async function fetchRepos() {
    const container = document.getElementById('github-repos');
    
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`);
        
        if (!response.ok) {
            throw new Error('User not found');
        }

        const repos = await response.json();
        container.innerHTML = ''; // Limpiar mensaje de carga

        repos.forEach(repo => {
            if (!repo.fork) {
                const card = document.createElement('div');
                card.className = 'repo-card';
                card.onclick = () => window.open(repo.html_url, '_blank');

                // Formateamos un poco la descripción por si es muy larga
                let desc = repo.description || "Security related project and source code.";
                if(desc.length > 80) desc = desc.substring(0, 77) + "...";

                card.innerHTML = `
                    <h3>${repo.name.toUpperCase()}</h3>
                    <p>${desc}</p>
                    <span style="font-size: 10px; color: #00ff41;">[ ${repo.language || 'Plain Text'} ]</span>
                `;
                container.appendChild(card);
            }
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p style="color: red;">>> ERROR_CONNECTION_FAILED: GitHub API rejected the handshake. Check username or API limits.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', fetchRepos);