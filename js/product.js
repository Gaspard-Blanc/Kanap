/* Récupération de l'ID du produit*/

let pageCourante = window.location.href ;
let url = new URL(pageCourante);
let idProduit = url.searchParams.get("id");
console.log(idProduit);

