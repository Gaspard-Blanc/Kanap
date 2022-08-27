/*----------------------- Partie panier -----------------------*/

const produits = document.getElementById("cart__items");
const article = document.querySelectorAll(".cart__item");
const nombreTotalArticle = document.getElementById("totalQuantity");
const prixTotal = document.getElementById("totalPrice");
const quantiteArticles = document.querySelectorAll(".itemQuantity");
const boutonSupprimer = document.querySelectorAll("p.deleteItem");

let prixTotalParArticle = 0;
let prixTotalArticles = 0;
let quantitéSelectionner = 0;
let prixArticle = 0;

/* Récupérer les données du localStorage */
let produitDansLocalStorage = JSON.parse(localStorage.getItem("produit"));
let donnees;

/*Requête de l’API pour lui demander les informations des produits*/
const requeteProduits = async () => {
  await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((json) => (donnees = json))
    .catch((error) => console.error(error));

  const localStorage = async () => {
    /* Si il y a un produit dans la localStorage */
    if (produitDansLocalStorage) {
      await produitDansLocalStorage;

      for (let infoProduit of produitDansLocalStorage) {
        const infoApi = donnees.find((p) => p._id === infoProduit[0]);

        affichageProduit(infoProduit, infoApi);
        calculNombreArticle();

        prixParArticle = infoProduit[2] * infoApi.price;
        calculPrixTotal();
      }
      /* Si le localStorage est vide */
    } else {
      alert("Votre Panier est vide");
      window.location.href = "./index.html";
    }
    changementQuantite();
    supprimerArticle();
  };
  localStorage();
};
requeteProduits();

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
  prixTotalArticles += prixParArticle;
  prixTotal.textContent = prixTotalArticles;
}

/* Changement du nombre de produits et MAJ du localStorage */
function changementQuantite() {
  const quantiteArticles = document.querySelectorAll(".itemQuantity");
  quantiteArticles.forEach((quantiteArticle) => {
    quantiteArticle.addEventListener("change", (e) => {
      let articleAModifier = quantiteArticle.closest(".cart__item");
      produitDansLocalStorage.map((produit) => {
        /* Controle que le produit à la même ID et la même couleur */
        if (
          produit[0] === articleAModifier.dataset.id &&
          produit[1] === articleAModifier.dataset.color
        ) {
          /* Empeche les décimales */
          produit[2] = Math.round(e.target.value);
          /* Met la valeur à 1 quand cette valeur est inférieur à 1 */
          if (produit[2] < 1) {
            produit[2] = 1;
          }
        }
        localStorage.setItem(
          "produit",
          JSON.stringify(produitDansLocalStorage)
        );
      });

      if (e.target.value > 0 && e.target.value <= 100 && e.target.value != 0) {
        calculNombreArticle();
      } else {
        alert("La quantité doit être comprise entre 1 et 100");
        e.target.value = 1;
      }

      location.reload();
    });
  });
}

/* Suppression d'un article (même id et même couleur) et MAJ du localStorage */
function supprimerArticle() {
  const boutonSupprimer = document.querySelectorAll("p.deleteItem");

  boutonSupprimer.forEach((boutons) => {
    const produitASupprimer = boutons.closest(".cart__item");
    boutons.addEventListener("click", () => {
      produitASupprimer.remove("article");

      for (var i = 0; i < produitDansLocalStorage.length; i++) {
        produitPanier = produitDansLocalStorage[i];

        /* Controle que le produit à la même ID et la même couleur */
        if (
          produitASupprimer.dataset.id == produitPanier[0] &&
          produitASupprimer.dataset.color == produitPanier[1]
        ) {
          let objIndex = produitDansLocalStorage.indexOf(produitPanier);
          produitDansLocalStorage.splice(objIndex, 1);
        }
      }

      /* Renvoi sur la page d'accueil quand le panier est vide */
      if (produitDansLocalStorage.length == 0) {
        localStorage.removeItem("produit");
        window.location.href = "./index.html";
      } else {
        localStorage.setItem(
          "produit",
          JSON.stringify(produitDansLocalStorage)
        );
      }

      location.reload();
    });
  });
}

/* Insertions des données récupérées dans le code HTML */
let affichageProduit = function (infoProduit, infoApi) {
  const codeHtmlProduits = `<article class="cart__item" data-id="${infoProduit[0]}" data-color="${infoProduit[1]}">
  <div class="cart__item__img">
  <img src="${infoApi.imageUrl}" alt="${infoApi.altTxt}">
  </div>
  <div class="cart__item__content">
  <div class="cart__item__content__description">
  <h2>${infoApi.name}</h2>
  <p>${infoProduit[1]}</p>
  <p>${infoApi.price} €</p>
  </div>
  <div class="cart__item__content__settings">
  <div class="cart__item__content__settings__quantity">
  <p>Qté : </p>
  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${infoProduit[2]}">
  </div>
  <div class="cart__item__content__settings__delete">
  <p class="deleteItem">Supprimer</p>
  </div>
  </div>
  </div>
  </article>`;
  produits.insertAdjacentHTML("afterbegin", codeHtmlProduits);

  produitDansLocalStorage.sort();
};

