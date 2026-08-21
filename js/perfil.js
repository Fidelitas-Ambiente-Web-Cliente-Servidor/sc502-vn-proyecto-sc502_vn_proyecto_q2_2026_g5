const API =
    "api/organizaciones.php";

const API_USUARIOS =
    "api/usuarios.php";


let organizaciones = [];
let usuarios = [];


const selectorOrganizacion =
    document.getElementById(
        "selectorOrganizacion"
    );

const btnNuevaOrganizacion =
    document.getElementById(
        "btnNuevaOrganizacion"
    );

const formulario =
    document.getElementById(
        "formPerfil"
    );

const tituloFormulario =
    document.getElementById(
        "tituloFormulario"
    );

const btnGuardar =
    document.getElementById(
        "btnGuardar"
    );


const idOrganizacion =
    document.getElementById(
        "idOrganizacion"
    );

const nombre =
    document.getElementById(
        "nombre"
    );

const tipo =
    document.getElementById(
        "tipo"
    );

const correo =
    document.getElementById(
        "correo"
    );

const telefono =
    document.getElementById(
        "telefono"
    );

const direccion =
    document.getElementById(
        "direccion"
    );

const canton =
    document.getElementById(
        "canton"
    );


const pNombre =
    document.getElementById(
        "pNombre"
    );

const pTipo =
    document.getElementById(
        "pTipo"
    );

const pCorreo =
    document.getElementById(
        "pCorreo"
    );

const pTelefono =
    document.getElementById(
        "pTelefono"
    );

const pDireccion =
    document.getElementById(
        "pDireccion"
    );

const pCanton =
    document.getElementById(
        "pCanton"
    );

const pVerificada =
    document.getElementById(
        "pVerificada"
    );

const pFecha =
    document.getElementById(
        "pFecha"
    );



const selectorUsuario =
    document.getElementById(
        "selectorUsuario"
    );

const btnAsignarUsuario =
    document.getElementById(
        "btnAsignarUsuario"
    );

const listaUsuariosOrganizacion =
    document.getElementById(
        "listaUsuariosOrganizacion"
    );


formulario.addEventListener(
    "submit",
    guardarPerfil
);


selectorOrganizacion.addEventListener(
    "change",
    async function () {

        const id =
            selectorOrganizacion.value;


        if (!id) {

            limpiarFormulario();

            listaUsuariosOrganizacion.innerHTML = `
                <p class="sin-usuarios">
                    Seleccione una organización.
                </p>
            `;

            return;
        }


        await cargarOrganizacion(id);

    }
);


btnNuevaOrganizacion.addEventListener(
    "click",
    nuevaOrganizacion
);


