// MP-36 à MP-39: Publication d'une bonne pratique
document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const practiceForm = document.getElementById('practice-form');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const uploadArea = document.getElementById('upload-area');
    const fileList = document.getElementById('file-list');
    const benefitInput = document.getElementById('benefit-input');
    const addBenefitBtn = document.getElementById('add-benefit');
    const benefitsList = document.getElementById('benefits-list');
    const previewBtn = document.getElementById('preview-btn');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const previewModal = document.getElementById('preview-modal');
    const closePreview = document.getElementById('close-preview');
    const previewBody = document.getElementById('preview-body');
    
    // État
    const files = []; // MP-37: Liste des fichiers
    const benefits = []; // Liste des bénéfices
    
    // Initialisation
    setupEventListeners();
    
    // Configuration des événements
    function setupEventListeners() {
        // MP-37: Upload de fichiers
        browseBtn.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', handleFileSelect);
        
        // Drag & drop MP-37
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.background = '#e8f4fc';
            uploadArea.style.borderColor = '#2c3e50';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.background = '#f8f9fa';
            uploadArea.style.borderColor = '#4a6491';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.background = '#f8f9fa';
            uploadArea.style.borderColor = '#4a6491';
            
            if (e.dataTransfer.files.length) {
                handleFiles(e.dataTransfer.files);
            }
        });
        
        // Ajout de bénéfices
        addBenefitBtn.addEventListener('click', addBenefit);
        benefitInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addBenefit();
            }
        });
        
        // Prévisualisation MP-36
        previewBtn.addEventListener('click', showPreview);
        closePreview.addEventListener('click', () => {
            previewModal.style.display = 'none';
        });
        
        // Fermer modal en cliquant à l'extérieur
        previewModal.addEventListener('click', (e) => {
            if (e.target === previewModal) {
                previewModal.style.display = 'none';
            }
        });
        
        // Soumission du formulaire MP-38
        practiceForm.addEventListener('submit', handleSubmit);
        
        // Annulation
        cancelBtn.addEventListener('click', () => {
            if (confirm('Voulez-vous vraiment annuler ? Toutes les données seront perdues.')) {
                window.location.href = 'practices.html';
            }
        });
    }
    
    // MP-37: Gestion de la sélection de fichiers
    function handleFileSelect(e) {
        handleFiles(e.target.files);
    }
    
    function handleFiles(fileListObj) {
        for (let file of fileListObj) {
            // Validation MP-39: Formats et taille
            if (!validateFile(file)) {
                continue;
            }
            
            files.push(file);
            addFileToUI(file);
        }
        
        fileInput.value = ''; // Réinitialiser l'input
    }
    
    // MP-39: Validation des fichiers
    function validateFile(file) {
        const validTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (!validTypes.includes(file.type)) {
            alert(`Format non supporté: ${file.type}. Formats acceptés: JPG, PNG, PDF, DOC, DOCX`);
            return false;
        }
        
        if (file.size > maxSize) {
            alert(`Fichier trop volumineux: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum: 10MB`);
            return false;
        }
        
        return true;
    }
    
    // Ajouter un fichier à l'interface
    function addFileToUI(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.name = file.name;
        
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const fileIcon = getFileIcon(fileExtension);
        
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas ${fileIcon} file-icon"></i>
                <div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <button type="button" class="remove-file" data-name="${file.name}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        fileList.appendChild(fileItem);
        
        // Bouton de suppression
        fileItem.querySelector('.remove-file').addEventListener('click', () => {
            removeFile(file.name);
            fileList.removeChild(fileItem);
        });
    }
    
    // Obtenir l'icône selon l'extension
    function getFileIcon(extension) {
        const icons = {
            'jpg': 'fa-file-image',
            'jpeg': 'fa-file-image',
            'png': 'fa-file-image',
            'gif': 'fa-file-image',
            'pdf': 'fa-file-pdf',
            'doc': 'fa-file-word',
            'docx': 'fa-file-word',
            'txt': 'fa-file-alt'
        };
        
        return icons[extension] || 'fa-file';
    }
    
    // Formater la taille du fichier
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Supprimer un fichier
    function removeFile(fileName) {
        const index = files.findIndex(f => f.name === fileName);
        if (index > -1) {
            files.splice(index, 1);
        }
    }
    
    // Ajouter un bénéfice
    function addBenefit() {
        const benefit = benefitInput.value.trim();
        
        if (benefit) {
            benefits.push(benefit);
            addBenefitToUI(benefit);
            benefitInput.value = '';
        }
    }
    
    // Ajouter un bénéfice à l'interface
    function addBenefitToUI(benefit) {
        const benefitTag = document.createElement('div');
        benefitTag.className = 'benefit-tag';
        benefitTag.innerHTML = `
            ${benefit}
            <button type="button" class="remove-benefit" data-benefit="${benefit}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        benefitsList.appendChild(benefitTag);
        
        // Bouton de suppression
        benefitTag.querySelector('.remove-benefit').addEventListener('click', () => {
            removeBenefit(benefit);
            benefitsList.removeChild(benefitTag);
        });
    }
    
    // Supprimer un bénéfice
    function removeBenefit(benefit) {
        const index = benefits.indexOf(benefit);
        if (index > -1) {
            benefits.splice(index, 1);
        }
    }
    
    // MP-36: Prévisualisation
    function showPreview() {
        if (!validateForm(true)) {
            return;
        }
        
        const formData = getFormData();
        
        // Générer le HTML de prévisualisation
        previewBody.innerHTML = generatePreviewHTML(formData);
        previewModal.style.display = 'flex';
    }
    
    // Générer le HTML de prévisualisation
    function generatePreviewHTML(data) {
        return `
            <div class="preview-practice">
                <h3 style="color: #666; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 0.5rem;">
                    ${getCategoryLabel(data.category)}
                </h3>
                <h2 style="color: #2c3e50; margin-bottom: 1rem;">${data.title}</h2>
                
                <div style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #eee;">
                    <h4 style="color: #4a6491; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-align-left"></i> Description
                    </h4>
                    <p>${data.description}</p>
                </div>
                
                ${data.tips ? `
                <div style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #eee;">
                    <h4 style="color: #4a6491; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-lightbulb"></i> Conseils pratiques
                    </h4>
                    <ol>
                        ${data.tips.split('\n').filter(tip => tip.trim()).map(tip => `<li>${tip.trim()}</li>`).join('')}
                    </ol>
                </div>
                ` : ''}
                
                ${data.duration ? `
                <div style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #eee;">
                    <h4 style="color: #4a6491; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-clock"></i> Durée estimée
                    </h4>
                    <p>${data.duration}</p>
                </div>
                ` : ''}
                
                ${benefits.length > 0 ? `
                <div style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #eee;">
                    <h4 style="color: #4a6491; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-check-circle"></i> Bénéfices
                    </h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${benefits.map(benefit => `<span style="background: #e8f4fc; color: #2196F3; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.9rem;">${benefit}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${files.length > 0 ? `
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #4a6491; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-paperclip"></i> Fichiers joints (${files.length})
                    </h4>
                    <ul>
                        ${files.map(file => `<li>${file.name} (${formatFileSize(file.size)})</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; margin-top: 1.5rem;">
                    <p style="margin: 0; color: #666; font-size: 0.9rem;">
                        <i class="fas fa-info-circle"></i> Cette prévisualisation montre comment votre bonne pratique apparaîtra aux autres utilisateurs.
                    </p>
                </div>
            </div>
        `;
    }
    
    // Obtenir le label d'une catégorie
    function getCategoryLabel(categoryValue) {
        const categories = {
            'techniques-examen': 'Techniques d\'examen',
            'organisation': 'Organisation & Planning',
            'revision': 'Méthodes de révision',
            'stress': 'Gestion du stress',
            'autres': 'Autres'
        };
        
        return categories[categoryValue] || categoryValue;
    }
    
    // MP-38: Soumission du formulaire
    async function handleSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Désactiver le bouton pendant l'envoi
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publication en cours...';
        
        try {
            // Simuler l'envoi au backend (MP-38)
            const formData = getFormData();
            await simulateBackendSubmission(formData);
            
            // Succès
            showSuccessMessage();
            
            // Réinitialiser le formulaire
            setTimeout(() => {
                practiceForm.reset();
                files.length = 0;
                benefits.length = 0;
                fileList.innerHTML = '';
                benefitsList.innerHTML = '';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publier la bonne pratique';
            }, 3000);
            
        } catch (error) {
            // Erreur
            showErrorMessage(error.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publier la bonne pratique';
        }
    }
    
    // Validation du formulaire
    function validateForm(isPreview = false) {
        const title = document.getElementById('practice-title').value.trim();
        const category = document.getElementById('practice-category').value;
        const description = document.getElementById('practice-description').value.trim();
        
        if (!title) {
            alert('Veuillez saisir un titre pour votre bonne pratique.');
            return false;
        }
        
        if (!category) {
            alert('Veuillez sélectionner une catégorie.');
            return false;
        }
        
        if (!description) {
            alert('Veuillez saisir une description.');
            return false;
        }
        
        // Pour la prévisualisation, on peut être moins strict
        if (!isPreview) {
            // Validation supplémentaire pour la soumission
            if (description.length < 50) {
                alert('La description doit contenir au moins 50 caractères.');
                return false;
            }
        }
        
        return true;
    }
    
    // Obtenir les données du formulaire
    function getFormData() {
        return {
            title: document.getElementById('practice-title').value.trim(),
            category: document.getElementById('practice-category').value,
            description: document.getElementById('practice-description').value.trim(),
            tips: document.getElementById('practice-tips').value.trim(),
            duration: document.getElementById('practice-duration').value.trim(),
            difficulty: document.querySelector('input[name="difficulty"]:checked')?.value || 'intermediate',
            benefits: [...benefits],
            files: files.map(f => ({ name: f.name, size: f.size, type: f.type }))
        };
    }
    
    // MP-38: Simuler l'envoi au backend
    function simulateBackendSubmission(formData) {
        return new Promise((resolve, reject) => {
            // Simuler un délai réseau
            setTimeout(() => {
                // Simuler une erreur aléatoire (10% de chance)
                if (Math.random() < 0.1) {
                    reject(new Error('Erreur de connexion au serveur. Veuillez réessayer.'));
                    return;
                }
                
                // Simuler le succès
                console.log('MP-38: Données envoyées au backend:', formData);
                
                // Sauvegarder dans localStorage pour la démo
                saveToLocalStorage(formData);
                
                resolve();
            }, 2000);
        });
    }
    
    // Sauvegarder dans localStorage (pour la démo)
    function saveToLocalStorage(formData) {
        const publishedPractices = JSON.parse(localStorage.getItem('medlik_published_practices') || '[]');
        publishedPractices.push({
            ...formData,
            id: Date.now(),
            date: new Date().toISOString(),
            author: 'Utilisateur',
            likes: 0,
            comments: []
        });
        
        localStorage.setItem('medlik_published_practices', JSON.stringify(publishedPractices));
    }
    
    // Message de succès
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 6px;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                animation: slideIn 0.3s ease-out;
                max-width: 400px;
            ">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Bonne pratique publiée avec succès !</strong>
                    <div style="font-size: 0.9rem; opacity: 0.9; margin-top: 0.25rem;">
                        Votre contribution est maintenant visible par la communauté.
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
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(message);
                document.head.removeChild(style);
            }, 300);
        }, 5000);
    }
    
    // Message d'erreur
    function showErrorMessage(errorText) {
        const message = document.createElement('div');
        message.innerHTML = `
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
                max-width: 400px;
            ">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <strong>Erreur de publication</strong>
                    <div style="font-size: 0.9rem; opacity: 0.9; margin-top: 0.25rem;">
                        ${errorText}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => document.body.removeChild(message), 300);
        }, 5000);
    }
});