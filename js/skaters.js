import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("skaterForm");
const tabla = document.getElementById("tablaSkaters");
const totalPago = document.getElementById("totalPago");
const limpiarBtn = document.getElementById("limpiarBtn");

const skatersRef = collection(db, "skaters");

/* =========================
   RENDER TABLA
========================= */
async function render() {

  tabla.innerHTML = "";
  let total = 0;

  const snapshot = await getDocs(skatersRef);

  snapshot.forEach(d => {

    const s = d.data();
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${s.nombre ?? ""} ${s.apellido ?? ""}</td>
      <td>${s.edad ?? ""}</td>
      <td>${s.fecha ?? ""}</td>
      <td>$${s.pago ?? 0}</td>
      <td>
        <a href="detalleSkater.html?id=${d.id}" 
           class="btn" 
           style="padding:6px 12px; font-size:0.75rem;">
           Ver Contrato
        </a>
      </td>
    `;

    tabla.appendChild(row);

    total += Number(s.pago ?? 0);
  });

  totalPago.textContent = total;
}

/* =========================
   AGREGAR MANUAL
========================= */
form?.addEventListener("submit", async (e) => {

  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const edad = document.getElementById("edad").value;
  const fecha = document.getElementById("fecha").value;
  const pago = document.getElementById("pago").value;

  await addDoc(skatersRef, {
    nombre,
    edad,
    fecha,
    pago: Number(pago)
  });

  form.reset();
  render();
});

/* =========================
   LIMPIAR TODOS
========================= */
limpiarBtn?.addEventListener("click", async () => {

  if (confirm("¿Seguro que deseas borrar TODOS los registros?")) {

    const snapshot = await getDocs(skatersRef);

    for (const d of snapshot.docs) {
      await deleteDoc(doc(db, "skaters", d.id));
    }

    tabla.innerHTML = "";
    totalPago.textContent = "0";
  }

});

/* =========================
   INICIO
========================= */
render();