btnAsignarUsuario.addEventListener(
    "click",
    asignarUsuario
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




cargarOrganizaciones();




async function cargarOrganizaciones(
    seleccionarId = null
) {

    try {

        const respuesta =
            await fetch(API);


        const resultado =
            await respuesta.json();


        console.log(
            "Organizaciones:",
            resultado
        );


        if (!resultado.ok) {

            alert(
                resultado.mensaje ||
                "No se pudieron cargar las organizaciones."
            );

            return;
        }


        organizaciones =
            resultado.datos || [];


        llenarSelectorOrganizaciones();


        if (
            seleccionarId
        ) {

            selectorOrganizacion.value =
                seleccionarId;


            await cargarOrganizacion(
                seleccionarId
            );


            return;
        }


        if (
            organizaciones.length > 0
        ) {

            const primera =
                organizaciones[0];


            selectorOrganizacion.value =
                primera.id_organizacion;


            await cargarOrganizacion(
                primera.id_organizacion
            );


        } else {

            nuevaOrganizacion();

        }


    } catch (error) {

        console.error(
            "Error organizaciones:",
            error
        );


        alert(
            "No fue posible conectar con la API de organizaciones."
        );

    }

}



function llenarSelectorOrganizaciones() {

    selectorOrganizacion.innerHTML = `
        <option value="">
            Seleccione una organización
        </option>
    `;


    organizaciones.forEach(
        organizacion => {

            const opcion =
                document.createElement(
                    "option"
                );


            opcion.value =
                organizacion.id_organizacion;


            opcion.textContent =
                organizacion.nombre;


            selectorOrganizacion.appendChild(
                opcion
            );

        }
    );

}



async function cargarOrganizacion(id) {

    try {

        const respuesta =
            await fetch(
                `${API}?id=${id}`
            );


        const resultado =
            await respuesta.json();


        if (!resultado.ok) {

            alert(
                resultado.mensaje ||
                "No se pudo cargar la organización."
            );

            return;
        }


        const organizacion =
            resultado.datos;


        cargarFormulario(
            organizacion
        );


        mostrarOrganizacion(
            organizacion
        );


        tituloFormulario.innerHTML = `
            <i class="fa-solid fa-building"></i>
            Editar organización
        `;


        btnGuardar.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            Guardar cambios
        `;


        await cargarUsuarios();

        await cargarUsuariosOrganizacion(
            id
        );


    } catch (error) {

        console.error(
            "Error cargando organización:",
            error
        );

    }

}


function cargarFormulario(
    organizacion
) {

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

}


function nuevaOrganizacion() {

    formulario.reset();


    idOrganizacion.value =
        "";


    selectorOrganizacion.value =
        "";


    tituloFormulario.innerHTML = `
        <i class="fa-solid fa-plus"></i>
        Nueva organización
    `;


    btnGuardar.innerHTML = `
        <i class="fa-solid fa-plus"></i>
        Registrar organización
    `;


    limpiarPreview();


    listaUsuariosOrganizacion.innerHTML = `
        <p class="sin-usuarios">
            Primero registre la organización.
        </p>
    `;


    selectorUsuario.innerHTML = `
        <option value="">
            Primero registre la organización
        </option>
    `;


    nombre.focus();

}


async function guardarPerfil(e) {

    e.preventDefault();


    const datos = {

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


    const id =
        idOrganizacion.value;


    try {

        let respuesta;


        if (
            id === ""
        ) {

            respuesta =
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
                                datos
                            )

                    }
                );

        }




        else {

            datos.id =
                Number(id);


            respuesta =
                await fetch(
                    API,
                    {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                datos
                            )

                    }
                );

        }


        const resultado =
            await respuesta.json();


        console.log(
            "Respuesta guardar:",
            resultado
        );


        if (!resultado.ok) {

            alert(
                resultado.mensaje ||
                "No se pudo guardar la organización."
            );

            return;
        }


        alert(
            resultado.mensaje
        );


        if (
            id === "" &&
            resultado.id
        ) {

            await cargarOrganizaciones(
                resultado.id
            );

        } else {

            await cargarOrganizaciones(
                Number(id)
            );

        }


    } catch (error) {

        console.error(
            "Error guardando:",
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
                    .replace(
                        " ",
                        "T"
                    )
            );


        pFecha.textContent =
            "Registrada el " +
            fecha.toLocaleDateString(
                "es-CR"
            );

    } else {

        pFecha.textContent =
            "";

    }

}


async function cargarUsuarios() {

    try {

        const respuesta =
            await fetch(
                API_USUARIOS
            );


        const resultado =
            await respuesta.json();


        if (!resultado.ok) {

            return;
        }


        usuarios =
            resultado.datos || [];


        llenarSelectorUsuarios();


    } catch (error) {

        console.error(
            "Error cargando usuarios:",
            error
        );

    }

}



function llenarSelectorUsuarios() {

    selectorUsuario.innerHTML = `
        <option value="">
            Seleccione un usuario
        </option>
    `;


    usuarios.forEach(usuario => {

        const opcion =
            document.createElement(
                "option"
            );


        opcion.value =
            usuario.id_usuario;


        let texto =
            `${usuario.nombre} ${usuario.apellido} - ${usuario.correo}`;


        if (
            usuario.id_organizacion
        ) {

            texto +=
                ` (${usuario.organizacion_nombre || "Ya asociado"})`;

        }


        opcion.textContent =
            texto;


        selectorUsuario.appendChild(
            opcion
        );

    });

}



async function cargarUsuariosOrganizacion(
    idOrg
) {

    try {

        const respuesta =
            await fetch(
                `${API_USUARIOS}?id_organizacion=${idOrg}`
            );


        const resultado =
            await respuesta.json();


        if (!resultado.ok) {

            return;
        }


        mostrarUsuariosOrganizacion(
            resultado.datos || []
        );


    } catch (error) {

        console.error(
            "Error usuarios organización:",
            error
        );

    }

}


function mostrarUsuariosOrganizacion(
    lista
) {

    listaUsuariosOrganizacion.innerHTML =
        "";


    if (
        lista.length === 0
    ) {

        listaUsuariosOrganizacion.innerHTML = `
            <p class="sin-usuarios">
                Esta organización todavía no tiene usuarios asociados.
            </p>
        `;


        return;
    }


    lista.forEach(usuario => {

        listaUsuariosOrganizacion.innerHTML += `

            <div class="usuario-card">

                <div class="usuario-icono">

                    <i class="fa-solid fa-user"></i>

                </div>


                <div class="usuario-info">

                    <h3>
                        ${usuario.nombre}
                        ${usuario.apellido}
                    </h3>

                    <p>
                        ${usuario.correo}
                    </p>

                    <span class="usuario-rol">
                        ${usuario.rol}
                    </span>

                </div>


                <button
                    type="button"
                    class="btnQuitarUsuario"
                    onclick="quitarUsuario(
                        ${usuario.id_usuario}
                    )"
                >

                    <i class="fa-solid fa-user-minus"></i>

                    Quitar

                </button>

            </div>

        `;

    });

}


async function asignarUsuario() {

    const idUsuario =
        selectorUsuario.value;


    const idOrg =
        idOrganizacion.value;


    if (!idOrg) {

        alert(
            "Primero seleccione una organización."
        );

        return;
    }


    if (!idUsuario) {

        alert(
            "Seleccione un usuario."
        );

        return;
    }


    try {

        const respuesta =
            await fetch(
                API_USUARIOS,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            id_usuario:
                                Number(idUsuario),

                            id_organizacion:
                                Number(idOrg)

                        })

                }
            );


        const resultado =
            await respuesta.json();


        if (!resultado.ok) {

            alert(
                resultado.mensaje ||
                "No se pudo asociar el usuario."
            );

            return;
        }


        alert(
            resultado.mensaje
        );


        await cargarUsuarios();


        await cargarUsuariosOrganizacion(
            idOrg
        );


    } catch (error) {

        console.error(
            "Error asociando usuario:",
            error
        );


        alert(
            "Error al asociar el usuario."
        );

    }

}


async function quitarUsuario(
    idUsuario
) {

    if (
        !confirm(
            "¿Desea quitar este usuario de la organización?"
        )
    ) {

        return;
    }


    try {

        const respuesta =
            await fetch(
                API_USUARIOS,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            id_usuario:
                                Number(idUsuario),

                            id_organizacion:
                                null

                        })

                }
            );


        const resultado =
            await respuesta.json();


        if (!resultado.ok) {

            alert(
                resultado.mensaje ||
                "No se pudo quitar el usuario."
            );

            return;
        }


        alert(
            resultado.mensaje
        );


        await cargarUsuarios();


        await cargarUsuariosOrganizacion(
            idOrganizacion.value
        );


    } catch (error) {

        console.error(
            "Error quitando usuario:",
            error
        );


        alert(
            "Error al quitar el usuario."
        );

    }

}



function limpiarFormulario() {

    formulario.reset();

    idOrganizacion.value =
        "";

    limpiarPreview();

}


function limpiarPreview() {

    pNombre.textContent =
        "Nueva organización";


    pTipo.textContent =
        "Tipo";


    pCorreo.textContent =
        "No indicado";


    pTelefono.textContent =
        "No indicado";


    pDireccion.textContent =
        "No indicada";


    pCanton.textContent =
        "No indicado";


    pVerificada.innerHTML = `
        <i class="fa-solid fa-circle-xmark"></i>
        Organización no verificada
    `;


    pVerificada.className =
        "verificacion no-verificada";


    pFecha.textContent =
        "";

}