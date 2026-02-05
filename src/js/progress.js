// MP-7: Gestion de la page "Suivi de progression"
document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const objectivesList = document.getElementById('objectives-list');
    const addObjectiveBtn = document.getElementById('add-objective-btn');
    const studyHours = document.getElementById('study-hours');
    const completedObjectives = document.getElementById('completed-objectives');
    const averageProgress = document.getElementById('average-progress');
    const inprogressCount = document.getElementById('inprogress-count');
    const encouragementText = document.getElementById('encouragement-text');
    const completedCount = document.getElementById('completed-count');
    const progressCircle = document.getElementById('progress-circle');
    const circlePercentage = document.getElementById('circle-percentage');
    const progressTrend = document.getElementById('progress-trend');
    
    // Données des objectifs (normalement viendraient d'une API)
    const objectives = [
        {
            id: 'weekly-planning',
            title: 'Établir un planning hebdomadaire',
            category: 'Organisation & Planning',
            description: 'Créez un calendrier de révision réaliste et adapté à votre rythme',
            progress: 0,
            deadline: '02/02/2026',
            addedDate: '03/01/2026',
            completed: false
        },
        {
            id: 'previous-years',
            title: 'Travailler les annales des années précédentes',
            category: 'Organisation & Planning',
            description: '',
            progress: 0,
            deadline: '15/02/2026',
            addedDate: '10/01/2026',
            completed: false
        }
    ];
    
    // Objectifs suivis depuis les bonnes pratiques
    const followedPractices = [
        {
            id: 'time-management',
            title: 'Gérer son temps pendant l\'épreuve',
            category: 'Techniques d\'examen',
            description: 'Optimisez votre temps le jour du concours',
            progress: 30,
            deadline: '30/01/2026',
            addedDate: '15/01/2026',
            completed: false,
            source: 'practice'
        }
    ];
    
    // Initialisation
    loadAllObjectives();
    updateGlobalStats();
    setupEventListeners();
    
    // Charger tous les objectifs
    function loadAllObjectives() {
        objectivesList.innerHTML = '';
        
        // Combiner objectifs personnels et pratiques suivies
        const allObjectives = [...objectives, ...getFollowedPractices()];
        
        if (allObjectives.length === 0) {
            showEmptyState();
            return;
        }
        
        // Afficher chaque objectif
        allObjectives.forEach(objective => {
            const objectiveElement = createObjectiveElement(objective);
            objectivesList.appendChild(objectiveElement);
        });
    }
    
    // Récupérer les pratiques suivies depuis localStorage
    function getFollowedPractices() {
        const followed = [];
        const practiceIds = ['time-management'];
        
        practiceIds.forEach(practiceId => {
            if (localStorage.getItem(`medlik_${practiceId}_following`) === 'true') {
                followed.push({
                    id: practiceId,
                    title: 'Gérer son temps pendant l\'épreuve',
                    category: 'Techniques d\'examen',
                    description: 'Optimisez votre temps le jour du concours',
                    progress: 30,
                    deadline: '30/01/2026',
                    addedDate: '15/01/2026',
                    completed: false,
                    source: 'practice'
                });
            }
        });
        
        return followed;
    }
    
    // Créer l'élément HTML pour un objectif
    function createObjectiveElement(objective) {
        const div = document.createElement('div');
        div.className = 'objective-card';
        div.dataset.id = objective.id;
        div.dataset.source = objective.source || 'personal';
        
        div.innerHTML = `
            <div class="objective-header">
                <div>
                    <h3 class="objective-title">${objective.title}</h3>
                    <span class="objective-category">${objective.category}</span>
                </div>
                ${objective.source === 'practice' ? 
                    `<button class="delete-btn" data-id="${objective.id}">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>` : 
                    ''
                }
            </div>
            
            ${objective.description ? 
                `<p class="objective-description">${objective.description}</p>` : 
                ''
            }
            
            <div class="objective-progress">
                <div class="progress-label-small">
                    <span>Progression</span>
                    <span>${objective.progress}%</span>
                </div>
                <div class="progress-bar-small">
                    <div class="progress-fill-small" style="width: ${objective.progress}%"></div>
                </div>
            </div>
            
            <div class="objective-dates">
                <span><strong>Échéance:</strong> ${objective.deadline}</span>
                <span><strong>Ajouté le:</strong> ${objective.addedDate}</span>
            </div>
        `;
        
        return div;
    }
    
    // État vide
    function showEmptyState() {
        objectivesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <p>Aucun objectif pour le moment</p>
                <p style="color: #888; font-size: 0.9rem; margin-top: 0.5rem;">
                    Ajoutez des bonnes pratiques à vos objectifs pour les voir apparaître ici
                </p>
            </div>
        `;
    }
    
    // Mettre à jour les stats globales
    function updateGlobalStats() {
        const allObjectives = [...objectives, ...getFollowedPractices()];
        const completed = allObjectives.filter(obj => obj.completed).length;
        const total = allObjectives.length;
        const totalProgress = allObjectives.reduce((sum, obj) => sum + obj.progress, 0);
        const avgProgress = total > 0 ? Math.round(totalProgress / total) : 0;
        
        // Mettre à jour l'interface
        completedObjectives.textContent = `${completed}/${total}`;
        averageProgress.textContent = `${avgProgress}%`;
        inprogressCount.textContent = total;
        completedCount.textContent = completed;
        
        // Cercle de progression
        updateProgressCircle(avgProgress);
        
        // Message d'encouragement
        updateEncouragementMessage(completed, total, avgProgress);
        
        // Tendances (simulation)
        updateTrends();
    }
    
    // Mettre à jour le cercle de progression
    function updateProgressCircle(percentage) {
        circlePercentage.textContent = `${percentage}%`;
        progressCircle.style.background = `conic-gradient(#4CAF50 ${percentage}%, #f0f0f0 ${percentage}% 100%)`;
    }
    
    // Mettre à jour le message d'encouragement
    function updateEncouragementMessage(completed, total, avgProgress) {
        let message = '';
        
        if (completed === 0) {
            message = `Vous avez ${completed} objectif complété. La régularité est la clé de la réussite !`;
        } else if (completed === total) {
            message = `Félicitations ! Vous avez complété tous vos ${total} objectifs !`;
        } else if (avgProgress < 30) {
            message = `Continuez vos efforts ! Vous avez ${completed} objectif complété sur ${total}.`;
        } else if (avgProgress < 70) {
            message = `Bon travail ! Vous avez ${completed} objectif complété. Continuez sur cette lancée !`;
        } else {
            message = `Excellent ! Vous avez ${completed} objectif complété. Vous êtes presque au bout !`;
        }
        
        encouragementText.innerHTML = message;
    }
    
    // Simuler les tendances
    function updateTrends() {
        // Simulation de données
        const randomTrend = Math.random() > 0.5 ? '+' : '-';
        const randomPercent = Math.floor(Math.random() * 15) + 1;
        progressTrend.textContent = `${randomTrend}${randomPercent}%`;
        progressTrend.style.color = randomTrend === '+' ? '#4CAF50' : '#f44336';
        
        // Simuler les heures d'étude (entre 30 et 50h)
        const randomHours = Math.floor(Math.random() * 21) + 30;
        studyHours.textContent = `${randomHours}h`;
    }
    
    // Configurer les événements
    function setupEventListeners() {
        // Bouton "Ajouter"
        addObjectiveBtn.addEventListener('click', function() {
            alert('Fonctionnalité "Ajouter un objectif" - À implémenter dans une future version');
        });
        
        // Délégation d'événements pour les boutons de suppression
        objectivesList.addEventListener('click', function(e) {
            if (e.target.closest('.delete-btn')) {
                const button = e.target.closest('.delete-btn');
                const objectiveId = button.dataset.id;
                deleteObjective(objectiveId);
            }
        });
        
        // Écouter les changements dans localStorage (pour les pratiques suivies)
        window.addEventListener('storage', function(e) {
            if (e.key.startsWith('medlik_') && e.key.endsWith('_following')) {
                loadAllObjectives();
                updateGlobalStats();
            }
        });
    }
    
    // Supprimer un objectif (MP-6 & MP-7)
    function deleteObjective(objectiveId) {
        if (confirm('Voulez-vous vraiment supprimer cet objectif de votre suivi ?')) {
            // Supprimer de localStorage (pour les pratiques suivies)
            localStorage.removeItem(`medlik_${objectiveId}_following`);
            
            // Afficher une notification
            showNotification('Objectif supprimé avec succès !');
            
            // Recharger la liste
            loadAllObjectives();
            updateGlobalStats();
        }
    }
    // Rappel quotidien pour compléter les pratiques non complétées
function reminderForIncompletePractices() {
    const incomplete = getFollowedPractices().filter(p => !p.completed);
    if (incomplete.length > 0) {
        showNotification(`Vous avez ${incomplete.length} pratique(s) à compléter aujourd'hui !`);
    }
}
// Rappel quotidien pour compléter les pratiques non complétées
reminderForIncompletePractices(); // Appel immédiat au chargement
setInterval(reminderForIncompletePractices, 24 * 60 * 60 * 1000); // Vérification toutes les 24h

    
    // Notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f44336;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 6px;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                animation: slideIn 0.3s ease-out;
            ">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>${message}</strong>
                    <div style="font-size: 0.9rem; opacity: 0.9; margin-top: 0.25rem;">
                        Votre progression a été mise à jour
                    </div>
                </div>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
                if (document.head.contains(style)) {
                    document.head.removeChild(style);
                }
            }, 300);
        }, 3000);
    }
    
    // Vérifier périodiquement les mises à jour
    setInterval(updateGlobalStats, 5000);
});