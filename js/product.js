/* Récupération de l'ID du produit*/

let pageCourante = window.location.href;
let url = new URL(pageCourante);
let idProduit = url.searchParams.get("id");
console.log(idProduit);

const image = document.querySelector(".item__img");
const imageProduit = document.createElement("img");
const nomProduit = document.getElementById("title");
const prixProduit = document.getElementById("price");
const descriptionProduit = document.getElementById("description");
const optionCouleur = document.getElementById("colors");
const nombreProduit = document.getElementById("quantity");
const ajoutPanier = document.getElementById("addToCart");

let quantitéSelectionner = "";
let couleurSelectionner = "";
let panier = [];

/*Requête de l’API pour lui demander les informations du produit*/

fetch("http://localhost:3000/api/products/" + idProduit)
  .then(function (reponse) {
    if (reponse.ok) {
      return reponse.json();
    }
  })
  .then(function (informations) {
    console.log(informations);

    /*Insertions dans le code HTML des données récupérées*/

    image.appendChild(imageProduit);
    imageProduit.setAttribute("src", informations.imageUrl);
    imageProduit.setAttribute("alt", informations.altTxt);
    nomProduit.textContent = informations.name;
    prixProduit.textContent = informations.price;
    descriptionProduit.textContent = informations.description;

    let couleur = informations.colors;
    for (let i = 0; i < couleur.length; i++) {
      const couleurProduit = document.createElement("option");
      optionCouleur.appendChild(couleurProduit);
      couleurProduit.setAttribute("value", couleur[i]);
      couleurProduit.textContent = couleur[i];
    }
  })
  .catch(function (erreur) {
    console.log(erreur);
  });

/* Controle que la quantité se situe entre 0 et 100 */
nombreProduit.addEventListener("input", (e) => {
  if (e.target.value > 0 && e.target.value <= 100) {
    quantitéSelectionner = e.target.value;
    console.log(quantitéSelectionner);
  } else {
    alert("Veuillez choisir une quantité comprise entre 0 et 100");
    nombreProduit.setAttribute("value", (e.target.value = 0));
  }
});

/* Controle q'une couleur est bien sélectionnée */
optionCouleur.addEventListener("input", (e) => {
  if (e.target.value != "") {
    couleurSelectionner = e.target.value;
    console.log(couleurSelectionner);
  } else {
    alert("Veuillez selectionner une couleur");
  }
});

/* Ajouter des produits dans le localStorage*/
ajoutPanier.addEventListener("click", () => {
  panier = [idProduit, couleurSelectionner, quantitéSelectionner];
  console.log(panier);

  let produitDansLocalStorage = JSON.parse(localStorage.getItem("produit"));

  /* Si il y a déjà des produits dans le localStorage*/
  if (produitDansLocalStorage) {
    produitDansLocalStorage.push(panier);
    localStorage.setItem("produit", JSON.stringify(produitDansLocalStorage));

    console.log(produitDansLocalStorage);
  } else {
    /* Si le localStorage est vide*/
    produitDansLocalStorage = [];
    produitDansLocalStorage.push(panier);
    localStorage.setItem("produit", JSON.stringify(produitDansLocalStorage));

    console.log(produitDansLocalStorage);
  }
});

/*let panierStocker = JSON.stringify(panier);
  if (panier[0] === idProduit && panier[1] === couleurSelectionner) {
    panier[2] + quantitéSelectionner;

  } else {
    panier = [idProduit, couleurSelectionner, quantitéSelectionner];
   
    
  }
});*/
