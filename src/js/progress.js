document.addEventListener('DOMContentLoaded', function () {
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
    const weeklyCompleted = document.getElementById('weekly-completed');
    const weeklyProgress = document.getElementById('weekly-progress');

    if (!objectivesList || !addObjectiveBtn) return;

    // Récupérer ou initialiser les objectifs
    let objectives = JSON.parse(localStorage.getItem('medlik_objectives')) || [];
    const allPractices = [
        {
            id: 'time-management',
            title: 'Gérer son temps pendant l\'épreuve',
            category: 'Techniques d\'examen',
            description: 'Optimisez votre temps le jour du concours',
            progress: 30,
            deadline: '30/01/2026',
            addedDate: '15/01/2026',
            completed: localStorage.getItem('medlik_time-management_completed') === 'true',
            source: 'practice'
        }
    ];

    loadAllObjectives();
    updateGlobalStats();
    setupEventListeners();

    function loadAllObjectives() {
        objectivesList.innerHTML = '';
        const allObjectives = [...objectives, ...getFollowedPractices()];
        if (allObjectives.length === 0) {
            showEmptyState();
            return;
        }

        allObjectives.forEach(obj => {
            const el = createObjectiveElement(obj);
            objectivesList.appendChild(el);
        });
    }

    function getFollowedPractices() {
        return allPractices.filter(p => localStorage.getItem(`medlik_${p.id}_following`) === 'true');
    }

    function createObjectiveElement(objective) {
        const completed = objective.completed || false;
        const div = document.createElement('div');
        div.className = 'objective-card';
        div.dataset.id = objective.id;
        div.dataset.source = objective.source || 'personal';

        div.innerHTML = `
            <div class="objective-header">
                <div>
                    <h3 class="objective-title">${obj.title}</h3>
                    <span class="objective-category">${obj.category}</span>
                </div>
                <div class="objective-actions">
                    <label>
                        <input type="checkbox" class="complete-checkbox" data-id="${objective.id}" data-source="${objective.source || 'personal'}" ${completed ? 'checked' : ''}>
                        Terminé
                    </label>
                    ${objective.source === 'practice' ? 
                        `<button class="delete-btn" data-id="${objective.id}">
                            <i class="fas fa-trash"></i>
                        </button>` : ''
                    }
                </div>
            </div>
            ${objective.description ? `<p class="objective-description">${objective.description}</p>` : ''}
            <div class="objective-progress">
                <div class="progress-label-small">
                    <span>Progression</span>
                    <span>${completed ? 100 : objective.progress}%</span>
                </div>
                <div class="progress-bar-small">
                    <div class="progress-fill-small" style="width: ${completed ? 100 : objective.progress}%"></div>
                </div>
            </div>
            <div class="objective-dates">
                <span><strong>Échéance:</strong> ${obj.deadline}</span>
                <span><strong>Ajouté le:</strong> ${obj.addedDate}</span>
            </div>
        `;
        return div;
    }

    function showEmptyState() {
        objectivesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox" style="font-size:3rem;color:#ccc;margin-bottom:1rem;"></i>
                <p>Aucun objectif pour le moment</p>
                <p style="color: #888; font-size: 0.9rem; margin-top: 0.5rem;">
                    Ajoutez des objectifs pour commencer le suivi
                </p>
            </div>
        `;
    }

    function updateGlobalStats() {
        const allObjectives = [...personalObjectives, ...getFollowedPractices()];
        const completed = allObjectives.filter(obj => obj.completed).length;
        const total = allObjectives.length;
        const avgProgress = total > 0 ? Math.round(allObjectives.reduce((sum, obj) => sum + (obj.completed ? 100 : obj.progress), 0) / total) : 0;

        completedObjectives.textContent = `${completed}/${total}`;
        averageProgress.textContent = `${avgProgress}%`;
        inprogressCount.textContent = total - completed;
        completedCount.textContent = completed;

        weeklyCompleted.textContent = completed;
        weeklyProgress.textContent = `${avgProgress}%`;

        updateProgressCircle(avgProgress);
        updateEncouragementMessage(completed, total, avgProgress);
        updateTrends();
    }

    function updateProgressCircle(percentage) {
        if (!progressCircle || !circlePercentage) return;
        circlePercentage.textContent = `${percentage}%`;
        progressCircle.style.background = `conic-gradient(#4CAF50 ${percentage}%, #f0f0f0 ${percentage}% 100%)`;
    }

    function updateEncouragementMessage(completed, total, avgProgress) {
        let message = '';
        if (completed === 0) message = `Vous n'avez encore complété aucun objectif.`;
        else if (completed === total) message = `Félicitations ! Tous vos objectifs sont complétés !`;
        else if (avgProgress < 30) message = `Continuez vos efforts, vous avez complété ${completed} sur ${total} objectifs.`;
        else if (avgProgress < 70) message = `Bon travail ! ${completed} objectifs complétés.`;
        else message = `Excellent ! Vous êtes presque au bout avec ${completed} objectifs complétés.`;

        encouragementText.textContent = message;
    }

    function updateTrends() {
        const randomTrend = Math.random() > 0.5 ? '+' : '-';
        const randomPercent = Math.floor(Math.random() * 15) + 1;
        progressTrend.textContent = `${randomTrend}${randomPercent}%`;
        progressTrend.style.color = randomTrend === '+' ? '#4CAF50' : '#f44336';

        const randomHours = Math.floor(Math.random() * 21) + 30;
        studyHours.textContent = `${randomHours}h`;
    }

    function setupEventListeners() {
        addObjectiveBtn.addEventListener('click', () => {
            const title = prompt('Titre de l’objectif :');
            if (!title) return;
            const newObj = {
                id: 'obj_' + Date.now(),
                title: title,
                category: 'Personnelle',
                description: '',
                progress: 0,
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                addedDate: new Date().toLocaleDateString(),
                completed: false,
                source: 'personal'
            };
            objectives.push(newObj);
            localStorage.setItem('medlik_objectives', JSON.stringify(objectives));
            loadAllObjectives();
            updateGlobalStats();
        });

        objectivesList.addEventListener('click', e => {
            const button = e.target.closest('.delete-btn');
            if (!button) return;
            const id = button.dataset.id;
            if (confirm('Voulez-vous supprimer cet objectif ?')) {
                objectives = objectives.filter(obj => obj.id !== id);
                localStorage.setItem('medlik_objectives', JSON.stringify(objectives));
                localStorage.removeItem(`medlik_${id}_following`);
                localStorage.removeItem(`medlik_${id}_completed`);
                loadAllObjectives();
                updateGlobalStats();
                showNotification('Objectif supprimé !');
            }
        });

        // Checkbox "Terminé" pour tous les objectifs
        objectivesList.addEventListener('change', e => {
            const checkbox = e.target.closest('.complete-checkbox');
            if (!checkbox) return;
            const id = checkbox.dataset.id;
            const source = checkbox.dataset.source;
            
            if (source === 'personal') {
                const objIndex = objectives.findIndex(o => o.id === id);
                if (objIndex > -1) {
                    objectives[objIndex].completed = checkbox.checked;
                    objectives[objIndex].progress = checkbox.checked ? 100 : 0;
                    localStorage.setItem('medlik_objectives', JSON.stringify(objectives));
                }
            } else if (source === 'practice') {
                const practiceIndex = allPractices.findIndex(p => p.id === id);
                if (practiceIndex > -1) {
                    allPractices[practiceIndex].completed = checkbox.checked;
                    localStorage.setItem(`medlik_${id}_completed`, checkbox.checked);
                }
            }
            updateGlobalStats();
            showNotification(`Objectif marqué ${checkbox.checked ? 'comme complété' : 'comme incomplet'}`);
        });

        window.addEventListener('storage', e => {
            if (e.key.startsWith('medlik_') && (e.key.endsWith('_following') || e.key.endsWith('_completed'))) {
                loadAllObjectives();
                updateGlobalStats();
            }
        });
    }

    function showNotification(msg) {
        const notif = document.createElement('div');
        notif.className = 'progress-notification';
        notif.innerHTML = `<i class="fas fa-check-circle"></i><strong>${msg}</strong>`;
        Object.assign(notif.style, {
            position: 'fixed', top: '20px', right: '20px',
            background: '#4CAF50', color: '#fff', padding: '1rem',
            borderRadius: '6px', zIndex: 1000, display: 'flex',
            alignItems: 'center', gap: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            animation: 'slideIn 0.3s ease-out'
        });
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }

    setInterval(updateGlobalStats, 5000);
    weeklyProgressSummary();
    setInterval(weeklyProgressSummary, 7 * 24 * 60 * 60 * 1000);

    function weeklyProgressSummary() {
        const allObjectives = [...objectives, ...getFollowedPractices()];
        const completed = allObjectives.filter(obj => obj.completed).length;
        const total = allObjectives.length;
        const avg = total > 0 ? Math.round(allObjectives.reduce((s, o) => s + (o.completed ? 100 : o.progress), 0) / total) : 0;
        showNotification(`Résumé hebdomadaire : ${completed}/${total} objectifs complétés, progression moyenne ${avg}%`);
    }
});
