const produits = document.getElementById("cart__items");
const nombreTotalArticle = document.getElementById("totalQuantity");
const prixTotal = document.getElementById("totalPrice");
const boutonSupprimer = document.querySelectorAll(".deleteItem");
const quantiteArticle = document.querySelector(".itemQuantity");

let prixTotalParArticle = 0;
let prixTotalArticles = 0;
let quantitéSelectionner = 0;
let prixArticle = 0;
let panier = [];

/* Récupérer les données du localStorage */
let produitDansLocalStorage = JSON.parse(localStorage.getItem("produit"));
let produitPanier = [];

for (let i = 0; i < produitDansLocalStorage.length; i++) {
  produitPanier = produitDansLocalStorage[i];
  /*Requête de l’API pour lui demander les informations du produit*/
  fetch("http://localhost:3000/api/products/" + produitPanier[0])
    .then(function (reponse) {
      if (reponse.ok) {
        return reponse.json();
      }
    })
    .then(function (donnees) {
      console.log(donnees);
      prixArticle = donnees.price;
      produit(donnees, produitDansLocalStorage[i]);
      calculNombreArticle();
      changementQuantite();
    })
    .catch(function (erreur) {
      console.log(erreur);
    });
}

/* Calcul du nombre d'articles */
function calculNombreArticle() {
  let quantiteArticle = document.querySelectorAll(".itemQuantity");
  let nombreArticle = 0;
  quantiteArticle.forEach((quantite) => {
    nombreArticle += Number(quantite.value);
    nombreTotalArticle.textContent = nombreArticle;
  });
}

/* Calcul du prix total */
function calculPrixTotal() {
  let quantiteArticle = document.querySelectorAll(".itemQuantity");
  prixTotalArticle = 0;
  for (i = 0; i < quantiteArticle.length; i++) {
    prixTotalParArticle = prixArticle * Number(quantiteArticle[i].value);

    console.log(quantiteArticle);
    console.log("prix: " + prixArticle);
  }
  prixTotalArticles += prixTotalParArticle;

  prixTotal.textContent = prixTotalArticles;
}

/*Insertions des données récupérées dans le code HTML*/
let produit = function (donnees, produitPanier) {
  const codeHtmlProduits = `<article class="cart__item" data-id="${produitPanier[0]}" data-color="${produitPanier[1]}">
  <div class="cart__item__img">
  <img src="${donnees.imageUrl}" alt="${donnees.atlTxt}">
  </div>
  <div class="cart__item__content">
  <div class="cart__item__content__description">
  <h2>${donnees.name}</h2>
  <p>${produitPanier[1]}</p>
  <p>${donnees.price} €</p>
  </div>
  <div class="cart__item__content__settings">
  <div class="cart__item__content__settings__quantity">
    <p>Qté : </p>
    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produitPanier[2]}">
    </div>
    <div class="cart__item__content__settings__delete">
    <p class="deleteItem">Supprimer</p>
    </div>
    </div>
    </div>
    </article>`;
  produits.insertAdjacentHTML("afterbegin", codeHtmlProduits);
};

/* Changement du nombre de produits et MAJ du localStorage */
function changementQuantite() {
  const quantiteArticles = document.querySelectorAll(".itemQuantity");
  quantiteArticles.forEach((quantiteArticle) => {
    quantiteArticle.addEventListener("change", (e) => {
      let articleAModifier = quantiteArticle.closest(".cart__item");
      e.preventDefault;
      console.log(articleAModifier.dataset.color);

      produitDansLocalStorage.map((produit) => {
        console.log(produit[0]);
        if (
          produit[0] === articleAModifier.dataset.id &&
          produit[1] === articleAModifier.dataset.color
        ) {
          produit[2] = e.target.value;
        }
        localStorage.setItem(
          "produit",
          JSON.stringify(produitDansLocalStorage)
        );
      });

      if (e.target.value > 0 && e.target.value <= 100) {
        calculNombreArticle();

        console.log("nouvelle quantité: " + quantiteArticle.value);
      } else {
        alert("Veuillez choisir une quantité comprise entre 0 et 100");
      }
    });
    calculPrixTotal();
  });
}

//
