const GITHUB_USER = 'aleee4442'; // <--- CAMBIA ESTO

async function getRepos() {
    const repoContainer = document.getElementById('github-repos');
    
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=10`);
        const repos = await response.json();

        repoContainer.innerHTML = ''; // Limpiar el loading

        repos.forEach(repo => {
            // Solo mostrar repositorios que no sean forks
            if (!repo.fork) {
                const card = document.createElement('div');
                card.className = 'repo-card';
                card.onclick = () => window.open(repo.html_url, '_blank');

                card.innerHTML = `
                    <h3>${repo.name.toUpperCase()}</h3>
                    <p>${repo.description || 'Sin descripción disponible.'}</p>
                    <div style="margin-top: 10px;">
                        <span class="lang">${repo.language || 'Code'}</span>
                        <span style="float: right; font-size: 0.7rem;">⭐ ${repo.stargazers_count}</span>
                    </div>
                `;
                repoContainer.appendChild(card);
            }
        });
    } catch (error) {
        repoContainer.innerHTML = '<p class="error">>> ERROR: No se pudo conectar con el servidor central de GitHub.</p>';
        console.error(error);
    }
}

// Ejecutar al cargar la página
window.onload = getRepos;