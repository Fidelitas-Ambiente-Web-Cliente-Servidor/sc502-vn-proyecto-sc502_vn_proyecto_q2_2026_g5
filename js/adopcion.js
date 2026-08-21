document.addEventListener("DOMContentLoaded", function () {

    const API = "api/adopcion.php";

    let animales = [];
    let animalSeleccionadoId = null;


    // =========================================
    // ELEMENTOS
    // =========================================

    const filtroNombre =
        document.getElementById("filtroNombre");

    const filtroEspecie =
        document.getElementById("filtroEspecie");

    const filtroRaza =
        document.getElementById("filtroRaza");

    const filtroTamano =
        document.getElementById("filtroTamano");

    const btnLimpiar =
        document.getElementById("btnLimpiar");

    const contenedorAnimales =
        document.getElementById("contenedorAnimales");

    const resultadoConteo =
        document.getElementById("resultadoConteo");

    const sinResultados =
        document.getElementById("sinResultados");



    cargarAnimales();


    async function cargarAnimales() {

        try {

            const respuesta =
                await fetch(API);

            const resultado =
                await respuesta.json();


            console.log(
                "Respuesta adopción:",
                resultado
            );


            if (!resultado.ok) {

                alert(
                    resultado.mensaje ||
                    "No se pudieron cargar los animales."
                );

                return;
            }


            animales =
                resultado.datos || [];


            function poblarSelectRazas() {

                if (!filtroRaza) {

                    console.error(
                        "No se encontró el elemento #filtroRaza"
                    );

                    return;
                }


                filtroRaza.innerHTML = `
        <option value="Todas">
            Todas
        </option>
    `;


                const razas = [];


                animales.forEach(animal => {

                    if (
                        animal.raza &&
                        !razas.includes(animal.raza)
                    ) {

                        razas.push(
                            animal.raza
                        );
                    }

                });


                razas
                    .sort()
                    .forEach(nombreRaza => {

                        const opcion =
                            document.createElement(
                                "option"
                            );


                        opcion.value =
                            nombreRaza;


                        opcion.textContent =
                            nombreRaza;


                        filtroRaza.appendChild(
                            opcion
                        );

                    });
            }

            poblarEstadisticas();

            renderizarAnimales(animales);


        } catch (error) {

            console.error(
                "Error completo adopción:",
                error
            );

            alert(
                "Error al cargar adopción:\n" +
                error.message
            );
        }
    }



    function poblarSelectRazas() {

        filtroRaza.innerHTML = `
            <option value="Todas">
                Todas
            </option>
        `;


        const razas = [];


        animales.forEach(animal => {

            if (
                animal.raza &&
                !razas.includes(animal.raza)
            ) {

                razas.push(
                    animal.raza
                );
            }

        });


        razas
            .sort()
            .forEach(raza => {

                const opcion =
                    document.createElement(
                        "option"
                    );


                opcion.value =
                    raza;


                opcion.textContent =
                    raza;


                filtroRaza.appendChild(
                    opcion
                );

            });
    }


    function crearTarjetaAnimal(animal) {

        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "card cardAnimal";


        const foto =
            document.createElement("img");

        foto.className =
            "foto";


        foto.src =
            animal.foto ||
            "https://placehold.co/500x350?text=Sin+foto";


        foto.alt =
            animal.nombre;


        const nombre =
            document.createElement("h3");

        nombre.textContent =
            animal.nombre;


        const razaEdad =
            document.createElement("p");

        razaEdad.className =
            "datosAnimal";


        razaEdad.textContent =
            [
                animal.raza || "Sin raza",
                animal.edad_aproximada
                    ? animal.edad_aproximada + " años"
                    : "Edad no indicada",
                animal.tamano || "Tamaño no indicado"
            ].join(" • ");


        const ubicacion =
            document.createElement("p");

        ubicacion.className =
            "datosAnimal";


        ubicacion.textContent =
            animal.organizacion_canton ||
            animal.responsable_canton ||
            "Ubicación no indicada";


        const estado =
            document.createElement("span");

        estado.className =
            "estadoBadge estadoDisponible";

        estado.textContent =
            animal.estado;


        const boton =
            document.createElement("button");

        boton.type =
            "button";

        boton.textContent =
            "Ver perfil";

        boton.dataset.id =
            animal.id_mascota;


        tarjeta.appendChild(foto);

        tarjeta.appendChild(nombre);

        tarjeta.appendChild(razaEdad);

        tarjeta.appendChild(ubicacion);

        tarjeta.appendChild(estado);

        tarjeta.appendChild(boton);


        return tarjeta;
    }



    function renderizarAnimales(lista) {

        contenedorAnimales.innerHTML =
            "";


        document.getElementById(
            "statResultados"
        ).textContent =
            lista.length;


        if (
            lista.length === 0
        ) {

            sinResultados.textContent =
                "No se encontraron animales con los filtros seleccionados.";


            resultadoConteo.textContent =
                "";


            return;
        }


        sinResultados.textContent =
            "";


        resultadoConteo.textContent =
            "Se encontraron " +
            lista.length +
            " animales.";


        lista.forEach(animal => {

            contenedorAnimales.appendChild(
                crearTarjetaAnimal(animal)
            );

        });
    }

    function aplicarFiltros() {

        const nombre =
            filtroNombre.value
                .toLowerCase()
                .trim();


        const especie =
            filtroEspecie.value;


        const raza =
            filtroRaza.value;


        const tamano =
            filtroTamano.value;


        const resultado =
            animales.filter(
                animal => {

                    if (
                        nombre !== "" &&
                        !(animal.nombre || "")
                            .toLowerCase()
                            .includes(nombre)
                    ) {

                        return false;
                    }


                    if (
                        especie !== "Todas" &&
                        animal.especie !== especie
                    ) {

                        return false;
                    }


                    if (
                        raza !== "Todas" &&
                        animal.raza !== raza
                    ) {

                        return false;
                    }


                    if (
                        tamano !== "Todos" &&
                        animal.tamano !== tamano
                    ) {

                        return false;
                    }


                    return true;
                }
            );


        renderizarAnimales(
            resultado
        );
    }


    function limpiarFiltros() {

        filtroNombre.value =
            "";

        filtroEspecie.value =
            "Todas";

        filtroRaza.value =
            "Todas";

        filtroTamano.value =
            "Todos";


        renderizarAnimales(
            animales
        );
    }


    function mostrarVista(idVista) {

        const vistas =
            document.querySelectorAll(
                ".vista"
            );


        vistas.forEach(vista => {

            vista.classList.add(
                "oculto"
            );

        });


        document
            .getElementById(idVista)
            .classList
            .remove("oculto");


        window.scrollTo(
            0,
            0
        );
    }


    function mostrarPerfil(idAnimal) {

        const animal =
            animales.find(
                animal =>
                    Number(
                        animal.id_mascota
                    ) ===
                    Number(idAnimal)
            );


        if (!animal) {

            return;
        }


        animalSeleccionadoId =
            animal.id_mascota;


        const perfilFoto =
            document.getElementById(
                "perfilFoto"
            );


        perfilFoto.src =
            animal.foto ||
            "https://placehold.co/500x350?text=Sin+foto";


        perfilFoto.alt =
            animal.nombre;


        document.getElementById(
            "perfilNombre"
        ).textContent =
            animal.nombre;


        const estadoSpan =
            document.getElementById(
                "perfilEstado"
            );


        estadoSpan.textContent =
            animal.estado;


        estadoSpan.className =
            "estadoBadge estadoDisponible";


        document.getElementById(
            "perfilEspecieRaza"
        ).textContent =
            `${animal.especie} • ${animal.raza || "Sin raza"}`;


        document.getElementById(
            "perfilEdad"
        ).textContent =
            animal.edad_aproximada
                ? animal.edad_aproximada + " años"
                : "No indicada";


        document.getElementById(
            "perfilSexo"
        ).textContent =
            animal.sexo ||
            "No indicado";


        document.getElementById(
            "perfilTamano"
        ).textContent =
            animal.tamano ||
            "No indicado";


        document.getElementById(
            "perfilUbicacion"
        ).textContent =
            animal.organizacion_canton ||
            animal.responsable_canton ||
            "No indicada";


        document.getElementById(
            "perfilVacunado"
        ).textContent =
            animal.vacunas ||
            "No indicado";

        document.getElementById(
            "perfilEstadoSalud"
        ).textContent =
            animal.estado_salud ||
            "No indicado";


        document.getElementById(
            "perfilDescripcion"
        ).textContent =
            animal.descripcion ||
            "Sin descripción";




        const nombreResponsable =
            `${animal.responsable_nombre || ""} ${animal.responsable_apellido || ""}`
                .trim();


        document.getElementById(
            "rescatistaNombre"
        ).textContent =
            nombreResponsable ||
            "Responsable";


        document.getElementById(
            "rescatistaOrg"
        ).textContent =
            animal.organizacion_nombre ||
            animal.responsable_rol ||
            "Particular";


        document.getElementById(
            "rescatistaUbicacion"
        ).textContent =
            animal.organizacion_canton ||
            animal.responsable_canton ||
            "No indicada";


        document.getElementById(
            "rescatistaTelefono"
        ).textContent =
            animal.organizacion_telefono ||
            animal.responsable_telefono ||
            "No indicado";


        document.getElementById(
            "rescatistaCorreo"
        ).textContent =
            animal.organizacion_correo ||
            animal.responsable_correo ||
            "No indicado";


        document.getElementById(
            "rescatistaDescripcion"
        ).textContent =
            animal.organizacion_nombre
                ? `${animal.organizacion_tipo || "Organización"} responsable de la publicación.`
                : "Usuario responsable de la publicación de esta mascota.";


        const otrosAnimales =
            animales.filter(
                otro =>
                    otro.id_usuario ===
                    animal.id_usuario &&
                    otro.id_mascota !==
                    animal.id_mascota
            );


        document.getElementById(
            "rescatistaOtrosAnimales"
        ).textContent =
            "Este responsable tiene " +
            otrosAnimales.length +
            " animal(es) más publicados para adopción.";


        mostrarVista(
            "vistaPerfil"
        );
    }



    filtroNombre.addEventListener(
        "input",
        aplicarFiltros
    );


    filtroEspecie.addEventListener(
        "change",
        aplicarFiltros
    );


    filtroRaza.addEventListener(
        "change",
        aplicarFiltros
    );


    filtroTamano.addEventListener(
        "change",
        aplicarFiltros
    );


    btnLimpiar.addEventListener(
        "click",
        limpiarFiltros
    );


    contenedorAnimales.addEventListener(
        "click",
        function (evento) {

            const boton =
                evento.target.closest(
                    "button[data-id]"
                );


            if (!boton) {

                return;
            }


            mostrarPerfil(
                Number(
                    boton.dataset.id
                )
            );
        }
    );



    document.getElementById(
        "btnVolverBusqueda"
    ).addEventListener(
        "click",
        function () {

            mostrarVista(
                "vistaBusqueda"
            );
        }
    );


    document.getElementById(
        "btnVolverPerfil"
    ).addEventListener(
        "click",
        function () {

            mostrarVista(
                "vistaPerfil"
            );
        }
    );



    document.getElementById(
        "btnSolicitarAdopcion"
    ).addEventListener(
        "click",
        function () {

            const animal =
                animales.find(
                    animal =>
                        Number(
                            animal.id_mascota
                        ) ===
                        Number(
                            animalSeleccionadoId
                        )
                );


            if (animal) {

                document.getElementById(
                    "solicitudAnimalNombre"
                ).textContent =
                    animal.nombre;
            }


            mostrarVista(
                "vistaSolicitud"
            );


            cargarMisSolicitudes();
        }
    );



    const solNombre =
        document.getElementById(
            "solNombre"
        );

    const solCedula =
        document.getElementById(
            "solCedula"
        );

    const solTelefono =
        document.getElementById(
            "solTelefono"
        );

    const solCorreo =
        document.getElementById(
            "solCorreo"
        );

    const solDireccion =
        document.getElementById(
            "solDireccion"
        );

    const solVivienda =
        document.getElementById(
            "solVivienda"
        );

    const solMotivo =
        document.getElementById(
            "solMotivo"
        );

    const solOtrasMascotas =
        document.getElementById(
            "solOtrasMascotas"
        );

    const solVisita =
        document.getElementById(
            "solVisita"
        );

    const btnEnviarSolicitud =
        document.getElementById(
            "btnEnviarSolicitud"
        );

    const mensajeSolicitud =
        document.getElementById(
            "mensajeSolicitud"
        );


    function validarSolicitud() {

        let valido = true;


        if (
            solNombre.value
                .trim()
                .length < 3
        ) {

            valido = false;
        }


        if (
            !/^[0-9]{9}$/.test(
                solCedula.value.trim()
            )
        ) {

            valido = false;
        }


        if (
            !/^[0-9]{8}$/.test(
                solTelefono.value.trim()
            )
        ) {

            valido = false;
        }


        if (
            !solCorreo.value.includes("@")
        ) {

            valido = false;
        }


        if (
            solDireccion.value
                .trim()
                .length < 10
        ) {

            valido = false;
        }


        if (
            solVivienda.value === ""
        ) {

            valido = false;
        }


        if (
            solMotivo.value
                .trim()
                .length < 20
        ) {

            valido = false;
        }


        if (
            !solVisita.checked
        ) {

            valido = false;
        }


        btnEnviarSolicitud.disabled =
            !valido;
    }


    [
        solNombre,
        solCedula,
        solTelefono,
        solCorreo,
        solDireccion,
        solVivienda,
        solMotivo,
        solVisita

    ].forEach(elemento => {

        elemento.addEventListener(
            "input",
            validarSolicitud
        );

        elemento.addEventListener(
            "change",
            validarSolicitud
        );

    });


    btnEnviarSolicitud.addEventListener(
        "click",
        enviarSolicitud
    );


    async function enviarSolicitud() {

        validarSolicitud();


        if (
            btnEnviarSolicitud.disabled
        ) {

            return;
        }


        const datos = {

            id_mascota:
                animalSeleccionadoId,

            nombre:
                solNombre.value.trim(),

            cedula:
                solCedula.value.trim(),

            telefono:
                solTelefono.value.trim(),

            correo:
                solCorreo.value.trim(),

            direccion:
                solDireccion.value.trim(),

            vivienda:
                solVivienda.value,

            motivo:
                solMotivo.value.trim(),

            otras_mascotas:
                solOtrasMascotas.checked,

            acepta_visita:
                solVisita.checked
        };


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
                                datos
                            )
                    }
                );


            const resultado =
                await respuesta.json();


            console.log(
                "Solicitud:",
                resultado
            );


            if (!resultado.ok) {

                mensajeSolicitud.textContent =
                    resultado.mensaje ||
                    "No se pudo enviar la solicitud";


                mensajeSolicitud.style.color =
                    "#DC2626";


                return;
            }


            mensajeSolicitud.textContent =
                resultado.mensaje;


            mensajeSolicitud.style.color =
                "#15803D";


            document.getElementById(
                "formularioSolicitud"
            ).reset();


            btnEnviarSolicitud.disabled =
                true;


            await cargarMisSolicitudes();


        } catch (error) {

            console.error(
                "Error:",
                error
            );


            mensajeSolicitud.textContent =
                "Error al comunicarse con la API.";


            mensajeSolicitud.style.color =
                "#DC2626";

        }
    }


    async function cargarMisSolicitudes() {

        try {

            const respuesta =
                await fetch(
                    `${API}?accion=mis-solicitudes`
                );


            const resultado =
                await respuesta.json();


            if (!resultado.ok) {

                return;
            }


            const contenedor =
                document.getElementById(
                    "contenedorSolicitudes"
                );


            contenedor.innerHTML =
                "";


            if (
                resultado.datos.length === 0
            ) {

                contenedor.innerHTML =
                    "<p>No hay solicitudes enviadas.</p>";


                return;
            }


            resultado.datos.forEach(
                solicitud => {

                    contenedor.innerHTML += `

                        <div class="tarjetaSolicitud">

                            <h4>
                                Solicitud para
                                ${solicitud.mascota}
                            </h4>

                            <p>
                                Fecha:
                                ${formatearFecha(
                        solicitud.fecha_solicitud
                    )}
                            </p>

                            <p>
                                Estado:
                                ${solicitud.estado}
                            </p>

                        </div>

                    `;

                }
            );


        } catch (error) {

            console.error(
                "Error solicitudes:",
                error
            );

        }
    }

    function poblarEstadisticas() {

        document.getElementById(
            "statTotal"
        ).textContent =
            animales.length;


        document.getElementById(
            "statDisponibles"
        ).textContent =
            animales.filter(
                animal =>
                    animal.estado ===
                    "Disponible"
            ).length;


        const responsables =
            new Set(
                animales.map(
                    animal =>
                        animal.id_usuario
                )
            );


        document.getElementById(
            "statRescatistas"
        ).textContent =
            responsables.size;
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


        return fechaJS.toLocaleString(
            "es-CR",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    }

});