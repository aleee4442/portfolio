const GITHUB_USER = 'aleee4442'; // Confirmado: este es tu usuario

async function fetchRepos() {
    const container = document.getElementById('github-repos');
    
    console.log("Intentando conectar con GitHub para el usuario:", GITHUB_USER);

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`);
        
        if (!response.ok) {
            // Si la respuesta no es 200 OK, lanzamos error con el estado
            throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
        }

        const repos = await response.json();
        
        if (repos.length === 0) {
            container.innerHTML = `<p>>> No public repositories found.</p>`;
            return;
        }

        container.innerHTML = ''; // Limpiar mensaje de carga

        repos.forEach(repo => {
            // Filtramos para no mostrar forks, solo tus proyectos originales
            if (!repo.fork) {
                const card = document.createElement('div');
                card.className = 'repo-card';
                
                // Hacemos que toda la tarjeta sea clickable
                card.onclick = () => window.open(repo.html_url, '_blank');

                let desc = repo.description || "Project focused on system security and development.";
                if(desc.length > 80) desc = desc.substring(0, 77) + "...";

                card.innerHTML = `
                    <h3>${repo.name.toUpperCase()}</h3>
                    <p>${desc}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 10px; color: #00ff41; border: 1px solid #00ff41; padding: 2px 4px;">
                            ${repo.language || 'Markdown'}
                        </span>
                        <span style="font-size: 10px; opacity: 0.6;">VIEW_SOURCE >></span>
                    </div>
                `;
                container.appendChild(card);
            }
        });

        console.log("Repositorios cargados con éxito.");

    } catch (error) {
        console.error("Error detallado:", error);
        container.innerHTML = `
            <p style="color: #ff4444;">>> CONNECTION_ERROR</p>
            <p style="font-size: 0.8rem; color: #888;">Details: ${error.message}</p>
            <p style="font-size: 0.8rem; color: #888;">Try refreshing the page or check your internet connection.</p>
        `;
    }
}

// Asegurarse de que el DOM esté listo
document.addEventListener('DOMContentLoaded', fetchRepos);