import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===== ID ===== */
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const container = document.getElementById("infoAlumno");
const trucosRef = collection(db, "trucos");

/* ===== NIVELES ===== */
const niveles = ["Principiante", "Intermedio", "Avanzado"];

/* ===== CARGAR ===== */
async function cargarAlumno() {

  const docRef = doc(db, "alumnos", id);
  const snap = await getDoc(docRef);

  const al = snap.data();

  const snapshot = await getDocs(trucosRef);

  let listaTrucos = [];

  snapshot.forEach(d => {
    const t = d.data();

    if (t.nivel === al.nivel) {
      listaTrucos.push(
        t.nombre || t.truco || t.nombreTruco || "Truco"
      );
    }
  });

  /* ===== PROGRESO GUARDADO ===== */
  let progreso = al.trucosCompletados || [];

  /* ===== HTML ===== */
  container.innerHTML = `
  <div class="info-container">

    <img src="${al.foto}">
    <h2>${al.nombre} ${al.apellido}</h2>
    <p><b>Nivel:</b> ${al.nivel}</p>

    <!-- 🔥 OBSERVACIONES -->
    <div style="margin-top:20px; text-align:left;">

      <p><b>Observaciones médicas:</b></p>
      <div style="background:#111; padding:10px; border-radius:10px; margin-bottom:15px;">
        ${al.obsMedica || "Sin información"}
      </div>

      <p><b>Observaciones espirituales:</b></p>
      <textarea id="obsInput" style="width:100%; padding:10px; border-radius:10px;">
${al.obsDeportiva || ""}
      </textarea>

      <button id="guardarObs" class="btn" style="margin-top:10px;">
        Guardar cambios
      </button>

      <p id="msg" style="display:none; font-size:.9rem;">Guardado ✅</p>

    </div>

    <!-- 🔥 PROGRESO ARRIBA -->
    <h3>Progreso del Nivel</h3>

    <div class="progress-bar">
      <div id="progressFill"></div>
    </div>

    <p id="progressText"></p>

    <!-- CHECKLIST -->
    <h3 style="margin-top:25px;">Checklist de trucos</h3>

    <table class="tricks-table">
      <tbody>
        ${listaTrucos.map(truco => `
          <tr>
            <td>${truco}</td>
            <td>
              <input type="checkbox"
              ${progreso.includes(truco) ? "checked" : ""}
              onchange="toggleTruco('${truco}')">
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>

  </div>
  `;

  /* ===== GUARDAR OBS ===== */
  document.getElementById("guardarObs").onclick = async () => {

    const texto = document.getElementById("obsInput").value;

    await updateDoc(docRef, {
      obsDeportiva: texto
    });

    const msg = document.getElementById("msg");
    msg.style.display = "block";

    setTimeout(() => msg.style.display = "none", 2000);
  };

  actualizarBarra(listaTrucos, progreso);
  window.toggleTruco = (t) => toggleTruco(t, listaTrucos, progreso, docRef, al);
}


/* ===== TOGGLE TRUCO ===== */
async function toggleTruco(truco, lista, progreso, docRef, al) {

  if (progreso.includes(truco)) {
    progreso = progreso.filter(t => t !== truco);
  } else {
    progreso.push(truco);
  }

  await updateDoc(docRef, {
    trucosCompletados: progreso
  });

  actualizarBarra(lista, progreso);

  /* ===== SI COMPLETA TODO ===== */
  if (progreso.length === lista.length) {

    if (al.nivel !== "Avanzado") {

      alert("🔥 ¡Nivel completado! Subiendo de nivel...");

      const index = niveles.indexOf(al.nivel);
      const nuevoNivel = niveles[index + 1];

      await updateDoc(docRef, {
        nivel: nuevoNivel,
        trucosCompletados: []
      });

      location.reload();

    } else {
      alert("🏆 ¡Ya estás en el nivel máximo!");
    }
  }
}


/* ===== BARRA ===== */
function actualizarBarra(lista, progreso) {

  const porcentaje = lista.length === 0
    ? 0
    : Math.round((progreso.length / lista.length) * 100);

  document.getElementById("progressFill").style.width = porcentaje + "%";

  document.getElementById("progressText").innerText =
    porcentaje + "% completado";
}


/* ===== INIT ===== */
cargarAlumno();