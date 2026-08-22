const API = "api/solicitudes.php";

let solicitudes = [];

const contenedor =
    document.getElementById("contenedorSolicitudes");



cargarSolicitudes();


async function cargarSolicitudes() {

    try {

        const respuesta =
            await fetch(API);


        const resultado =
            await respuesta.json();


        console.log(
            "Respuesta solicitudes:",
            resultado
        );


        if (!resultado.ok) {

            alert(
                resultado.mensaje ||
                "No se pudieron cargar las solicitudes."
            );

            return;
        }


        solicitudes =
            resultado.datos || [];


        mostrarSolicitudes();


    } catch (error) {

        console.error(
            "Error:",
            error
        );


        alert(
            "No fue posible conectar con la API de solicitudes."
        );

    }
}



function mostrarSolicitudes() {

    contenedor.innerHTML = "";


    if (solicitudes.length === 0) {

        contenedor.innerHTML = `
            <div class="sin-solicitudes">

                <i class="fa-solid fa-inbox"></i>

                <h3>
                    No hay solicitudes
                </h3>

                <p>
                    Todavía no se han recibido
                    solicitudes de adopción.
                </p>

            </div>
        `;

        return;
    }


    solicitudes.forEach(solicitud => {

        const nombreUsuario =
            `${solicitud.usuario_nombre || ""}
             ${solicitud.usuario_apellido || ""}`
                .trim();



        const fotoMascota =
            solicitud.foto
                ? `
                    <img
                        src="${solicitud.foto}"
                        class="solicitud-foto"
                        alt="${solicitud.mascota}"
                    >
                  `
                : `
                    <div class="solicitud-sin-foto">

                        <i class="fa-solid fa-paw"></i>

                    </div>
                  `;



        const botones =
            obtenerBotones(solicitud);



        contenedor.innerHTML += `

            <div class="solicitud-card">


                <div class="solicitud-imagen">

                    ${fotoMascota}

                </div>


                <div class="solicitud-info">


                    <div class="solicitud-encabezado">


                        <div>

                            <span class="solicitud-id">

                                Solicitud #${solicitud.id_solicitud}

                            </span>


                            <h2>

                                ${solicitud.mascota}

                            </h2>

                        </div>


                        <span
                            class="estado estado-${claseEstado(
                                solicitud.estado
                            )}"
                        >

                            ${solicitud.estado}

                        </span>


                    </div>


                    <!-- DATOS -->

                    <div class="datos-grid">


                        <div>

                            <span class="dato-titulo">

                                <i class="fa-solid fa-paw"></i>

                                Mascota

                            </span>


                            <p>

                                ${solicitud.especie || "No indicada"}

                                ${
                                    solicitud.raza
                                        ? " - " + solicitud.raza
                                        : ""
                                }

                            </p>

                        </div>


                        <div>

                            <span class="dato-titulo">

                                <i class="fa-solid fa-user"></i>

                                Solicitante

                            </span>


                            <p>

                                ${nombreUsuario || "No indicado"}

                            </p>

                        </div>


                        <div>

                            <span class="dato-titulo">

                                <i class="fa-solid fa-envelope"></i>

                                Correo

                            </span>


                            <p>

                                ${solicitud.usuario_correo || "No indicado"}

                            </p>

                        </div>


                        <div>

                            <span class="dato-titulo">

                                <i class="fa-solid fa-phone"></i>

                                Teléfono

                            </span>


                            <p>

                                ${solicitud.usuario_telefono || "No indicado"}

                            </p>

                        </div>


                        <div>

                            <span class="dato-titulo">

                                <i class="fa-solid fa-calendar"></i>

                                Fecha

                            </span>


                            <p>

                                ${formatearFecha(
                                    solicitud.fecha_solicitud
                                )}

                            </p>

                        </div>


                        <div>

                            <span class="dato-titulo">

                                <i class="fa-solid fa-dog"></i>

                                Estado mascota

                            </span>


                            <p>

                                ${
                                    solicitud.estado_mascota ||
                                    "No indicado"
                                }

                            </p>

                        </div>


                    </div>


                    <!-- OBSERVACIONES -->

                    <div class="observaciones">

                        <strong>
                            Observaciones:
                        </strong>

                        <p>

                            ${
                                solicitud.observaciones
                                    ? formatearObservaciones(
                                        solicitud.observaciones
                                      )
                                    : "Sin observaciones."
                            }

                        </p>

                    </div>


                    ${botones}


                </div>

            </div>

        `;

    });
}




