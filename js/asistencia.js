import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const alumnosRef = collection(db, "alumnos");
const asistenciasRef = collection(db, "asistencias");

const encabezadoDias = document.getElementById("encabezadoDias");
const cuerpoAsistencia = document.getElementById("cuerpoAsistencia");
const canvasGrafica = document.getElementById("graficaAsistencia");
const mesActualDiv = document.getElementById("mesActual");

let sabadosGlobal = [];
let chart = null;


/* ===== MES ===== */
function mostrarMesActual() {
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const hoy = new Date();
  mesActualDiv.innerText = meses[hoy.getMonth()] + " " + hoy.getFullYear();
}


/* ===== SABADOS ===== */
function obtenerSabadosDelMes() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth();
  const sabados = [];
  const fecha = new Date(anio, mes, 1);

  while (fecha.getMonth() === mes) {
    if (fecha.getDay() === 6) sabados.push(fecha.getDate());
    fecha.setDate(fecha.getDate() + 1);
  }
  return sabados;
}

function fechaKey(dia) {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${hoy.getMonth()+1}-${dia}`;
}


/* ===== ENCABEZADO ===== */
function crearEncabezado(sabados) {
  encabezadoDias.innerHTML = "<th>Alumno</th>";
  sabados.forEach(dia => {
    encabezadoDias.innerHTML += `<th>${dia}</th>`;
  });
}


/* ===== FIREBASE ===== */
async function guardarAsistencia(alumnoId, fecha, valor) {
  const ref = doc(asistenciasRef, alumnoId);
  const snap = await getDoc(ref);
  let data = snap.exists() ? snap.data() : {};
  data[fecha] = valor;
  await setDoc(ref, data);
}

async function cargarAlumno(alumnoId) {
  const ref = doc(asistenciasRef, alumnoId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : {};
}


/* ===== TABLA ===== */
async function renderTabla() {
  sabadosGlobal = obtenerSabadosDelMes();
  crearEncabezado(sabadosGlobal);

  const alumnosSnap = await getDocs(alumnosRef);
  cuerpoAsistencia.innerHTML = "";

  for (const docAl of alumnosSnap.docs) {
    const alumno = docAl.data();
    const id = docAl.id;
    const data = await cargarAlumno(id);

    let fila = `<tr><td>${alumno.nombre} ${alumno.apellido}</td>`;

    sabadosGlobal.forEach(dia => {
      const key = fechaKey(dia);
      const valor = data[key];

      fila += `
      <td>
        <input type="checkbox"
        ${valor === true ? "checked" : ""}
        onchange="window.toggleAsistencia('${id}','${key}',this.checked)">
      </td>`;
    });

    fila += "</tr>";
    cuerpoAsistencia.innerHTML += fila;
  }

  actualizarGrafica();
}


/* ===== TOGGLE ===== */
window.toggleAsistencia = async (id, fecha, val) => {
  await guardarAsistencia(id, fecha, val);
  actualizarGrafica();
};


/* ===== GRAFICA OPTIMIZADA ===== */
async function actualizarGrafica() {
  let asist = 0;
  let falt = 0;

  const alumnosSnap = await getDocs(alumnosRef);

  for (const docAl of alumnosSnap.docs) {
    const data = await cargarAlumno(docAl.id);

    sabadosGlobal.forEach(dia => {
      const key = fechaKey(dia);

      if (data[key] === true) {
        asist++;
      } else {
        falt++;
      }
    });
  }

  crearGrafica(asist, falt);
}


function crearGrafica(asist, falt) {
  const ctx = canvasGrafica.getContext("2d");

  // 🔥 destruir correctamente
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Asistencias", "Faltas"],
      datasets: [{
        data: [asist, falt],
        backgroundColor: ["#2ecc71", "#457b9d"],
        borderWidth: 2,
        borderColor: "#111"
      }]
    },
    options: {
      responsive: false, // 🔥 evita glitch
      animation: {
        duration: 300
      },
      plugins: {
        legend: {
          labels: {
            color: "#fff"
          }
        }
      }
    }
  });
}


/* ===== INIT ===== */
mostrarMesActual();
renderTabla();