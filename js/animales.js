const API = "api/animales.php";

const DOG_API = "https://dog.ceo/api";

let animales = [];

const tabla = document.getElementById("tablaAnimales");
const formulario = document.getElementById("formAnimal");
const buscar = document.getElementById("buscar");

const btnFoto = document.getElementById("btnFoto");
const foto = document.getElementById("foto");
const vistaFoto = document.getElementById("vistaFoto");

const raza = document.getElementById("raza");


// =========================================
// INICIAR
// =========================================

cargarAnimales();

cargarRazas();


// =========================================
// EVENTOS
// =========================================

formulario.addEventListener(
    "submit",
    guardarAnimal
);

buscar.addEventListener(
    "keyup",
    filtrar
);

btnFoto.addEventListener(
    "click",
    obtenerFoto
);


// =========================================
// CARGAR ANIMALES
// =========================================

async function cargarAnimales() {

    try {

        const respuesta = await fetch(API);

        const resultado = await respuesta.json();

        console.log(
            "Respuesta API:",
            resultado
        );

        if (!resultado.ok) {

            alert(
                "No se pudieron cargar los animales."
            );

            return;
        }

        animales = resultado.datos;

        mostrarAnimales();

    } catch (error) {

        console.error(
            "Error:",
            error
        );

        alert(
            "No fue posible conectar con la API."
        );
    }
}


// =========================================
// CARGAR RAZAS DOG CEO
// =========================================

async function cargarRazas() {

    try {

        raza.innerHTML = `
            <option value="">
                Cargando razas...
            </option>
        `;


        const respuesta = await fetch(
            `${DOG_API}/breeds/list/all`
        );


        const resultado =
            await respuesta.json();


        if (
            resultado.status !== "success"
        ) {

            throw new Error(
                "No se pudieron cargar las razas."
            );
        }


        raza.innerHTML = `
            <option value="">
                Seleccione una raza
            </option>
        `;


        const razas =
            resultado.message;


        Object.keys(razas)
            .sort()
            .forEach(nombreRaza => {

                const subrazas =
                    razas[nombreRaza];


                if (
                    subrazas.length === 0
                ) {

                    const opcion =
                        document.createElement(
                            "option"
                        );


                    opcion.value =
                        nombreRaza;


                    opcion.textContent =
                        capitalizar(
                            nombreRaza
                        );


                    raza.appendChild(
                        opcion
                    );

                    return;
                }


                // =================================
                // RAZAS CON SUBRAZAS
                // =================================

                subrazas.forEach(
                    subraza => {

                        const opcion =
                            document.createElement(
                                "option"
                            );


                        opcion.value =
                            `${nombreRaza}/${subraza}`;


                        opcion.textContent =
                            `${capitalizar(
                                nombreRaza
                            )} - ${capitalizar(
                                subraza
                            )}`;


                        raza.appendChild(
                            opcion
                        );

                    }
                );

            });


    } catch (error) {

        console.error(
            "Error cargando razas:",
            error
        );


        raza.innerHTML = `
            <option value="">
                No se pudieron cargar las razas
            </option>
        `;

    }
}


// =========================================
// OBTENER FOTO SEGÚN RAZA
// =========================================

async function obtenerFoto() {

    const razaSeleccionada =
        raza.value;


    if (!razaSeleccionada) {

        alert(
            "Primero seleccione una raza."
        );

        return;
    }


    try {

        btnFoto.disabled = true;


        btnFoto.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Buscando...';


        let endpoint;



        if (
            razaSeleccionada.includes("/")
        ) {

            const partes =
                razaSeleccionada.split("/");


            const razaPrincipal =
                partes[0];


            const subraza =
                partes[1];


            endpoint =
                `${DOG_API}/breed/${razaPrincipal}/${subraza}/images/random`;

        }


        else {

            endpoint =
                `${DOG_API}/breed/${razaSeleccionada}/images/random`;

        }


        console.log(
            "Consultando:",
            endpoint
        );


        const respuesta =
            await fetch(endpoint);


        const resultado =
            await respuesta.json();


        if (
            resultado.status !== "success" ||
            !resultado.message
        ) {

            throw new Error(
                "No se encontró una imagen."
            );

        }


        // =================================
        // GUARDAR URL
        // =================================

        foto.value =
            resultado.message;


        // =================================
        // MOSTRAR FOTO
        // =================================

        vistaFoto.innerHTML = `

            <img
                src="${resultado.message}"
                class="foto-preview"
                alt="Foto de ${raza.options[raza.selectedIndex].text}"
            >

        `;


    } catch (error) {

        console.error(
            "Error Dog API:",
            error
        );


        alert(
            "No se pudo obtener una foto para esta raza."
        );


    } finally {

        btnFoto.disabled = false;


        btnFoto.innerHTML =
            '<i class="fa-solid fa-dog"></i> Obtener foto';

    }
}