function obtenerBotones(solicitud) {


    if (
        solicitud.estado === "Pendiente"
    ) {

        return `

            <div class="acciones-solicitud">


                <button
                    class="btnRevision"
                    onclick="cambiarEstado(
                        ${solicitud.id_solicitud},
                        'En revisión'
                    )"
                >

                    <i class="fa-solid fa-eye"></i>

                    Revisar

                </button>


                <button
                    class="btnRechazar"
                    onclick="cambiarEstado(
                        ${solicitud.id_solicitud},
                        'Rechazada'
                    )"
                >

                    <i class="fa-solid fa-xmark"></i>

                    Rechazar

                </button>


            </div>

        `;
    }


    if (
        solicitud.estado === "En revisión"
    ) {

        return `

            <div class="acciones-solicitud">


                <button
                    class="btnAprobar"
                    onclick="cambiarEstado(
                        ${solicitud.id_solicitud},
                        'Aprobada'
                    )"
                >

                    <i class="fa-solid fa-check"></i>

                    Aprobar

                </button>


                <button
                    class="btnRechazar"
                    onclick="cambiarEstado(
                        ${solicitud.id_solicitud},
                        'Rechazada'
                    )"
                >

                    <i class="fa-solid fa-xmark"></i>

                    Rechazar

                </button>


            </div>

        `;
    }



    if (
        solicitud.estado === "Aprobada"
    ) {

        return `

            <div class="acciones-solicitud">


                <button
                    class="btnCompletar"
                    onclick="cambiarEstado(
                        ${solicitud.id_solicitud},
                        'Completada'
                    )"
                >

                    <i class="fa-solid fa-heart-circle-check"></i>

                    Completar adopción

                </button>


            </div>

        `;
    }



    if (
        solicitud.estado === "Completada"
    ) {

        return `

            <div class="resultado-solicitud completada">

                <i class="fa-solid fa-circle-check"></i>

                Adopción completada

            </div>

        `;
    }



    if (
        solicitud.estado === "Rechazada"
    ) {

        return `

            <div class="resultado-solicitud rechazada">

                <i class="fa-solid fa-circle-xmark"></i>

                Solicitud rechazada

            </div>

        `;
    }


    if (
        solicitud.estado === "Cancelada"
    ) {

        return `

            <div class="resultado-solicitud cancelada">

                <i class="fa-solid fa-ban"></i>

                Solicitud cancelada

            </div>

        `;
    }


    return "";
}



async function cambiarEstado(
    id,
    nuevoEstado
) {

    let mensaje = "";


  

    if (
        nuevoEstado === "En revisión"
    ) {

        mensaje =
            "¿Desea comenzar la revisión de esta solicitud?";

    }


    else if (
        nuevoEstado === "Aprobada"
    ) {

        mensaje =
            "¿Desea aprobar esta solicitud? " +
            "La mascota seguirá disponible hasta completar la adopción.";

    }


    else if (
        nuevoEstado === "Rechazada"
    ) {

        mensaje =
            "¿Desea rechazar esta solicitud?";

    }


    else if (
        nuevoEstado === "Completada"
    ) {

        mensaje =
            "¿Desea completar esta adopción? " +
            "La mascota será marcada como Adoptado " +
            "y las demás solicitudes activas serán canceladas.";

    }


    if (
        !confirm(mensaje)
    ) {

        return;
    }


    try {

        const respuesta =
            await fetch(
                API,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            id: id,

                            estado:
                                nuevoEstado

                        })

                }
            );


        const resultado =
            await respuesta.json();


        console.log(
            "Respuesta actualizar:",
            resultado
        );


        if (
            !resultado.ok
        ) {

            alert(
                resultado.mensaje ||
                "No se pudo actualizar la solicitud."
            );

            return;
        }


        alert(
            resultado.mensaje
        );


        await cargarSolicitudes();


    } catch (error) {

        console.error(
            "Error:",
            error
        );


        alert(
            "Error al actualizar la solicitud."
        );

    }
}




function claseEstado(estado) {

    switch (estado) {

        case "Pendiente":
            return "pendiente";


        case "En revisión":
            return "revision";


        case "Aprobada":
            return "aprobada";


        case "Rechazada":
            return "rechazada";


        case "Completada":
            return "completada";


        case "Cancelada":
            return "cancelada";


        default:
            return "pendiente";
    }
}



function formatearObservaciones(
    observaciones
) {

    return observaciones
        .replace(/\n/g, "<br>");
}



function formatearFecha(fecha) {

    if (!fecha) {

        return "No indicada";
    }


    const fechaJS =
        new Date(
            fecha.replace(
                " ",
                "T"
            )
        );


    if (
        isNaN(
            fechaJS.getTime()
        )
    ) {

        return fecha;
    }


    return fechaJS.toLocaleString(
        "es-CR",
        {

            dateStyle:
                "medium",

            timeStyle:
                "short"

        }
    );
}