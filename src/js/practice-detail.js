// MP-4, MP-6, MP-7: Gestion complète des bonnes pratiques
document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const followBtn = document.getElementById('follow-btn');
    const progressFill = document.getElementById('progress-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    const progressCount = document.getElementById('progress-count');
    const followedCount = document.getElementById('followed-count');
    const inprogressCount = document.getElementById('inprogress-count');
    const remainingCount = document.getElementById('remaining-count');
    const progressMessage = document.getElementById('progress-message');

    // Configuration
    const PRACTICE_ID = 'time-management';
    const TOTAL_PRACTICES = 10;
    const IN_PROGRESS_PRACTICES = 3;

    // État initial
    let isFollowing = localStorage.getItem(`medlik_${PRACTICE_ID}_following`) === 'true';

    // Initialisation
    initializePage();

    // Gestion du clic sur le bouton Ajouter/Retirer
    followBtn.addEventListener('click', function () {
    const wasFollowing = isFollowing;
    isFollowing = !isFollowing;

    if (isFollowing) {
        localStorage.setItem(`medlik_${PRACTICE_ID}_following`, 'true');
        addPracticeToProgression(); //  MP-5 AUTO
    } else {
        let practices =
    JSON.parse(localStorage.getItem('medlik_followed_practices')) || [];

practices = practices.filter(p => p.id !== PRACTICE_ID);

localStorage.setItem(
    'medlik_followed_practices',
    JSON.stringify(practices)
);

localStorage.removeItem(`medlik_${PRACTICE_ID}_following`); //  MP-5 AUTO
    }

    updateButtonState();
    updateProgression();
    showNotification(wasFollowing);
});

    // Initialisation de la page
    function initializePage() {
        updateButtonState();
        simulateProgressData();
        updateProgression();
        setupBenefitsCheckboxes();
    }

    // Mise à jour du bouton Ajouter/Retirer
    function updateButtonState() {
        if (isFollowing) {
            followBtn.innerHTML = '<i class="fas fa-times-circle"></i> Retirer de mes objectifs';
            followBtn.classList.add('active');
            followBtn.title = "Cliquez pour retirer cette bonne pratique de vos objectifs";
        } else {
            followBtn.innerHTML = '<i class="far fa-bookmark"></i> Ajouter à mes objectifs';
            followBtn.classList.remove('active');
            followBtn.title = "Cliquez pour ajouter cette bonne pratique à vos objectifs";
        }
    }

    function addPracticeToProgression() {
    const practices =
        JSON.parse(localStorage.getItem('medlik_followed_practices')) || [];

    const exists = practices.some(p => p.id === PRACTICE_ID);
    if (exists) return;

    practices.push({
        id: PRACTICE_ID,
        title: "Gérer son temps pendant l'épreuve",
        category: "Techniques d'examen",
        description: "Optimisez votre temps le jour du concours",
        progress: 0,
        deadline: "30/01/2026",
        addedDate: new Date().toLocaleDateString('fr-FR'),
        completed: false,
        source: "practice"
    });

    localStorage.setItem(
        'medlik_followed_practices',
        JSON.stringify(practices)
    );
}

    // Mise à jour de la progression
    function updateProgression() {
        const followed = getFollowedPracticesCount();
        const inProgress = IN_PROGRESS_PRACTICES;
        const remaining = TOTAL_PRACTICES - followed - inProgress;
        const percentage = Math.round((followed / TOTAL_PRACTICES) * 100);

        updateProgressBar(percentage);
        updateProgressStats(followed, inProgress, remaining, percentage);
        updateProgressMessage(followed, percentage);
        animateProgressUpdate();
    }

    // Simulation des données pour démo
    function simulateProgressData() {
        if (!localStorage.getItem('medlik_progress_simulated')) {
            // Simuler 3 autres pratiques suivies
            localStorage.setItem('medlik_practice_1_following', 'true');
            localStorage.setItem('medlik_practice_3_following', 'true');
            localStorage.setItem('medlik_practice_5_following', 'true');
            localStorage.setItem('medlik_progress_simulated', 'true');
        }
    }

    // Compter le nombre de pratiques suivies
    function getFollowedPractices() {
    return JSON.parse(
        localStorage.getItem('medlik_followed_practices')
    ) || [];
}


    // Mettre à jour la barre de progression
    function updateProgressBar(percentage) {
        progressFill.style.width = `${percentage}%`;
        progressPercentage.textContent = `${percentage}%`;

        if (percentage < 30) {
            progressFill.style.background = 'linear-gradient(90deg, #f44336, #e53935)';
        } else if (percentage < 70) {
            progressFill.style.background = 'linear-gradient(90deg, #ff9800, #fb8c00)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
        }
    }

    // Mettre à jour les statistiques
    function updateProgressStats(followed, inProgress, remaining, percentage) {
        followedCount.textContent = followed;
        inprogressCount.textContent = inProgress;
        remainingCount.textContent = remaining;
        progressCount.textContent = `${followed} sur ${TOTAL_PRACTICES} bonnes pratiques suivies`;
    }

    // Message selon la progression
    function updateProgressMessage(followed, percentage) {
        let message = '';
        let icon = 'fas fa-info-circle';

        if (followed === 0) {
            message = 'Commencez par ajouter des bonnes pratiques à vos objectifs';
            icon = 'fas fa-rocket';
        } else if (percentage < 30) {
            message = 'Bon début ! Continuez à ajouter des bonnes pratiques';
            icon = 'fas fa-seedling';
        } else if (percentage < 70) {
            message = 'Belle progression ! Vous êtes sur la bonne voie';
            icon = 'fas fa-chart-line';
        } else {
            message = 'Excellent ! Vous maîtrisez la plupart des bonnes pratiques';
            icon = 'fas fa-trophy';
        }

        progressMessage.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
    }

    // Animation lors de la mise à jour
    function animateProgressUpdate() {
        progressFill.classList.add('progress-updated');
        setTimeout(() => {
            progressFill.classList.remove('progress-updated');
        }, 500);

        const detailCards = document.querySelectorAll('.detail-card');
        detailCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 150);
            }, index * 100);
        });
    }

    // Notification ajout/retrait
    function showNotification(wasFollowing) {
        const action = wasFollowing ? 'retirée' : 'ajoutée';
        const color = wasFollowing ? '#f44336' : '#4CAF50';
        const icon = wasFollowing ? 'fa-times-circle' : 'fa-check-circle';
        const followedCount = getFollowedPracticesCount();

        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${color};
                color: white;
                padding: 1rem;
                border-radius: 6px;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                max-width: 350px;
                animation: slideIn 0.3s ease-out;
            ">
                <i class="fas ${icon}"></i>
                <div>
                    <strong>Bonne pratique ${action}</strong>
                    <div style="font-size: 0.9rem; opacity: 0.9; margin-top: 0.25rem;">
                        Votre progression : ${followedCount}/${TOTAL_PRACTICES} pratiques suivies
                    </div>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }
            @keyframes slideOut { from { transform: translateX(0); opacity:1; } to { transform: translateX(100%); opacity:0; } }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (document.body.contains(notification)) document.body.removeChild(notification);
                if (document.head.contains(style)) document.head.removeChild(style);
            }, 300);
        }, 3000);
    }

    // Configurer les cases à cocher des bénéfices
    function setupBenefitsCheckboxes() {
        const checkboxes = document.querySelectorAll('.benefit-item input');
        checkboxes.forEach(checkbox => {
            const saved = localStorage.getItem(`benefit_${checkbox.id}`);
            if (saved) checkbox.checked = saved === 'true';

            checkbox.addEventListener('change', function() {
                localStorage.setItem(`benefit_${this.id}`, this.checked);
            });
        });
    }
    //Supprimer de la progression
    function removePracticeFromProgression() {
    let practices =
        JSON.parse(localStorage.getItem('medlik_followed_practices')) || [];

    practices = practices.filter(p => p.id !== PRACTICE_ID);

    localStorage.setItem(
        'medlik_followed_practices',
        JSON.stringify(practices)
    );
}

});
