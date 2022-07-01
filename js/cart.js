const produits = document.getElementById("cart__items");
/* Récupérer les données du localStorage */
let produitDansLocalStorage = JSON.parse(localStorage.getItem("produit"));
let produitPanier = [];
console.log(produitDansLocalStorage);

for (let i = 0; i < produitDansLocalStorage.length; i++) {
  produitPanier = produitDansLocalStorage[i];

  /*Requête de l’API pour lui demander les information du produit*/
  fetch("http://localhost:3000/api/products/" + produitPanier[0])
    .then(function (reponse) {
      if (reponse.ok) {
        return reponse.json();
      }
    })
    .then(function (donnees) {
      console.log(donnees);
      produit(donnees, produitDansLocalStorage[i]);
    })
    .catch(function (erreur) {
      console.log(erreur);
    });
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
