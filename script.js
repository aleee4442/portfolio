// const GITHUB_USER = 'GITHUB_USER';

/**
 * CONFIGURACIÓN DE FILTROS MANUALES
 * Escribe la skill exactamente como está en el HTML y 
 * añade la lista de nombres de tus repositorios de GitHub.
 */
const SKILL_MAP = {
    "Network Security": ["network-scanner", "lab"],
    "Security Tools": ["password-generator"],
    "Python": [
        "desafio-flip",
        "desafio_mnsit",
        "IA_P3_CIFAR10_Gonzalo_Millon",
        "WORM-Integrity",
        "ai-product-ops-de-modelo-a-sistema"
    ],
    "Rust": ["App-banco-Rust", "Safe Password Generator"],
    "C": ["Juego_oca_c"],
    "Assembly": ["MIPS_processor"],
    "Flet": ["Memorama_flet", "Calculadora_flet", "qr-generator"],
    "Bash": ["apuntes"],
    "Java": ["microdsi-m2s10-alejandro-gonzalo"],
    "Web Scraping": ["web-scraping"]
};

let allRepos = [];
let activeSkills = new Set();

async function fetchRepos() {
    const container = document.getElementById('github-repos');
    const apiStatus = document.getElementById('api-status');

    try {
        const response = await fetch(`https://api.github.com/users/aleee4442/repos?sort=updated&per_page=50`);
        if (!response.ok) throw new Error();

        allRepos = await response.json();
        allRepos = allRepos.filter(r => !r.fork); // Solo tus proyectos
        
        apiStatus.innerText = "ONLINE";
        renderRepos(allRepos); // Render inicial con todos
    } catch (e) {
        apiStatus.innerText = "OFFLINE";
        container.innerHTML = "<p>Error loading GitHub API.</p>";
    }
}

function renderRepos(reposToRender) {
    const container = document.getElementById('github-repos');
    container.innerHTML = "";

    if (reposToRender.length === 0) {
        container.innerHTML = "<p style='color: #666;'>// No projects found for this skill combination.</p>";
        return;
    }

    // Si no hay nada filtrado, solo mostramos los 12 más recientes
    const list = activeSkills.size === 0 ? reposToRender.slice(0, 12) : reposToRender;

    list.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'repo-card';
        card.onclick = () => window.open(repo.html_url, '_blank');
        card.innerHTML = `
            <h3>${repo.name.toUpperCase()}</h3>
            <p>${repo.description || 'Professional security project and source code.'}</p>
            <span style="font-size: 0.7rem; color: var(--primary)">[ ${repo.language || 'Code'} ]</span>
        `;
        container.appendChild(card);
    });
}

// Lógica de filtrado
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
        const skill = tag.getAttribute('data-skill');

        // Toggle Skill activa
        if (activeSkills.has(skill)) {
            activeSkills.delete(skill);
            tag.classList.remove('active');
        } else {
            activeSkills.add(skill);
            tag.classList.add('active');
        }

        // Filtrar
        if (activeSkills.size === 0) {
            renderRepos(allRepos); // Volver a los 12 default
        } else {
            // Buscamos los nombres de repos que coincidan con las skills seleccionadas
            let filteredNames = new Set();
            activeSkills.forEach(s => {
                if (SKILL_MAP[s]) {
                    SKILL_MAP[s].forEach(repoName => filteredNames.add(repoName));
                }
            });

            const filteredRepos = allRepos.filter(repo => filteredNames.has(repo.name));
            renderRepos(filteredRepos);
        }
    });
});

document.addEventListener('DOMContentLoaded', fetchRepos);