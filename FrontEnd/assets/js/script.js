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
        filter = document.querySelector(".filter");
        categoryFilter(categories, filter);
        //administrator mode
        // adminUserMode(filter);
      });
  };
  
//*******GALLERY*******

function displayGallery(data) {
    gallery = document.querySelector(".gallery");
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
    //identify wich filter button has been clicked
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