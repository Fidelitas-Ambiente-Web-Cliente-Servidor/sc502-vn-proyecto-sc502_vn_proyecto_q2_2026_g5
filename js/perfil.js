const API = "api/organizaciones.php";

const ID_ORGANIZACION = 1;

const formulario =
    document.getElementById("formPerfil");

const idOrganizacion =
    document.getElementById("idOrganizacion");

const nombre =
    document.getElementById("nombre");

const tipo =
    document.getElementById("tipo");

const correo =
    document.getElementById("correo");

const telefono =
    document.getElementById("telefono");

const direccion =
    document.getElementById("direccion");

const canton =
    document.getElementById("canton");

const pNombre =
    document.getElementById("pNombre");

const pTipo =
    document.getElementById("pTipo");

const pCorreo =
    document.getElementById("pCorreo");

const pTelefono =
    document.getElementById("pTelefono");

const pDireccion =
    document.getElementById("pDireccion");

const pCanton =
    document.getElementById("pCanton");

const pVerificada =
    document.getElementById("pVerificada");

const pFecha =
    document.getElementById("pFecha");


formulario.addEventListener(
    "submit",
    guardarPerfil
);


nombre.addEventListener(
    "input",
    actualizarPreview
);

tipo.addEventListener(
    "change",
    actualizarPreview
);

correo.addEventListener(
    "input",
    actualizarPreview
);

telefono.addEventListener(
    "input",
    actualizarPreview
);

direccion.addEventListener(
    "input",
    actualizarPreview
);

canton.addEventListener(
    "input",
    actualizarPreview
);



cargarPerfil();


async function cargarPerfil() {

    try {

        const respuesta =
            await fetch(
                `${API}?id=${ID_ORGANIZACION}`
            );


        const resultado =
            await respuesta.json();


        console.log(
            "Organización:",
            resultado
        );


        if (!resultado.ok) {

            alert(
                resultado.mensaje ||
                "No se pudo cargar la organización."
            );

            return;
        }


        const organizacion =
            resultado.datos;




        idOrganizacion.value =
            organizacion.id_organizacion;


        nombre.value =
            organizacion.nombre || "";


        tipo.value =
            organizacion.tipo || "";


        correo.value =
            organizacion.correo || "";


        telefono.value =
            organizacion.telefono || "";


        direccion.value =
            organizacion.direccion || "";


        canton.value =
            organizacion.canton || "";




        mostrarOrganizacion(
            organizacion
        );


    } catch (error) {

        console.error(
            "Error cargando perfil:",
            error
        );


        alert(
            "No fue posible conectar con la API de organizaciones."
        );

    }

}




async function guardarPerfil(e) {

    e.preventDefault();


    const datos = {

        id:
            Number(
                idOrganizacion.value
            ),

        nombre:
            nombre.value.trim(),

        tipo:
            tipo.value,

        correo:
            correo.value.trim(),

        telefono:
            telefono.value.trim(),

        direccion:
            direccion.value.trim(),

        canton:
            canton.value.trim()

    };


    if (
        datos.nombre === "" ||
        datos.tipo === ""
    ) {

        alert(
            "El nombre y el tipo son obligatorios."
        );

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
                        JSON.stringify(datos)
                }
            );


        const resultado =
            await respuesta.json();


        console.log(
            "Respuesta actualizar:",
            resultado
        );


        if (!resultado.ok) {

            alert(
                resultado.mensaje ||
                "No se pudo actualizar la organización."
            );

            return;
        }


        alert(
            resultado.mensaje
        );


        await cargarPerfil();


    } catch (error) {

        console.error(
            "Error actualizando perfil:",
            error
        );


        alert(
            "Error al comunicarse con la API."
        );

    }

}



function actualizarPreview() {

    pNombre.textContent =
        nombre.value.trim() ||
        "Organización";


    pTipo.textContent =
        tipo.value ||
        "Tipo";


    pCorreo.textContent =
        correo.value.trim() ||
        "No indicado";


    pTelefono.textContent =
        telefono.value.trim() ||
        "No indicado";


    pDireccion.textContent =
        direccion.value.trim() ||
        "No indicada";


    pCanton.textContent =
        canton.value.trim() ||
        "No indicado";

}



function mostrarOrganizacion(
    organizacion
) {

    pNombre.textContent =
        organizacion.nombre ||
        "Organización";


    pTipo.textContent =
        organizacion.tipo ||
        "Tipo";


    pCorreo.textContent =
        organizacion.correo ||
        "No indicado";


    pTelefono.textContent =
        organizacion.telefono ||
        "No indicado";


    pDireccion.textContent =
        organizacion.direccion ||
        "No indicada";


    pCanton.textContent =
        organizacion.canton ||
        "No indicado";


    if (
        Number(
            organizacion.verificada
        ) === 1
    ) {

        pVerificada.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            Organización verificada
        `;

        pVerificada.className =
            "verificacion verificada";

    } else {

        pVerificada.innerHTML = `
            <i class="fa-solid fa-circle-xmark"></i>
            Organización no verificada
        `;

        pVerificada.className =
            "verificacion no-verificada";

    }


    if (
        organizacion.fecha_registro
    ) {

        const fecha =
            new Date(
                organizacion.fecha_registro
                    .replace(" ", "T")
            );


        pFecha.textContent =
            "Registrada el " +
            fecha.toLocaleDateString(
                "es-CR"
            );

    } else {

        pFecha.textContent = "";

    }

}