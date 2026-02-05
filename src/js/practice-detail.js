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
    
    // MP-4 & MP-6: Gestion du clic sur le bouton
    followBtn.addEventListener('click', function() {
        const wasFollowing = isFollowing;
        isFollowing = !isFollowing;
        
        // Sauvegarder l'état
        if (isFollowing) {
            localStorage.setItem(`medlik_${PRACTICE_ID}_following`, 'true');
            console.log('MP-4: Bonne pratique ajoutée aux objectifs');
        } else {
            localStorage.removeItem(`medlik_${PRACTICE_ID}_following`);
            console.log('MP-6: Bonne pratique retirée des objectifs');
        }
        
        // Mettre à jour l'interface
        updateButtonState();
        updateProgression(); // MP-7: Mise à jour de la progression
        showNotification(wasFollowing);
    });
    
    // Initialisation de la page
    function initializePage() {
        updateButtonState();
        simulateProgressData();
        updateProgression();
        setupBenefitsCheckboxes();
    }
    
    // MP-4 & MP-6: Mise à jour du bouton
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
    
    // MP-7: Fonction principale - Mise à jour de la progression
    function updateProgression() {
        // Calculer les statistiques
        const followed = getFollowedPracticesCount();
        const inProgress = IN_PROGRESS_PRACTICES;
        const remaining = TOTAL_PRACTICES - followed - inProgress;
        const percentage = Math.round((followed / TOTAL_PRACTICES) * 100);
        
        // Mettre à jour l'interface
        updateProgressBar(percentage);
        updateProgressStats(followed, inProgress, remaining, percentage);
        updateProgressMessage(followed, percentage);
        
        // Animation
        animateProgressUpdate();
    }
    
    // Simulation des données pour la démo
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
    function getFollowedPracticesCount() {
        let count = 0;
        
        // Vérifier cette pratique
        if (localStorage.getItem(`medlik_${PRACTICE_ID}_following`) === 'true') {
            count++;
        }
        
        // Vérifier les pratiques simulées
        for (let i = 1; i <= TOTAL_PRACTICES; i++) {
            if (i !== 0) {
                if (localStorage.getItem(`medlik_practice_${i}_following`) === 'true') {
                    count++;
                }
            }
        }
        
        return count;
    }
    
    // Mettre à jour la barre de progression
    function updateProgressBar(percentage) {
        progressFill.style.width = `${percentage}%`;
        progressPercentage.textContent = `${percentage}%`;
        
        // Changer la couleur selon le pourcentage
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
    
    // Mettre à jour le message selon la progression
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
        // Animation de la barre
        progressFill.classList.add('progress-updated');
        setTimeout(() => {
            progressFill.classList.remove('progress-updated');
        }, 500);
        
        // Animation des cartes
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
    
    // Notification pour MP-4 et MP-6
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
        
        // Ajouter les animations CSS
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
        
        // Supprimer après 3 secondes
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
    
    // Configuration des cases à cocher des bénéfices
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
});