function capitalizar(texto) {

    return texto
        .charAt(0)
        .toUpperCase() +
        texto.slice(1);

}


// =========================================
// GUARDAR ANIMAL
// =========================================

async function guardarAnimal(e) {

    e.preventDefault();


    const id =
        document.getElementById(
            "idAnimal"
        ).value.trim();


    const animal = {

        nombre:
            document.getElementById(
                "nombre"
            ).value.trim(),

        especie:
            document.getElementById(
                "especie"
            ).value.trim(),

        raza:
            document.getElementById(
                "raza"
            ).value,

        sexo:
            document.getElementById(
                "sexo"
            ).value,

        edad_aproximada:
            document.getElementById(
                "edad"
            ).value,

        tamano:
            document.getElementById(
                "tamano"
            ).value,

        estado_salud:
            document.getElementById(
                "estadoSalud"
            ).value.trim(),

        vacunas:
            document.getElementById(
                "vacunas"
            ).value.trim(),

        descripcion:
            document.getElementById(
                "descripcion"
            ).value.trim(),

        foto:
            foto.value,

        estado:
            document.getElementById(
                "estado"
            ).value
    };


    if (id !== "") {

        animal.id =
            Number(id);

    }


    console.log(
        "Datos enviados:",
        animal
    );


    try {

        const respuesta =
            await fetch(
                API,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            animal
                        )
                }
            );


        const resultado =
            await respuesta.json();


        console.log(
            "Respuesta guardar:",
            resultado
        );


        if (!resultado.ok) {

            alert(
                resultado.mensaje ||
                "No se pudo guardar el animal."
            );

            return;
        }


        alert(
            resultado.mensaje
        );


        formulario.reset();


        document.getElementById(
            "idAnimal"
        ).value = "";


        foto.value = "";


        vistaFoto.innerHTML = `
            <span>
                Seleccione una raza y obtenga una foto
            </span>
        `;


        const botonGuardar =
            formulario.querySelector(
                'button[type="submit"]'
            );


        if (botonGuardar) {

            botonGuardar.innerHTML =
                '<i class="fa-solid fa-floppy-disk"></i> Guardar';

        }


        await cargarAnimales();


    } catch (error) {

        console.error(
            "Error:",
            error
        );


        alert(
            "Error al comunicarse con la API."
        );

    }
}


// =========================================
// MOSTRAR ANIMALES
// =========================================

