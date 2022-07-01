/* Récupération de l'ID du produit*/

let pageCourante = window.location.href;
let url = new URL(pageCourante);
let idProduit = url.searchParams.get("id");
console.log("idProduit: " + idProduit);

const image = document.querySelector(".item__img");
const imageProduit = document.createElement("img");
const nomProduit = document.getElementById("title");
const prixProduit = document.getElementById("price");
const descriptionProduit = document.getElementById("description");
const optionCouleur = document.getElementById("colors");
const nombreProduit = document.getElementById("quantity");
const ajoutPanier = document.getElementById("addToCart");

let panier = [];

/*Requête de l’API pour lui demander les informations du produit*/
fetch("http://localhost:3000/api/products/" + idProduit)
  .then(function (reponse) {
    if (reponse.ok) {
      return reponse.json();
    }
  })
  .then(function (informations) {
    console.log("Informations sur le produit:");
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

function controleOption() {
  /* Controle que la quantité se situe entre 0 et 100 */
  nombreProduit.addEventListener("input", (e) => {
    e.stopPropagation;
    if (e.target.value > 0 && e.target.value <= 100) {
      quantitéSelectionner = e.target.value;
      console.log("quantité chosie: " + quantitéSelectionner);
    } else {
      alert("Veuillez choisir une quantité comprise entre 0 et 100");
      nombreProduit.setAttribute("value", (e.target.value = 0));
    }
  });

  /* Controle q'une couleur est bien sélectionnée */
  optionCouleur.addEventListener("input", (e) => {
    e.stopPropagation;
    if (e.target.value != "") {
      couleurSelectionner = e.target.value;
      console.log("couleur choisie: " + couleurSelectionner);
    } else {
      alert("Veuillez selectionner une couleur");
    }
  });
}

/* Ajouter des produits dans le localStorage au clic du bouton*/
ajoutPanier.addEventListener("click", (e) => {
  controleOption();
  e.preventDefault;
  let couleur = optionCouleur.value;
  let quantité = Number(nombreProduit.value);
  let produitDansLocalStorage = [];
  panier = [idProduit, couleur, quantité];

  /* Si il y a déjà des produits dans le localStorage */
  if (localStorage.getItem("produit")) {
    /*récupération des donnés dans le localStorage */
    produitDansLocalStorage = JSON.parse(localStorage.getItem("produit"));

    /* Vérification qu'un produit de même id et même couleur se trouve déjà dans localStorage */
    let objetPanier = produitDansLocalStorage.findIndex(
      (element) => element[0] === panier[0] && element[1] === panier[1]
    );

    /* Si même id et même couleur, alors ajout de la quantité */
    if (objetPanier != -1) {
      produitDansLocalStorage[objetPanier][2] += panier[2];
    } else if ((objetPanier = -1)) {
      /* Si different, alors ajout au panier */
      produitDansLocalStorage.push(panier);
    }

    /* Envoie au localeStorage */
    localStorage.setItem("produit", JSON.stringify(produitDansLocalStorage));

    /* Si le localStorage est vide, envoie au panier puis dans localStorage */
  } else {
    produitDansLocalStorage = [];
    produitDansLocalStorage.push(panier);
    localStorage.setItem("produit", JSON.stringify(produitDansLocalStorage));
  }
});
