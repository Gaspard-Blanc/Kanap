/* Récupération de l'ID du produit*/

let pageCourante = window.location.href ;
let url = new URL(pageCourante);
let idProduit = url.searchParams.get("id");
console.log(idProduit);

const image = document.querySelector ('.item__img');
const imageProduit = document.createElement ('img');
const nomProduit = document.querySelector ('#title');
const prixProduit = document.querySelector ('#price');
const descriptionProduit = document.querySelector ('#description');
const optionCouleur = document.querySelector ('#colors');


/*Requête de l’API pour lui demander les informations du produit*/

fetch('http://localhost:3000/api/products/' + idProduit)
  .then(function(reponse) {
    if (reponse.ok) {
      return reponse.json();
    }
  })
  .then(function(informations) {
    console.log(informations);

    /*Insertions dans le code HTML des données récupérées*/

    image.appendChild(imageProduit);
    imageProduit.setAttribute('src', informations.imageUrl);
    imageProduit.setAttribute('alt', informations.altTxt);
    nomProduit.textContent = informations.name;
    prixProduit.textContent = informations.price;
    descriptionProduit.textContent = informations.description;
    
    
    let couleur = informations.colors;    
    for (let i = 0; i < couleur.length; i++) {
      const couleurProduit = document.createElement ('option');
      optionCouleur.appendChild(couleurProduit);
      couleurProduit.setAttribute('value', couleur[i]);
      couleurProduit.textContent = couleur[i];
    }

  })
  .catch(function(erreur) {
    console.log(erreur);
  });

