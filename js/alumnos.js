import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const btnAgregar = document.getElementById("btnAgregar");
const btnEliminar = document.getElementById("btnEliminar");
const modal = document.getElementById("modalAlumno");
const guardarBtn = document.getElementById("guardarAlumno");
const grid = document.getElementById("alumnosGrid");
const totalBox = document.getElementById("totalAlumnos");

const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const nivelInput = document.getElementById("nivel");
const obsDeportivaInput = document.getElementById("obsespirituales");
const obsMedicaInput = document.getElementById("obsMedica");
const fotoInput = document.getElementById("foto");

const alumnosRef = collection(db, "alumnos");

let modoEliminar = false;

/* ===== MODAL ===== */
btnAgregar.onclick = () => modal.style.display = "flex";

modal.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

/* ===== ELIMINAR ===== */
btnEliminar.onclick = () => {
  modoEliminar = !modoEliminar;
  btnEliminar.textContent = modoEliminar ? "Cancelar" : "Eliminar";
  renderAlumnos();
};

/* ===== RENDER ===== */
async function renderAlumnos() {

  const niveles = {
    Principiante: [],
    Intermedio: [],
    Avanzado: []
  };

  let total = 0;

  const snapshot = await getDocs(alumnosRef);

  snapshot.forEach(d => {
    const al = d.data();
    const id = d.id;

    if (niveles[al.nivel]) {
      niveles[al.nivel].push({ ...al, id });
      total++;
    }
  });

  totalBox.textContent = total;

  let htmlFinal = "";

  for (const nivel in niveles) {

    if (niveles[nivel].length === 0) continue;

    htmlFinal += `
      <h2 class="nivel-titulo">${nivel}</h2>
      <div class="nivel-grid">
    `;

    niveles[nivel].forEach(al => {
      htmlFinal += `
        <div class="alumno-card">
          <img src="${al.foto}">
          <h3>${al.nombre} ${al.apellido}</h3>

          ${
            modoEliminar
              ? `<button class="btn" style="background:#333"
                   onclick="eliminarAlumno('${al.id}')">
                   Eliminar
                 </button>`
              : `<button class="btn"
                   onclick="window.location.href='infoAlumno.html?id=${al.id}'">
                   Información
                 </button>`
          }

        </div>
      `;
    });

    htmlFinal += `</div>`;
  }

  grid.innerHTML = htmlFinal;
}

/* ===== GUARDAR (CON COMPRESIÓN 🔥) ===== */
guardarBtn.onclick = () => {

  if (!nombreInput.value || !apellidoInput.value || !nivelInput.value) {
    alert("Llena los campos");
    return;
  }

  const file = fotoInput.files[0];
  if (!file) {
    alert("Selecciona foto");
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {

    const img = new Image();
    img.src = e.target.result;

    img.onload = async () => {

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const MAX_WIDTH = 600;

      const scale = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressed = canvas.toDataURL("image/jpeg", 0.6);

      await addDoc(alumnosRef, {
        nombre: nombreInput.value,
        apellido: apellidoInput.value,
        nivel: nivelInput.value,
        obsDeportiva: obsDeportivaInput.value,
        obsMedica: obsMedicaInput.value,
        foto: compressed
      });

      modal.style.display = "none";
      limpiarInputs();
      renderAlumnos();
    };
  };

  reader.readAsDataURL(file);
};

/* ===== LIMPIAR ===== */
function limpiarInputs() {
  nombreInput.value = "";
  apellidoInput.value = "";
  nivelInput.value = "";
  obsDeportivaInput.value = "";
  obsMedicaInput.value = "";
  fotoInput.value = "";
}

/* ===== ELIMINAR ===== */
window.eliminarAlumno = async (id) => {
  if (confirm("¿Deseas eliminar este registro?")) {
    await deleteDoc(doc(db, "alumnos", id));
    modoEliminar = false;
    btnEliminar.textContent = "Eliminar";
    renderAlumnos();
  }
};

/* ===== INICIO ===== */
window.addEventListener("DOMContentLoaded", renderAlumnos);