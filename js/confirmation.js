/* Récupération du numéro de cammande dans l'URL */
const orderId = new URL(document.location).searchParams.get("orderId");

/* Insertion du numéro de commande dans le code HTML */
document.getElementById("orderId").textContent = orderId;