function mostrarAnimales(
    lista = animales
) {

    tabla.innerHTML = "";


    if (
        lista.length === 0
    ) {

        tabla.innerHTML = `

            <tr>

                <td colspan="14">
                    No hay animales registrados.
                </td>

            </tr>

        `;

        return;
    }


    lista.forEach(animal => {

        tabla.innerHTML += `

            <tr>

                <td>
                    ${animal.id_mascota}
                </td>

                <td>
                    ${animal.nombre || "No indicado"}
                </td>

                <td>
                    ${animal.especie || "No indicada"}
                </td>

                <td>
                    ${animal.raza || "No indicada"}
                </td>

                <td>
                    ${animal.sexo || "No indicado"}
                </td>

                <td>
                    ${
                        animal.edad_aproximada
                            ? animal.edad_aproximada + " años"
                            : "No indicada"
                    }
                </td>

                <td>
                    ${animal.tamano || "No indicado"}
                </td>

                <td>
                    ${animal.estado_salud || "No indicado"}
                </td>

                <td>
                    ${animal.vacunas || "No indicadas"}
                </td>

                <td>
                    ${animal.descripcion || "No indicada"}
                </td>

                <td>

                    ${
                        animal.foto

                        ? `

                            <img
                                src="${animal.foto}"
                                class="foto-animal"
                                alt="${animal.nombre}"
                            >

                          `

                        : "Sin foto"
                    }

                </td>

                <td>
                    ${animal.estado || "No indicado"}
                </td>

                <td>
                    ${animal.fecha_registro || "No indicada"}
                </td>

                <td>

                    <button
                        class="btnEditar"
                        onclick="editar(${animal.id_mascota})"
                    >

                        <i class="fa-solid fa-pen"></i>
                        Editar

                    </button>


                    <button
                        class="btnEliminar"
                        onclick="eliminarAnimal(${animal.id_mascota})"
                    >

                        <i class="fa-solid fa-trash"></i>
                        Eliminar

                    </button>

                </td>

            </tr>

        `;

    });
}


// =========================================
// EDITAR
// =========================================

function editar(id) {

    const animal =
        animales.find(
            a =>
                Number(a.id_mascota) ===
                Number(id)
        );


    if (!animal) {

        alert(
            "Animal no encontrado."
        );

        return;
    }


    document.getElementById(
        "idAnimal"
    ).value =
        animal.id_mascota;


    document.getElementById(
        "nombre"
    ).value =
        animal.nombre || "";


    document.getElementById(
        "especie"
    ).value =
        animal.especie || "";


    document.getElementById(
        "raza"
    ).value =
        animal.raza || "";


    document.getElementById(
        "sexo"
    ).value =
        animal.sexo || "";


    document.getElementById(
        "edad"
    ).value =
        animal.edad_aproximada || "";


    document.getElementById(
        "tamano"
    ).value =
        animal.tamano || "";


    document.getElementById(
        "estadoSalud"
    ).value =
        animal.estado_salud || "";


    document.getElementById(
        "vacunas"
    ).value =
        animal.vacunas || "";


    document.getElementById(
        "descripcion"
    ).value =
        animal.descripcion || "";


    document.getElementById(
        "estado"
    ).value =
        animal.estado ||
        "Disponible";


    // =================================
    // FOTO ACTUAL
    // =================================

    foto.value =
        animal.foto || "";


    if (animal.foto) {

        vistaFoto.innerHTML = `

            <img
                src="${animal.foto}"
                class="foto-preview"
                alt="${animal.nombre}"
            >

        `;

    } else {

        vistaFoto.innerHTML =
            "<span>No hay foto seleccionada</span>";

    }


    const botonGuardar =
        formulario.querySelector(
            'button[type="submit"]'
        );


    if (botonGuardar) {

        botonGuardar.innerHTML =
            '<i class="fa-solid fa-pen"></i> Actualizar';

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// =========================================
// ELIMINAR
// =========================================

async function eliminarAnimal(id) {

    if (
        !confirm(
            "¿Eliminar este animal?"
        )
    ) {

        return;
    }


    try {

        const respuesta =
            await fetch(
                API,
                {

                    method: "DELETE",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            id: id
                        })

                }
            );


        const resultado =
            await respuesta.json();


        if (!resultado.ok) {

            alert(
                resultado.mensaje ||
                "No se pudo eliminar el animal."
            );

            return;
        }


        alert(
            resultado.mensaje
        );


        await cargarAnimales();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "Error al eliminar el animal."
        );

    }
}


// =========================================
// BUSCAR
// =========================================

function filtrar() {

    const texto =
        buscar.value
            .toLowerCase()
            .trim();


    const resultado =
        animales.filter(
            animal =>

                (animal.nombre || "")
                    .toLowerCase()
                    .includes(texto)

                ||

                (animal.especie || "")
                    .toLowerCase()
                    .includes(texto)

                ||

                (animal.raza || "")
                    .toLowerCase()
                    .includes(texto)
        );


    mostrarAnimales(
        resultado
    );

}