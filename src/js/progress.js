
// MP-7 amélioré avec intégration dynamique des bonnes pratiques
document.addEventListener('DOMContentLoaded', function() {

    /* ===================== DOM ===================== */
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

    /* ===================== DATA ===================== */
    const personalObjectives = [
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

    /* ===================== INIT ===================== */
    loadAllObjectives();
    updateGlobalStats();
    setupEventListeners();

    /* ===================== FONCTIONS ===================== */

    // Charger tous les objectifs (personnels + pratiques suivies)
    function loadAllObjectives() {
        objectivesList.innerHTML = '';
        const allObjectives = [...personalObjectives, ...getFollowedPractices()];

        if(allObjectives.length === 0){
            showEmptyState();
            return;
        }

        allObjectives.forEach(obj => {
            const element = createObjectiveElement(obj);
            objectivesList.appendChild(element);
        });
    }

    // Récupérer dynamiquement les pratiques suivies
    function getFollowedPractices() {
        const followedIds = JSON.parse(localStorage.getItem('medlik_followed_practices')) || [];
        return followedIds.map(id => ({
            id,
            title: id === 'time-management' ? 'Gérer son temps pendant l\'épreuve' : id,
            category: 'Techniques d\'examen',
            description: 'Optimisez votre temps le jour du concours',
            progress: 30,
            deadline: '30/01/2026',
            addedDate: '15/01/2026',
            completed: false,
            source: 'practice'
        }));
    }

    // Créer élément HTML objectif
    function createObjectiveElement(obj) {
        const div = document.createElement('div');
        div.className = 'objective-card';
        div.dataset.id = obj.id;
        div.dataset.source = obj.source || 'personal';

        div.innerHTML = `
            <div class="objective-header">
                <div>
                    <h3 class="objective-title">${obj.title}</h3>
                    <span class="objective-category">${obj.category}</span>
                </div>
                ${obj.source === 'practice' ? 
                    `<button class="delete-btn" data-id="${obj.id}">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>` : ''
                }
            </div>
            ${obj.description ? `<p class="objective-description">${obj.description}</p>` : ''}
            <div class="objective-progress">
                <div class="progress-label-small">
                    <span>Progression</span>
                    <span>${obj.progress}%</span>
                </div>
                <div class="progress-bar-small">
                    <div class="progress-fill-small" style="width: ${obj.progress}%"></div>
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
                <p style="color:#888;font-size:0.9rem;margin-top:0.5rem;">
                    Ajoutez des bonnes pratiques pour les voir apparaître ici
                </p>
            </div>
        `;
    }

    // Mettre à jour les stats globales
    function updateGlobalStats() {
        const allObjectives = [...personalObjectives, ...getFollowedPractices()];
        const completed = allObjectives.filter(obj => obj.completed).length;
        const total = allObjectives.length;
        const avgProgress = total > 0 ? Math.round(allObjectives.reduce((sum,o)=>sum+o.progress,0)/total) : 0;

        completedObjectives.textContent = `${completed}/${total}`;
        averageProgress.textContent = `${avgProgress}%`;
        inprogressCount.textContent = total - completed;
        completedCount.textContent = completed;

        updateProgressCircle(avgProgress);
        updateEncouragementMessage(completed,total,avgProgress);
        updateTrends();
    }

    function updateProgressCircle(percent){
        circlePercentage.textContent = `${percent}%`;
        progressCircle.style.background = `conic-gradient(#4CAF50 ${percent}%, #f0f0f0 ${percent}% 100%)`;
    }

    function updateEncouragementMessage(completed,total,avg){
        let msg='';
        if(completed===0) msg=`Vous avez ${completed} objectif complété. La régularité est la clé !`;
        else if(completed===total) msg=`Félicitations ! Vous avez complété tous vos ${total} objectifs !`;
        else if(avg<30) msg=`Continuez vos efforts ! ${completed} objectif(s) complété(s) sur ${total}.`;
        else if(avg<70) msg=`Bon travail ! ${completed} objectif(s) complété(s).`;
        else msg=`Excellent ! ${completed} objectif(s) complété(s). Vous êtes presque au bout !`;
        encouragementText.innerHTML = msg;
    }

    function updateTrends(){
        const randomTrend = Math.random()>0.5?'+':'-';
        const randomPercent = Math.floor(Math.random()*15)+1;
        progressTrend.textContent = `${randomTrend}${randomPercent}%`;
        progressTrend.style.color = randomTrend==='+'?'#4CAF50':'#f44336';
        const randomHours = Math.floor(Math.random()*21)+30;
        studyHours.textContent = `${randomHours}h`;
    }

    function setupEventListeners(){
        addObjectiveBtn.addEventListener('click',()=>alert('Ajouter objectif - À implémenter'));

        objectivesList.addEventListener('click',e=>{
            if(e.target.closest('.delete-btn')){
                const id = e.target.closest('.delete-btn').dataset.id;
                deletePracticeObjective(id);
            }
        });

        // Écoute des changements dans localStorage
        window.addEventListener('storage', e=>{
            if(e.key==='medlik_followed_practices'){
                loadAllObjectives();
                updateGlobalStats();
            }
        });
    }

    function deletePracticeObjective(id){
        if(confirm('Voulez-vous vraiment supprimer cet objectif ?')){
            const practices = JSON.parse(localStorage.getItem('medlik_followed_practices')) || [];
            const idx = practices.indexOf(id);
            if(idx!==-1) practices.splice(idx,1);
            localStorage.setItem('medlik_followed_practices',JSON.stringify(practices));
            showNotification('Objectif supprimé avec succès !');
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
                position:fixed;top:20px;right:20px;
                background:#4CAF50;color:white;padding:1rem 1.5rem;
                border-radius:6px;display:flex;align-items:center;gap:10px;
                z-index:1000;box-shadow:0 4px 12px rgba(0,0,0,0.2);
                animation:slideIn 0.3s ease-out;">
                <i class="fas fa-check-circle"></i>
                <div><strong>${msg}</strong></div>
            </div>
        `;
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {from {transform:translateX(100%);opacity:0;} to{transform:translateX(0);opacity:1;}}
            @keyframes slideOut {from{transform:translateX(0);opacity:1;} to{transform:translateX(100%);opacity:0;}}
        `;
        document.head.appendChild(style);
        document.body.appendChild(notif);
        setTimeout(()=>{
            notif.style.animation='slideOut 0.3s ease-out';
            setTimeout(()=>{notif.remove();style.remove();},300);
        },3000);
    }

    // Mise à jour périodique
    setInterval(updateGlobalStats,5000);

});

