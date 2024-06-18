const catchAPIurl = "http://localhost:5678/api";

// Appel de l'API avec fetch
window.onload = () => {
    fetch(`${catchAPIurl}/works`)
      .then((response) => response.json())
      .then((data) => {
        //get list of categories
        const categories = getCategories(data);
        //affiche tous les travaux
        displayGallery(data);
        //Filter functionnality
        const filter = document.querySelector(".filter");
        categoryFilter(categories, filter);
        //administrator mode
        // adminUserMode(filter);
        displayModalGallery(data);
      });
};

//*******GALLERY*******//

function displayGallery(data) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    //intégre tous les travaux dans un tableau
    data.forEach((i) => {
      //crée les tags
      const workCard = document.createElement("figure");
      const workImage = document.createElement("img");
      const workTitle = document.createElement("figcaption");
      workImage.src = i.imageUrl;
      workImage.alt = i.title;
      workTitle.innerText = i.title;
      workCard.dataset.category = i.category.name;
      workCard.className = "workCard";
      //references to DOM
      gallery.appendChild(workCard);
      workCard.append(workImage, workTitle);
    });
}

// ********** FILTER ***********//

//get list of categories in array as unique objects
function getCategories(worksData) {
    const listOfCategories = new Set();
    //get set of string categories
    worksData.forEach((work) => {
      listOfCategories.add(JSON.stringify(work.category));
    });
    //push stringified categories in array
    const arrayOfStrings = [...listOfCategories];
    //parse array to get objects back
    const categories = arrayOfStrings.map((s) => JSON.parse(s));
    
    return categories;
}  

//init filter buttons
function categoryFilter(categories, filter) {
    const button = document.createElement("button");
    button.innerText = "Tous";
    button.className = "filterButton";
    button.dataset.category = "Tous";
    filter.appendChild(button);
    filterButtons(categories, filter);
    functionFilter();
}

//create filter buttons
function filterButtons(categories, filter) {
    categories.forEach((categorie) => {
      createButtonFilter(categorie, filter);
    });
}

function createButtonFilter(categorie, filter) {
    const button = document.createElement("button");
    button.innerText = categorie.name;
    button.className = "filterButton";
    button.dataset.category = categorie.name;
    filter.appendChild(button);
}

// Gallery filter
function functionFilter() {
    const filterButtons = document.querySelectorAll(".filterButton");
    //identify which filter button has been clicked
    filterButtons.forEach((i) => {
      i.addEventListener("click", function () {
        toggleProjects(i.dataset.category);
      });
    });
}

//if button "tous" active, display all projects, else display only those with same dataset category
function toggleProjects(datasetCategory) {
    const figures = document.querySelectorAll(".workCard");
    if ("Tous" === datasetCategory) {
      figures.forEach((figure) => {
        figure.style.display = "block";
      });
    } else {
      figures.forEach((figure) => {
        figure.dataset.category === datasetCategory
          ? (figure.style.display = "block")
          : (figure.style.display = "none");
      });
    }
}

//*******MODAL*******//

let modal = null; 

// Ouvre la modale
const openModal = function (e) {
    e.preventDefault();
    const target = document.getElementById('modal1');
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
}

// Permet de fermer la modal
const closeModal = function (e) {
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

const stopPropagation = function (e) {
    e.stopPropagation();
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
})

// Ferme la modal avec la touche echap
window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
})

// Affiche la galerie de la modal
function displayModalGallery(data) {
    const titleModal = document.getElementById("titlemodal");
    const modalGallery = document.querySelector(".modalGallery");
    modalGallery.innerHTML = "";
    titleModal.innerHTML = "Galerie photos";
    //intégre tous les travaux dans un tableau
    data.forEach((i) => {
      //crée les tags
      const workGalleryCard = document.createElement("figure");
      const workImage = document.createElement("img");
      const trashCan = document.createElement("i");
      trashCan.classList.add("fa-solid", "fa-trash-can");

      workImage.src = i.imageUrl;
      workImage.alt = i.title;
      workGalleryCard.dataset.category = i.category.name;
      workGalleryCard.dataset.id = i.id;  // Ajout de l'ID du travail
      console.log("ID défini pour le travail:", i.id);
      workGalleryCard.className = "workGalleryCard";
      //references to DOM
      workGalleryCard.append(workImage, trashCan);
      modalGallery.appendChild(workGalleryCard);
    });

    //delete a project
    const deleteWork = document.querySelectorAll(".fa-trash-can");
    deleteWork.forEach((icon) => {
      icon.addEventListener("click", function() {
        const workGalleryCard = icon.closest(".workGalleryCard");
        const workId = workGalleryCard.dataset.id;
        deleteProject(workId, workGalleryCard);
      });
    });
}

function deleteProject(workId, workGalleryCard) {
    const authToken = localStorage.getItem('authToken'); // Récupérer le token depuis le local storage
  
    fetch(`${catchAPIurl}/works/${workId}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // Ajoutez le token d'authentification
      }
    })
      .then((response) => {
        if (response.ok) {
          // supprime l'élément du DOM
          workGalleryCard.remove(); 
          console.log(`Votre projet ${workId} a été supprimé avec succès`);
        } else {
          console.error(`Erreur lors de la suppression ${response.status} ${response.statusText}`); 
        }
      })
      .catch(error => console.error('Error:', error));
}
