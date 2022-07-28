/*Requête de l’API pour lui demander l’ensemble des produits*/
fetch("http://localhost:3000/api/products")
  .then(function (reponse) {
    if (reponse.ok) {
      return reponse.json();
    }
  })
  .then(function (donnees) {
    console.log(donnees);
    produit(donnees);
  })
  .catch(function (erreur) {
    console.log(erreur);
  });

/*Insertions des données récupérées dans le code HTML*/
const produits = document.getElementById("items");

/* Pour chaque produit les données sont insérées dans le code HTML via une boucle */
let produit = function (donnees) {
  for (let i = 0; i < donnees.length; i++) {
    const codeHtmlProduits = `<a href="product.html?id=${donnees[i]._id}">
        <article>
          <img src="${donnees[i].imageUrl}" alt="${donnees[i].atlTxt}" />
          <h3 class="productName">${donnees[i].name}</h3>
          <p class="productDescription">${donnees[i].description}</p>
        </article>
      </a>`;
    produits.insertAdjacentHTML("afterbegin", codeHtmlProduits);
  }
};
