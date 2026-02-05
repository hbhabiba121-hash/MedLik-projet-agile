// MP-4, MP-5, MP-6, MP-7 : Gestion dynamique des bonnes pratiques
document.addEventListener("DOMContentLoaded", () => {
    // ===================== CONFIG =====================
    const urlParams = new URLSearchParams(window.location.search);
    const PRACTICE_ID = urlParams.get("id"); // récupère l'id de l'URL
    const TOTAL_PRACTICES = 10; // nombre total de pratiques

    const practices = {
        "time-management": {
            title: "Gérer son temps pendant l'épreuve",
            category: "Techniques d'examen",
            description: "Optimisez votre temps le jour du concours",
            tips: [
                "Lisez toutes les questions en 5 minutes au début",
                "Allouez un temps par question (≈2 min par QCM)",
                "Commencez par les questions que vous maîtrisez",
                "Ne restez pas bloqué plus de 2 minutes sur une question",
                "Gardez 15 minutes pour la relecture finale"
            ]
        },
        "stay-calm": {
            title: "Rester calme sous pression",
            category: "Gestion du stress",
            description: "Respirez et restez concentré pour maximiser vos performances",
            tips: [
                "Respirez profondément",
                "Ne paniquez pas",
                "Relisez vos réponses si nécessaire"
            ]
        },
        "prioritize": {
            title: "Prioriser les questions faciles",
            category: "Stratégie",
            description: "Commencez par les questions que vous maîtrisez pour gagner du temps",
            tips: [
                "Répondez aux questions faciles d'abord",
                "Laissez les difficiles pour la fin"
            ]
        }
    };

    const practice = practices[PRACTICE_ID];

    if (!practice) {
        document.querySelector(".practice-header h1").textContent = "Bonne pratique introuvable";
        return;
    }

    // ===================== DOM =====================
    const followBtn = document.getElementById("follow-btn");
    const progressFill = document.getElementById("progress-fill");
    const progressPercentage = document.getElementById("progress-percentage");
    const progressCount = document.getElementById("progress-count");
    const followedCountEl = document.getElementById("followed-count");
    const inprogressCountEl = document.getElementById("inprogress-count");
    const remainingCountEl = document.getElementById("remaining-count");
    const progressMessage = document.getElementById("progress-message");
    const tipsSections = document.querySelectorAll(".numbered-list");

    // ===================== STATE =====================
    let followedPractices = getFollowedPractices();

    // ===================== INIT =====================
    updateHeader();
    updateTips();
    updateButtonState();
    updateProgression();
    setupBenefitsCheckboxes();

    // ===================== EVENTS =====================
    followBtn.addEventListener("click", togglePractice);

    // ===================== FUNCTIONS =====================

    function updateHeader() {
        document.querySelector(".practice-header h1").textContent = practice.category;
        document.querySelector(".practice-header h2").textContent = practice.title;
        document.querySelector(".practice-header .subtitle").textContent = practice.description;
    }

    function updateTips() {
        tipsSections.forEach(section => section.innerHTML = ""); // vide les listes
        practice.tips.forEach((tip, i) => {
            const li = document.createElement("li");
            li.textContent = tip;
            if (i < 5) tipsSections[0].appendChild(li);
            else {
                if (tipsSections[1]) tipsSections[1].appendChild(li);
            }
        });
    }

    // MP-5 : Ajouter / retirer automatiquement
    function togglePractice() {
        const index = followedPractices.indexOf(PRACTICE_ID);

        if (index === -1) {
            followedPractices.push(PRACTICE_ID);
            showNotification("ajoutée", "#4CAF50", "fa-check-circle");
        } else {
            followedPractices.splice(index, 1);
            showNotification("retirée", "#f44336", "fa-times-circle");
        }

        saveFollowedPractices();
        updateButtonState();
        updateProgression();
    }

    function updateButtonState() {
        const isFollowing = followedPractices.includes(PRACTICE_ID);

        followBtn.innerHTML = isFollowing
            ? '<i class="fas fa-times-circle"></i> Retirer de mes objectifs'
            : '<i class="far fa-bookmark"></i> Ajouter à mes objectifs';

        followBtn.style.background = isFollowing ? "#f44336" : "#4CAF50";
        followBtn.classList.toggle("active", isFollowing);
    }

    // MP-7 : progression dynamique
    function updateProgression() {
        const followed = followedPractices.length;
        const inProgress = Math.min(3, followed); // logique simple
        const remaining = TOTAL_PRACTICES - followed;
        const percentage = Math.round((followed / TOTAL_PRACTICES) * 100);

        updateProgressBar(percentage);
        updateStats(followed, inProgress, remaining);
        updateMessage(followed, percentage);
        animateProgress();
    }

    function updateProgressBar(percent) {
        progressFill.style.width = `${percent}%`;
        progressPercentage.textContent = `${percent}%`;

        if (percent < 30) {
            progressFill.style.background = "linear-gradient(90deg,#f44336,#e53935)";
        } else if (percent < 70) {
            progressFill.style.background = "linear-gradient(90deg,#ff9800,#fb8c00)";
        } else {
            progressFill.style.background = "linear-gradient(90deg,#4CAF50,#45a049)";
        }
    }

    function updateStats(followed, inProgress, remaining) {
        followedCountEl.textContent = followed;
        inprogressCountEl.textContent = inProgress;
        remainingCountEl.textContent = remaining;
        progressCount.textContent = `${followed} sur ${TOTAL_PRACTICES} bonnes pratiques suivies`;
    }

    function updateMessage(followed, percent) {
        let message = "";
        let icon = "";

        if (followed === 0) {
            message = "Commencez par ajouter des bonnes pratiques";
            icon = "fas fa-rocket";
        } else if (percent < 30) {
            message = "Bon début, continuez !";
            icon = "fas fa-seedling";
        } else if (percent < 70) {
            message = "Très bonne progression 💪";
            icon = "fas fa-chart-line";
        } else {
            message = "Excellent travail 🏆";
            icon = "fas fa-trophy";
        }

        progressMessage.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
    }

    function animateProgress() {
        progressFill.classList.add("progress-updated");
        setTimeout(() => progressFill.classList.remove("progress-updated"), 400);
    }

    // ===================== STORAGE =====================
    function getFollowedPractices() {
        return JSON.parse(localStorage.getItem("medlik_followed_practices")) || [];
    }

    function saveFollowedPractices() {
        localStorage.setItem("medlik_followed_practices", JSON.stringify(followedPractices));
    }

    // ===================== NOTIFICATION =====================
    function showNotification(action, color, icon) {
        const notif = document.createElement("div");
        notif.innerHTML = `
            <div style="
                position:fixed;
                top:20px;
                right:20px;
                background:${color};
                color:white;
                padding:1rem;
                border-radius:6px;
                display:flex;
                gap:10px;
                align-items:center;
                z-index:1000;
            ">
                <i class="fas ${icon}"></i>
                <div>
                    <strong>Bonne pratique ${action}</strong>
                    <div style="font-size:.9rem">
                        Progression : ${followedPractices.length}/${TOTAL_PRACTICES}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }

    // ===================== BENEFITS =====================
    function setupBenefitsCheckboxes() {
        document.querySelectorAll(".benefit-item input").forEach(cb => {
            cb.checked = localStorage.getItem(cb.id) === "true";
            cb.addEventListener("change", () => {
                localStorage.setItem(cb.id, cb.checked);
            });
        });
    }
});
