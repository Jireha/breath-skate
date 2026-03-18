import { db } from "./firebase.js";

import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* ===============================
REFERENCIAS
=============================== */

const planeacionRef = doc(db, "planeacion", "clase");
const alumnosRef = collection(db, "alumnos");


/* ===============================
CARGAR ALUMNOS POR NIVEL (FIX PRO)
=============================== */

async function cargarAlumnos() {

  const snapshot = await getDocs(alumnosRef);

  let principiantes = [];
  let intermedios = [];
  let avanzados = [];

  snapshot.forEach(docu => {

    const a = docu.data();

    // 🔥 NORMALIZAR TEXTO
    const nivel = (a.nivel || "").toLowerCase().trim();

    const nombreCompleto = `${a.nombre || ""} ${a.apellido || ""}`.trim();

    if (nivel.includes("principiante")) {
      principiantes.push(nombreCompleto);
    }

    if (nivel.includes("intermedio")) {
      intermedios.push(nombreCompleto);
    }

    if (nivel.includes("avanzado")) {
      avanzados.push(nombreCompleto);
    }

  });

  // 🔥 MOSTRAR EN HTML (con saltos de línea bonito)
  document.getElementById("alumnosPrincipiante").innerHTML =
    principiantes.length ? principiantes.join("<br>") : "Sin alumnos";

  document.getElementById("alumnosIntermedio").innerHTML =
    intermedios.length ? intermedios.join("<br>") : "Sin alumnos";

  document.getElementById("alumnosAvanzado").innerHTML =
    avanzados.length ? avanzados.join("<br>") : "Sin alumnos";

}


/* ===============================
CARGAR PLANEACION
=============================== */

async function cargarPlaneacion() {

  const snap = await getDoc(planeacionRef);

  if (!snap.exists()) return;

  const data = snap.data();

  document.querySelectorAll("textarea").forEach(area => {

    const field = area.dataset.field;

    if (data[field]) {
      area.value = data[field];
    }

  });

}


/* ===============================
GUARDAR AUTOMATICAMENTE
=============================== */

function activarGuardado() {

  document.querySelectorAll("textarea").forEach(area => {

    area.addEventListener("input", async () => {

      const campo = area.dataset.field;

      await setDoc(planeacionRef, {
        [campo]: area.value
      }, {
        merge: true
      });

    });

  });

}


/* ===============================
INICIO
=============================== */

async function iniciar() {

  await cargarAlumnos();
  await cargarPlaneacion();
  activarGuardado();

}

iniciar();