//******* MODAL *******//
let modal = null; //permet de savoir quelle boite modal est ouverte

// Fonction pour ouvrir la modale
const openModal = (e) => {
    e.preventDefault();
    const target = document.getElementById('modal1');
    target.style.display = null; //retire le display none
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target; //permet de savoir quelle boite modal est ouverte
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    setTitle('Galerie photo'); // Définit le titre par défaut lors de l'ouverture de la modal
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
});

// Fonction pour fermer la modale
const closeModal = (e) => {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    modal = null;
}

const stopPropagation = (e) => {
    e.stopPropagation();
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
})

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
})

// Fonction pour afficher la galerie modale
function displayModalGallery(data) {
    const modalGallery = document.querySelector(".modalGallery");
    modalGallery.innerHTML = "";
    data.forEach((project) => {
        createModalProjectCard(project);
    });
}

// Fonction pour créer une carte de projet dans la galerie modale
function createModalProjectCard(project) {
    const modalGallery = document.querySelector(".modalGallery");
    const workGalleryCard = document.createElement("figure");
    const workImage = document.createElement("img");
    const trashCan = document.createElement("i");
    trashCan.classList.add("fa-solid", "fa-trash-can");

    workImage.src = project.imageUrl;
    workImage.alt = project.title;
    workGalleryCard.dataset.category = project.category.name;
    workGalleryCard.dataset.id = project.id;
    workGalleryCard.className = "workGalleryCard";
    workGalleryCard.append(workImage, trashCan);
    modalGallery.appendChild(workGalleryCard);

    // Ajout de l'écouteur d'événement pour la suppression
    trashCan.addEventListener("click", function () {
        deleteProject(project.id, workGalleryCard);
    });
}

// Fonction pour supprimer un projet
function deleteProject(workId, workGalleryCard) {
    const authToken = localStorage.getItem('authToken');

    fetch(`${catchAPIurl}/works/${workId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (response.ok) {
            workGalleryCard.remove();
            console.log(`Votre projet ${workId} a été supprimé avec succès`);
        } else {
            console.error(`Erreur lors de la suppression`);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Fonction pour définir le titre de la modal
function setTitle(title) {
    const titleElement = document.getElementById('titlemodal');
    titleElement.textContent = title;
}

//******* ADD PHOTO *******//
// fonction pour ajouter une photo
const addPhotoButton = document.getElementById('addPhoto');
addPhotoButton.addEventListener('click', function(event) {
    event.preventDefault();
    
    const modalWrapper = document.querySelector('.modalGallery');
    const modalForm = document.getElementById('modalForm');
    
    // Masquer le modalGallery et afficher le modalForm
    modalWrapper.style.display = 'none';
    modalForm.style.display = 'block';
    
    modalForm.removeAttribute('aria-hidden');
    modalForm.setAttribute('aria-modal', 'true');
    
    // Masquer le bouton "Ajouter une photo"
    addPhotoButton.style.display = 'none';
    
    // Changer le titre de la modal
    setTitle('Ajout photo');
});
