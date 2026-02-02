// MP-6 spécifique : Retirer une bonne pratique de mes objectifs
document.addEventListener('DOMContentLoaded', function() {
    const followBtn = document.getElementById('follow-btn');
    const PRACTICE_ID = 'time-management';
    
    // État initial : vérifie si déjà suivi
    let isFollowing = localStorage.getItem(`medlik_${PRACTICE_ID}_following`) === 'true';
    
    // Initialisation
    updateButtonState();
    
    // Gestion du clic
    followBtn.addEventListener('click', function() {
        if (isFollowing) {
            // MP-6: RETIRER la bonne pratique
            removeFromObjectives();
        } else {
            // MP-4: AJOUTER la bonne pratique
            addToObjectives();
        }
        
        isFollowing = !isFollowing;
        updateButtonState();
    });
    
    // MP-6: Fonction pour retirer
    function removeFromObjectives() {
        localStorage.removeItem(`medlik_${PRACTICE_ID}_following`);
        
        // Log pour débogage
        console.log('MP-6: Bonne pratique retirée des objectifs');
        
        // Notification spécifique MP-6
        showRemovalNotification();
        
        // Mettre à jour d'autres parties si nécessaire
        updateRelatedComponents();
    }
    
    // MP-4: Fonction pour ajouter (déjà faite)
    function addToObjectives() {
        localStorage.setItem(`medlik_${PRACTICE_ID}_following`, 'true');
        console.log('MP-4: Bonne pratique ajoutée aux objectifs');
        showAdditionNotification();
    }
    
    // Mise à jour du bouton
    function updateButtonState() {
        if (isFollowing) {
            // État "Retirer"
            followBtn.innerHTML = '<i class="fas fa-times-circle"></i> Retirer de mes objectifs';
            followBtn.classList.add('active');
            followBtn.title = "Cliquez pour retirer cette bonne pratique de vos objectifs";
        } else {
            // État "Ajouter"
            followBtn.innerHTML = '<i class="far fa-bookmark"></i> Ajouter à mes objectifs';
            followBtn.classList.remove('active');
            followBtn.title = "Cliquez pour ajouter cette bonne pratique à vos objectifs";
        }
    }
    
    // Notification spécifique pour MP-6
    function showRemovalNotification() {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f44336;
                color: white;
                padding: 1rem;
                border-radius: 6px;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            ">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Bonne pratique retirée</strong>
                    <div style="font-size: 0.9rem; opacity: 0.9;">
                        Elle n'apparaîtra plus dans votre suivi de progression
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => document.body.removeChild(notification), 500);
        }, 3000);
    }
    
    function showAdditionNotification() {
        // Notification pour MP-4 (similaire)
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 1rem;
                border-radius: 6px;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            ">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Bonne pratique ajoutée</strong>
                    <div style="font-size: 0.9rem; opacity: 0.9;">
                        Vous pouvez la retrouver dans votre suivi de progression
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => document.body.removeChild(notification), 500);
        }, 3000);
    }
    
    function updateRelatedComponents() {
        // Pour MP-7 (future intégration)
        console.log('MP-6: Mise à jour des composants liés après retrait');
        // Ici, tu pourras ajouter la mise à jour de la progression
    }
    
    // Gestion des bénéfices
    const checkboxes = document.querySelectorAll('.benefit-item input');
    checkboxes.forEach(checkbox => {
        const saved = localStorage.getItem(`benefit_${checkbox.id}`);
        if (saved) checkbox.checked = saved === 'true';
        
        checkbox.addEventListener('change', function() {
            localStorage.setItem(`benefit_${this.id}`, this.checked);
        });
    });
});