/*----------------------- Partie formulaire -----------------------*/

const prenom = document.getElementById("firstName");
const nom = document.getElementById("lastName");
const adresse = document.getElementById("address");
const ville = document.getElementById("city");
const email = document.getElementById("email");
const commande = document.getElementById("order");

let regexGeneral = /^[a-zA-Z\-çñàéèêëïîôüù ]{2,}$/;
let regexEmail = /^[A-Za-z0-9\-\.]+@([A-Za-z0-9\-]+\.)+[A-Za-z0-9-]{2,4}$/;
let regexAdresse = /^[0-9a-zA-Z\s,.'-çñàéèêëïîôüù]{6,}$/;

/* Vérification du champ Prénom */
prenom.addEventListener("input", (e) => {
  e.preventDefault();
  if (regexGeneral.test(prenom.value) == false || prenom.value == "") {
    document.getElementById("firstNameErrorMsg").innerHTML =
      "Attention, votre 'Prénom' n'est pas valide";
    return false;
  } else {
    document.getElementById("firstNameErrorMsg").innerHTML = "";
    return true;
  }
});

/* Vérification du champ Nom */
nom.addEventListener("input", (e) => {
  e.preventDefault();
  if (regexGeneral.test(nom.value) == false || nom.value == "") {
    document.getElementById("lastNameErrorMsg").innerHTML =
      "Attention, votre 'Nom' n'est pas valide";
    return false;
  } else {
    document.getElementById("lastNameErrorMsg").innerHTML = "";
    return true;
  }
});

/* Vérification du champ Adresse */
adresse.addEventListener("input", (e) => {
  e.preventDefault();
  if (regexAdresse.test(adresse.value) == false || adresse.value == "") {
    document.getElementById("addressErrorMsg").innerHTML =
      "Attention, votre 'Adresse' n'est pas valide";
    return false;
  } else {
    document.getElementById("addressErrorMsg").innerHTML = "";
    return true;
  }
});

/* Vérification du champ Ville */
ville.addEventListener("input", (e) => {
  e.preventDefault();
  if (regexGeneral.test(ville.value) == false || ville.value == "") {
    document.getElementById("cityErrorMsg").innerHTML =
      "Attention, votre 'Ville' n'est pas valide";
    return false;
  } else {
    document.getElementById("cityErrorMsg").innerHTML = "";
    return true;
  }
});

/* Vérification du champ Email */
email.addEventListener("input", (e) => {
  e.preventDefault();
  if (regexEmail.test(email.value) == false || email.value == "") {
    document.getElementById("emailErrorMsg").innerHTML =
      "Attention, votre 'Email' n'est pas valide";
    return false;
  } else {
    document.getElementById("emailErrorMsg").innerHTML = "";
    return true;
  }
});

/* Ajout des données utilisateur et du panier dans le au clic du bouton Commander */
commande.addEventListener("click", (e) => {
  e.preventDefault();
  /* Récupération des données utilisateur */
  let contact = {
    firstName: prenom.value,
    lastName: nom.value,
    address: adresse.value,
    city: ville.value,
    email: email.value,
  };

  /* Vérification des champs non vides */
  if (
    prenom.value === "" ||
    nom.value === "" ||
    adresse.value === "" ||
    ville.value === "" ||
    email.value === ""
  ) {
    alert("Merci de rentrer les informations requises pour passer commande.");
  } else if (
    /* Vérification du bon remplissage des champs */
    regexGeneral.test(nom.value) == false ||
    regexGeneral.test(prenom.value) == false ||
    regexAdresse.test(adresse.value) == false ||
    regexGeneral.test(ville.value) == false ||
    regexEmail.test(email.value) == false
  ) {
    alert("Attention, veuillez renseigner correctement vos coordonnées.");
  } else {
    /* Récupération des ID des produits dans le localStorage */
    let products = [];

    produitDansLocalStorage.forEach((produit) => {
      for (i = 0; i <= produitDansLocalStorage.lenght; i++) {
        produitPanier = produitDansLocalStorage[i];
      }
      products.push(produit[0]);
    });

    /* Envoie des données utilisateur et du panier à l'API */
    let commandeFinal = { contact, products };
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(commandeFinal),
    })
      .then((res) => {
        return res.json();
      })
      .then((confirm) => {
        window.location.href = "./confirmation.html?orderId=" + confirm.orderId;
        localStorage.clear();
      })
      .catch((error) => {
        console.log("Une erreur est survenue", error);
      });
  }
});
