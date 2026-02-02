// Fonctionnalité MP-4 : Suivre une bonne pratique
document.addEventListener('DOMContentLoaded', function() {
    const followBtn = document.getElementById('follow-btn');
    const followIcon = followBtn.querySelector('i');
    const followText = followBtn.querySelector('span');
    
    // Vérifie si l'utilisateur suit déjà cette pratique
    let isFollowing = localStorage.getItem('following-time-management') === 'true';
    
    // Met à jour l'état initial du bouton
    updateButtonState();
    
    // Gestionnaire d'événement pour le bouton
    followBtn.addEventListener('click', function() {
        isFollowing = !isFollowing;
        
        // Sauvegarde dans le localStorage
        if (isFollowing) {
            localStorage.setItem('following-time-management', 'true');
            showNotification('✅ Bonne pratique ajoutée à vos objectifs !');
        } else {
            localStorage.removeItem('following-time-management');
            showNotification('❌ Bonne pratique retirée de vos objectifs.');
        }
        
        // Met à jour l'apparence du bouton
        updateButtonState();
        
        // Animation de feedback
        animateButton();
    });
    
    function updateButtonState() {
        if (isFollowing) {
            followBtn.classList.add('active');
            followIcon.className = 'fas fa-bookmark';
            followText.textContent = 'Retirer de mes objectifs';
        } else {
            followBtn.classList.remove('active');
            followIcon.className = 'far fa-bookmark';
            followText.textContent = 'Ajouter à mes objectifs';
        }
    }
    
    function animateButton() {
        followBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            followBtn.style.transform = 'scale(1)';
        }, 150);
    }
    
    function showNotification(message) {
        // Crée une notification temporaire
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isFollowing ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Supprime la notification après 3 secondes
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Ajoute les styles d'animation
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
    
    // Simulation de progression dans les bénéfices
    const checkboxes = document.querySelectorAll('.benefit-item input');
    checkboxes.forEach((checkbox, index) => {
        // Simule un état aléatoire pour la démo
        const isChecked = Math.random() > 0.5;
        checkbox.checked = isChecked;
        
        // Change la couleur si coché
        if (isChecked) {
            checkbox.parentElement.style.background = '#e8f5e9';
            checkbox.parentElement.style.borderLeft = '3px solid #4CAF50';
        }
    });
});