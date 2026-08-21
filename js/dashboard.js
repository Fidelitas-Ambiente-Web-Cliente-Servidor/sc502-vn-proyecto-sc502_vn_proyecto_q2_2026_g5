const API_ANIMALES = "api/animales.php";
const API_SOLICITUDES = "api/solicitudes.php";

const totalAnimales = document.getElementById("totalAnimales");
const totalSolicitudes = document.getElementById("totalSolicitudes");
const totalAdoptados = document.getElementById("totalAdoptados");
const totalPendientes = document.getElementById("totalPendientes");

const actividadLista = document.getElementById("actividadLista");


cargarDashboard();


async function cargarDashboard() {

    try {

        const [
            respuestaAnimales,
            respuestaSolicitudes
        ] = await Promise.all([

            fetch(API_ANIMALES),

            fetch(API_SOLICITUDES)

        ]);


        const resultadoAnimales =
            await respuestaAnimales.json();


        const resultadoSolicitudes =
            await respuestaSolicitudes.json();


        console.log(
            "Animales:",
            resultadoAnimales
        );


        console.log(
            "Solicitudes:",
            resultadoSolicitudes
        );


        if (
            !resultadoAnimales.ok ||
            !resultadoSolicitudes.ok
        ) {

            throw new Error(
                "No se pudieron cargar los datos del dashboard."
            );

        }


        const animales =
            resultadoAnimales.datos || [];


        const solicitudes =
            resultadoSolicitudes.datos || [];


        totalAnimales.textContent =
            animales.length;


        totalSolicitudes.textContent =
            solicitudes.length;


        const adoptados =
            animales.filter(

                animal =>
                    animal.estado === "Adoptado"

            ).length;


        totalAdoptados.textContent =
            adoptados;


        const pendientes =
            solicitudes.filter(

                solicitud =>
                    solicitud.estado === "Pendiente"

            ).length;


        totalPendientes.textContent =
            pendientes;


        mostrarActividad(
            animales,
            solicitudes
        );


    } catch (error) {

        console.error(
            "Error Dashboard:",
            error
        );


        alert(
            "No fue posible cargar la información del dashboard."
        );

    }

}


function mostrarActividad(
    animales,
    solicitudes
) {

    actividadLista.innerHTML = "";


    let actividad = [];


    animales.forEach(animal => {

        actividad.push({

            tipo: "animal",

            fecha:
                animal.fecha_registro,

            texto:
                `Se registró la mascota ${animal.nombre}.`,

            icono:
                "fa-paw"

        });


        if (
            animal.estado === "Adoptado"
        ) {

            actividad.push({

                tipo: "adopcion",

                fecha:
                    animal.fecha_registro,

                texto:
                    `${animal.nombre} aparece como adoptado.`,

                icono:
                    "fa-heart"

            });

        }

    });


    solicitudes.forEach(solicitud => {

        actividad.push({

            tipo: "solicitud",

            fecha:
                solicitud.fecha_solicitud,

            texto:
                `Nueva solicitud para ${solicitud.mascota}.`,

            icono:
                "fa-file-circle-check"

        });


        if (
            solicitud.estado === "Aprobada"
        ) {

            actividad.push({

                tipo: "aprobada",

                fecha:
                    solicitud.fecha_solicitud,

                texto:
                    `La solicitud para ${solicitud.mascota} fue aprobada.`,

                icono:
                    "fa-circle-check"

            });

        }


        if (
            solicitud.estado === "Rechazada"
        ) {

            actividad.push({

                tipo: "rechazada",

                fecha:
                    solicitud.fecha_solicitud,

                texto:
                    `La solicitud para ${solicitud.mascota} fue rechazada.`,

                icono:
                    "fa-circle-xmark"

            });

        }

    });


    actividad.sort(
        (a, b) =>
            convertirFecha(b.fecha) -
            convertirFecha(a.fecha)
    );


    // Mostrar solo las últimas 5
    actividad =
        actividad.slice(0, 5);


    if (
        actividad.length === 0
    ) {

        actividadLista.innerHTML = `
            <li>
                No hay actividad registrada.
            </li>
        `;

        return;
    }


    actividad.forEach(item => {

        actividadLista.innerHTML += `

            <li>

                <i class="fa-solid ${item.icono}"></i>

                <div>

                    <span>
                        ${item.texto}
                    </span>

                    <small>
                        ${formatearFecha(item.fecha)}
                    </small>

                </div>

            </li>

        `;

    });

}



function convertirFecha(fecha) {

    if (!fecha) {

        return new Date(0);

    }


    return new Date(
        fecha.replace(" ", "T")
    );

}


function formatearFecha(fecha) {

    if (!fecha) {

        return "";

    }


    const fechaJS =
        convertirFecha(fecha);


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
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}