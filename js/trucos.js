import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const trucosRef = collection(db,"trucos");

const tablaPrincipiante = document.getElementById("tablaPrincipiante");
const tablaIntermedio = document.getElementById("tablaIntermedio");
const tablaAvanzado = document.getElementById("tablaAvanzado");


async function cargarTrucos(){

tablaPrincipiante.innerHTML="";
tablaIntermedio.innerHTML="";
tablaAvanzado.innerHTML="";

const snapshot = await getDocs(trucosRef);

snapshot.forEach(d=>{

const data = d.data();

let tabla;

if(data.nivel==="Principiante") tabla = tablaPrincipiante;
if(data.nivel==="Intermedio") tabla = tablaIntermedio;
if(data.nivel==="Avanzado") tabla = tablaAvanzado;

const fila = document.createElement("tr");

fila.innerHTML=`

<td>

${data.truco}

<button class="btn-eliminar" onclick="eliminar('${d.id}')">
❌
</button>

</td>

`;

tabla.appendChild(fila);

});

}


window.agregarTruco = async (nivel)=>{

const nombre = prompt("Nombre del truco");

if(!nombre) return;

await addDoc(trucosRef,{
truco:nombre,
nivel:nivel
});

cargarTrucos();

};


window.eliminar = async (id)=>{

await deleteDoc(doc(db,"trucos",id));

cargarTrucos();

};


cargarTrucos();