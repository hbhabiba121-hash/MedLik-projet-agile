// Configuration
const STORAGE_KEY = 'medlikConseilsConcours';
        
// Conseils par défaut - exemples de conseils pour la préparation du concours
const defaultAdvices = [
    {
        id: 1,
        title: "Méthode de révision en anatomie",
        content: "J'utilise la technique des schémas annotés. Je dessine chaque structure anatomique 3 fois de suite, en m'arrêtant à chaque erreur pour la corriger. La visualisation spatiale est essentielle pour retenir les relations entre les organes.",
        category: "methodes-revision",
        date: "15/10/2023"
    },
    {
        id: 2,
        title: "Planification sur 6 mois",
        content: "Divisez votre préparation en 3 phases : 1) Acquisition des connaissances (3 mois), 2) Entraînement intensif aux QCM (2 mois), 3) Révisions et simulations d'examen (1 mois). Prévoyez 1 jour de repos complet par semaine.",
        category: "planification",
        date: "12/10/2023"
    },
    {
        id: 3,
        title: "Gestion du stress avant les examens blancs",
        content: "Pratiquez la cohérence cardiaque : 5 secondes d'inspiration, 5 secondes d'expiration pendant 5 minutes. Cette technique réduit significativement l'anxiété et améliore la concentration pendant les épreuves.",
        category: "gestion-stress",
        date: "10/10/2023"
    },
    {
        id: 4,
        title: "Alimentation pendant les révisions",
        content: "Privilégiez les poissons gras (saumon, maquereau) riches en oméga-3 pour la mémoire, les noix et amandes pour l'énergie durable, et les myrtilles pour leurs antioxydants qui protègent les fonctions cognitives.",
        category: "sante-forme",
        date: "08/10/2023"
    },
    {
        id: 5,
        title: "Technique pour les QCM de physiologie",
        content: "Lisez d'abord la question sans regarder les réponses. Essayez de formuler mentalement la réponse. Ensuite, éliminez les propositions manifestement fausses. Si vous hésitez entre deux réponses, vérifiez laquelle est la plus complète.",
        category: "qcm-exercices",
        date: "05/10/2023"
    },
    {
        id: 6,
        title: "Choix des ressources",
        content: "Sélectionnez 2-3 ouvrages de référence maximum par matière pour éviter la dispersion. Complétez avec les annales des 5 dernières années pour identifier les tendances et les types de questions récurrentes.",
        category: "ressources-outils",
        date: "05/10/2023"
    },
    {
        id: 7,
        title: "Optimiser les QCM",
        content: "Lisez toutes les réponses avant de répondre. Éliminez d'abord les options manifestement fausses. Si vous hésitez entre deux réponses, notez la question et revenez-y à la fin. Gestion du temps : 1 minute par question maximum.",
        category: "qcm-exercices",
        date: "08/10/2023"
    },
    {
        id: 8,
        title: "Gestion du stress avant l'examen",
        content: "Pratiquez des techniques de respiration profonde (5 secondes d'inspiration, 5 secondes de rétention, 5 secondes d'expiration) pour réduire l'anxiété. Maintenez une routine de sommeil régulière et évitez les écrans 1h avant de dormir.",
        category: "gestion-stress",
        date: "10/10/2023"
    }
];

// Catégories avec labels, classes CSS et icônes
const categoryInfo = {
    'methodes-revision': { 
        label: 'Méthodes de révision', 
        class: 'methodes-revision', 
        icon: '📚' 
    },
    'planification': { 
        label: 'Planification', 
        class: 'planification', 
        icon: '📅' 
    },
    'gestion-stress': { 
        label: 'Gestion du stress', 
        class: 'gestion-stress', 
        icon: '🧘' 
    },
    'sante-forme': { 
        label: 'Santé & Forme', 
        class: 'sante-forme', 
        icon: '💪' 
    },
    'qcm-exercices': { 
        label: 'Techniques QCM', 
        class: 'qcm-exercices', 
        icon: '✍️' 
    },
    'ressources-outils': { 
        label: 'Ressources', 
        class: 'ressources-outils', 
        icon: '🛠️' 
    },
    'jour-examen': { 
        label: 'Jour J', 
        class: 'jour-examen', 
        icon: '📝' 
    },
    'motivation': { 
        label: 'Motivation', 
        class: 'motivation', 
        icon: '🚀' 
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Initialiser l'application
function initApp() {
    loadAdvices();
    
    // Gérer l'ajout de conseil
    document.getElementById('adviceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addAdvice();
    });
}

// Charger les conseils depuis localStorage
function loadAdvices() {
    let advices = JSON.parse(localStorage.getItem(STORAGE_KEY));
    
    // Si aucun conseil n'est stocké, utiliser les conseils par défaut
    if (!advices || advices.length === 0) {
        advices = defaultAdvices;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(advices));
    }
    
    displayAdvices(advices);
}

// Afficher les conseils dans la page
function displayAdvices(advices) {
    const container = document.getElementById('advicesContainer');
    container.innerHTML = '';
    
    // Trier les conseils par date (du plus récent au plus ancien)
    advices.sort((a, b) => b.id - a.id);
    
    // Créer une carte pour chaque conseil
    advices.forEach(advice => {
        const category = categoryInfo[advice.category] || { 
            label: 'Conseil général', 
            class: 'methodes-revision', 
            icon: '💡' 
        };
        
        const card = document.createElement('div');
        card.className = 'advice-card';
        card.dataset.id = advice.id;
        
        card.innerHTML = `
            <div class="advice-header">
                <div class="advice-category ${category.class}">
                    ${category.icon} ${category.label}
                </div>
                <h3 class="advice-title">${advice.title}</h3>
            </div>
            <div class="advice-content">
                <p class="advice-text">${advice.content}</p>
            </div>
            <div class="advice-footer">
                <span class="advice-date">
                    <i class="far fa-calendar-alt"></i> Partagé le ${advice.date}
                </span>
                <button class="delete-btn" data-id="${advice.id}">
                    <i class="fas fa-trash-alt"></i> Supprimer
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Ajouter des événements aux boutons de suppression
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            deleteAdvice(id);
        });
    });
}

// Ajouter un nouveau conseil
function addAdvice() {
    const title = document.getElementById('adviceTitle').value.trim();
    const content = document.getElementById('adviceContent').value.trim();
    const category = document.getElementById('adviceCategory').value;
    
    // Validation
    if (!title || !content || !category) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }
    
    // Récupérer les conseils existants
    let advices = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    // Créer un nouvel objet conseil
    const newAdvice = {
        id: Date.now(),
        title: title,
        content: content,
        category: category,
        date: new Date().toLocaleDateString('fr-FR')
    };
    
    // Ajouter le nouveau conseil
    advices.push(newAdvice);
    
    // Sauvegarder dans localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(advices));
    
    // Réinitialiser le formulaire
    document.getElementById('adviceForm').reset();
    
    // Recharger l'affichage
    loadAdvices();
    
    // Message de confirmation
    alert("✅ Votre conseil a été partagé avec la communauté !");
}

// Supprimer un conseil
function deleteAdvice(id) {
    if (!confirm("Voulez-vous vraiment supprimer ce conseil partagé ?")) {
        return;
    }
    
    // Récupérer les conseils existants
    let advices = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    // Filtrer pour supprimer le conseil avec l'ID correspondant
    advices = advices.filter(advice => advice.id !== id);
    
    // Sauvegarder dans localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(advices));
    
    // Recharger l'affichage
    loadAdvices();
    
    // Message de confirmation
    alert("🗑️ Le conseil a été supprimé.");
}