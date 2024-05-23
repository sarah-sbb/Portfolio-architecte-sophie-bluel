const catchAPIurl = "http://localhost:5678/api/";
let worksData;
let categories;

// Appel de l'API avec fetch
window.onload = () => {
    fetch(`${catchApiUrl}works`)
      .then((response) => response.json())
      .then((data) => {
        worksData = data;
        //get list of categories
        listOfUniqueCategories();
        //display all works
        displayGallery(worksData);
        //Filter functionnality
        filter = document.querySelector(".filter");
        categoryFilter(categories, filter);
        //administrator mode
        adminUserMode(filter);
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