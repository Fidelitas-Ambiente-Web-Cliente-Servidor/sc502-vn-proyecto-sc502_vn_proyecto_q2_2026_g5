let solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];

let animales = JSON.parse(localStorage.getItem("animales")) || [];

const contenedor = document.getElementById("contenedorSolicitudes");

/* Datos de prueba */

if(solicitudes.length===0){

    solicitudes=[

        {
            id:1,
            persona:"María González",
            animal:"Max",
            telefono:"8888-1111",
            fecha:"10/07/2026",
            estado:"Pendiente"
        },

        {
            id:2,
            persona:"Carlos Mora",
            animal:"Luna",
            telefono:"8888-2222",
            fecha:"09/07/2026",
            estado:"Pendiente"
        }

    ];

    guardarSolicitudes();

}

mostrar();

function mostrar(){

    contenedor.innerHTML="";

    solicitudes.forEach(s=>{

        contenedor.innerHTML+=`

        <div class="solicitud">

            <h3>${s.persona}</h3>

            <p><strong>Animal:</strong> ${s.animal}</p>

            <p><strong>Teléfono:</strong> ${s.telefono}</p>

            <p><strong>Fecha:</strong> ${s.fecha}</p>

            <span class="estado ${s.estado.toLowerCase()}">

                ${s.estado}

            </span>

            <div class="botones">

                <button
                    class="btnAceptar"
                    onclick="aceptar(${s.id})">

                    Aceptar

                </button>

                <button
                    class="btnRechazar"
                    onclick="rechazar(${s.id})">

                    Rechazar

                </button>

            </div>

        </div>

        `;

    });

}

function aceptar(id){

    const solicitud=solicitudes.find(s=>s.id===id);

    solicitud.estado="Aceptada";

    const animal=animales.find(a=>a.nombre===solicitud.animal);

    if(animal){

        animal.estado="Adoptado";

        localStorage.setItem("animales",JSON.stringify(animales));

    }

    guardarSolicitudes();

    mostrar();

}

function rechazar(id){

    const solicitud=solicitudes.find(s=>s.id===id);

    solicitud.estado="Rechazada";

    guardarSolicitudes();

    mostrar();

}

function guardarSolicitudes(){

    localStorage.setItem("solicitudes",JSON.stringify(solicitudes));

}