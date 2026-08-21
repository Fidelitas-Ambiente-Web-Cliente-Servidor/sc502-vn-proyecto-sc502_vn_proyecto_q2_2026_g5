const API = "api/solicitudes.php";

const contenedor = document.getElementById("contenedorSolicitudes");

let solicitudes = [];


// =========================================
// CLASE CSS SEGÚN ESTADO
// =========================================

const CLASE_ESTADO = {
    "Pendiente": "pendiente",
    "En revisión": "en-revision",
    "Aprobada": "aprobada",
    "Rechazada": "rechazada",
    "Completada": "completada",
    "Cancelada": "cancelada"
};


// =========================================
// INICIAR
// =========================================

cargarSolicitudes();


// =========================================
// CARGAR SOLICITUDES RECIBIDAS
// (las que otros usuarios enviaron por
// animales que YO registré)
// =========================================

async function cargarSolicitudes() {

    contenedor.innerHTML = "<p>Cargando solicitudes...</p>";

    try {

        const respuesta = await fetch(`${API}?tipo=recibidas`);

        const resultado = await respuesta.json();

        if (!resultado.ok) {

            contenedor.innerHTML = "<p>No se pudieron cargar las solicitudes.</p>";
            return;

        }

        solicitudes = resultado.datos;

        mostrar();

    } catch (error) {

        contenedor.innerHTML = "<p>No se pudo conectar con el servidor.</p>";

    }

}


// =========================================
// PINTAR TARJETAS
// =========================================

function mostrar() {

    contenedor.innerHTML = "";

    if (solicitudes.length === 0) {

        contenedor.innerHTML = "<p>Todavía no te han enviado solicitudes de adopción.</p>";
        return;

    }

    solicitudes.forEach(s => {

        const claseEstado = CLASE_ESTADO[s.estado] || "pendiente";

        const puedeGestionar = s.estado === "Pendiente" || s.estado === "En revisión";

        contenedor.innerHTML += `

        <div class="solicitud">

            <h3>${s.solicitante_nombre} ${s.solicitante_apellido}</h3>

            <p><strong>Animal:</strong> ${s.nombre_mascota}</p>

            <p><strong>Correo:</strong> ${s.solicitante_correo}</p>

            <p><strong>Teléfono:</strong> ${s.solicitante_telefono ?? "No indicado"}</p>

            <p><strong>Fecha:</strong> ${formatearFecha(s.fecha_solicitud)}</p>

            ${s.observaciones ? `<p><strong>Mensaje:</strong> ${s.observaciones}</p>` : ""}

            <span class="estado ${claseEstado}">
                ${s.estado}
            </span>

            ${puedeGestionar ? `
            <div class="botones">

                <button
                    class="btnAceptar"
                    onclick="aceptar(${s.id_solicitud})">

                    Aceptar

                </button>

                <button
                    class="btnRechazar"
                    onclick="rechazar(${s.id_solicitud})">

                    Rechazar

                </button>

            </div>
            ` : ""}

        </div>

        `;

    });

}


// =========================================
// ACEPTAR / RECHAZAR (PUT real)
// =========================================

async function aceptar(id) {
    await actualizarEstado(id, "Aprobada");
}

async function rechazar(id) {
    await actualizarEstado(id, "Rechazada");
}

async function actualizarEstado(id, estado) {

    try {

        const respuesta = await fetch(API, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, estado })
        });

        const resultado = await respuesta.json();

        if (!resultado.ok) {
            alert(resultado.mensaje);
            return;
        }

        cargarSolicitudes();

    } catch (error) {

        alert("No se pudo conectar con el servidor");

    }

}


// =========================================
// FORMATEAR FECHA (YYYY-MM-DD HH:MM:SS -> DD/MM/YYYY)
// =========================================

function formatearFecha(fechaSql) {

    const fecha = new Date(fechaSql.replace(" ", "T"));

    if (isNaN(fecha)) return fechaSql;

    return fecha.toLocaleDateString("es-CR");

}
