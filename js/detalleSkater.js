import { db } from "./firebase.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* ======================
OBTENER ID DE LA URL
====================== */

const params = new URLSearchParams(window.location.search);
const id = params.get("id");


/* ======================
CARGAR SKATER
====================== */

async function cargarSkater(){

if(!id){
console.log("No hay ID");
return;
}

try{

const ref = doc(db,"skaters",id);

const snap = await getDoc(ref);

if(!snap.exists()){
console.log("No existe documento");
return;
}

const data = snap.data();


document.getElementById("nombre").textContent = data.nombre || "";
document.getElementById("apellido").textContent = data.apellido || "";
document.getElementById("edad").textContent = data.edad || "";
document.getElementById("fecha").textContent = data.fecha || "";
document.getElementById("pago").textContent = data.pago || "";


/* FIRMA */

if(data.firma){

document.getElementById("firmaImg").src = data.firma;

}

}catch(error){

console.error("Error cargando skater:",error);

}

}

cargarSkater();