const catchAPIurl = "http://localhost:5678/api";

// Fonction pour charger les travaux lors du chargement de la page
window.onload = () => {
    fetchWorks();
};

// Fonction pour récupérer et afficher les travaux
function fetchWorks() {
    fetch(`${catchAPIurl}/works`)
        .then(response => response.json())
        .then(data => {
            // récupérer les div des catégories et des works pour les vider en faisant un inner HTML
            const categories = getCategories(data);
            displayGallery(data);
            const filter = document.querySelector(".filter");
            categoryFilter(categories, filter);
            displayModalGallery(data);
        });
}

//******* GALLERY *******//

// Fonction pour afficher la galerie principale
function displayGallery(data) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    data.forEach((project) => {
        createProjectCard(project);
    });
}

// Fonction pour créer une carte de projet dans la galerie principale
function createProjectCard(project) {
    const gallery = document.querySelector(".gallery");
    const workCard = document.createElement("figure");
    const workImage = document.createElement("img");
    const workTitle = document.createElement("figcaption");
    workImage.src = project.imageUrl;
    workImage.alt = project.title;
    workTitle.innerText = project.title;
    workCard.dataset.category = project.category.name;
    workCard.className = "workCard";
    workCard.append(workImage, workTitle);
    gallery.appendChild(workCard);
}

// ********** FILTER ***********//

// Fonction pour obtenir les catégories uniques
function getCategories(worksData) {
    const listOfCategories = new Set();
    worksData.forEach(work => {
        listOfCategories.add(JSON.stringify(work.category));
    });
    const arrayOfStrings = [...listOfCategories];
    return arrayOfStrings.map(s => JSON.parse(s));
}

// Fonction pour initier les boutons de filtre
function categoryFilter(categories, filter) {
    const button = document.createElement("button");
    button.innerText = "Tous";
    button.className = "filterButton";
    button.dataset.category = "Tous";
    filter.appendChild(button);
    filterButtons(categories, filter);
    functionFilter();
}

// Fonction pour créer les boutons de filtre
function filterButtons(categories, filter) {
    categories.forEach(categorie => {
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

// Fonction pour gérer le filtre de la galerie
function functionFilter() {
    const filterButtons = document.querySelectorAll(".filterButton");
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            toggleProjects(button.dataset.category);
        });
    });
}

// Fonction pour afficher les projets selon le filtre sélectionné
function toggleProjects(datasetCategory) {
    const figures = document.querySelectorAll(".workCard");
    if (datasetCategory === "Tous") {
        figures.forEach(figure => {
            figure.style.display = "block";
        });
    } else {
        figures.forEach(figure => {
            figure.dataset.category === datasetCategory
                ? (figure.style.display = "block")
                : (figure.style.display = "none");
        });
    }
}