import { db } from "./firebase.js";

import {
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const form = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensajeExito");
const limpiarBtn = document.getElementById("limpiarFirma");

const canvas = document.getElementById("firmaCanvas");
const ctx = canvas.getContext("2d");

const skatersRef = collection(db,"skaters");


/* =============================
GUARDAR TEMPORALMENTE FORMULARIO
============================= */

const campos = ["nombre","apellido","edad","fecha","pago"];

window.addEventListener("load",()=>{

campos.forEach(id=>{

const valor = sessionStorage.getItem(id);

if(valor){
document.getElementById(id).value = valor;
}

});

});


campos.forEach(id=>{

const input = document.getElementById(id);

input.addEventListener("input",()=>{

sessionStorage.setItem(id,input.value);

});

});


/* =============================
AJUSTAR TAMAÑO CANVAS
============================= */

function resizeCanvas(){

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);


/* =============================
CONFIGURACION DIBUJO
============================= */

ctx.lineWidth = 2;
ctx.lineCap = "round";
ctx.strokeStyle = "#000";

let dibujando = false;


/* =============================
FUNCIONES DIBUJO
============================= */

function iniciarDibujo(x,y){

dibujando = true;

ctx.beginPath();
ctx.moveTo(x,y);

}


function dibujar(x,y){

if(!dibujando) return;

ctx.lineTo(x,y);
ctx.stroke();

}


function terminarDibujo(){

dibujando = false;
ctx.closePath();

}


/* =============================
EVENTOS MOUSE (COMPUTADORA)
============================= */

canvas.addEventListener("mousedown",(e)=>{

iniciarDibujo(e.offsetX,e.offsetY);

});

canvas.addEventListener("mousemove",(e)=>{

dibujar(e.offsetX,e.offsetY);

});

canvas.addEventListener("mouseup",terminarDibujo);

canvas.addEventListener("mouseleave",terminarDibujo);


/* =============================
EVENTOS TOUCH (CELULAR)
============================= */

canvas.addEventListener("touchstart",(e)=>{

e.preventDefault();

const rect = canvas.getBoundingClientRect();
const touch = e.touches[0];

const x = touch.clientX - rect.left;
const y = touch.clientY - rect.top;

iniciarDibujo(x,y);

});


canvas.addEventListener("touchmove",(e)=>{

e.preventDefault();
e.stopPropagation();

const rect = canvas.getBoundingClientRect();
const touch = e.touches[0];

const x = touch.clientX - rect.left;
const y = touch.clientY - rect.top;

dibujar(x,y);

});


canvas.addEventListener("touchend",terminarDibujo);



/* =============================
LIMPIAR FIRMA
============================= */

limpiarBtn.addEventListener("click",()=>{

ctx.clearRect(0,0,canvas.width,canvas.height);

});


/* =============================
GUARDAR REGISTRO
============================= */

form.addEventListener("submit",async(e)=>{

e.preventDefault();

const nombre = document.getElementById("nombre").value;
const apellido = document.getElementById("apellido").value;
const edad = document.getElementById("edad").value;
const fecha = document.getElementById("fecha").value;
const pago = document.getElementById("pago").value;


/* FIRMA */

const firma = canvas.toDataURL("image/png");


await addDoc(skatersRef,{

nombre,
apellido,
edad,
fecha,
pago,
firma,
timestamp: Date.now()

});


/* LIMPIAR FORM */

sessionStorage.clear();

form.reset();

ctx.clearRect(0,0,canvas.width,canvas.height);


mensaje.style.display = "block";


setTimeout(()=>{

mensaje.style.display = "none";

},3000);

});