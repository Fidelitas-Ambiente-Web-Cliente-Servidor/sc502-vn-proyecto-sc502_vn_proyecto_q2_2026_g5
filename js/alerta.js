document.addEventListener("DOMContentLoaded", function () {



    const API = "api/alerta.php";

    const tipoInput = document.getElementById("tipo");
    const animalInput = document.getElementById("animal");
    const ubicacionInput = document.getElementById("ubicacion");
    const fechaInput = document.getElementById("fecha");
    const descripcionInput = document.getElementById("descripcion");

    const latitudInput = document.getElementById("latitud");
    const longitudInput = document.getElementById("longitud");

    const btnEnviar = document.getElementById("btnEnviar");

    const errorTipo = document.getElementById("errorTipo");
    const errorAnimal = document.getElementById("errorAnimal");
    const errorUbicacion = document.getElementById("errorUbicacion");
    const errorFecha = document.getElementById("errorFecha");
    const errorDescripcion = document.getElementById("errorDescripcion");
    const errorMapa = document.getElementById("errorMapa");

    const mensajeExito = document.getElementById("mensajeExito");

    const contenedorAlertas = document.getElementById("contenedorAlertas");

    const cantidadAlertas = document.getElementById("cantidadAlertas");



    if (typeof L === "undefined") {

        console.error("Leaflet no está cargado.");

        mensajeExito.innerText =
            "No fue posible cargar los mapas.";

        mensajeExito.style.color =
            "#DC2626";

        return;
    }




    const mapaSeleccion = L.map(
        "mapaSeleccion"
    ).setView(
        [9.9281, -84.0907],
        8
    );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap"
        }
    ).addTo(mapaSeleccion);


    let marcadorSeleccion = null;


    mapaSeleccion.on(
        "click",
        function (evento) {

            const latitud = evento.latlng.lat;

            const longitud = evento.latlng.lng;


            latitudInput.value = latitud;

            longitudInput.value = longitud;


            if (marcadorSeleccion) {

                marcadorSeleccion.setLatLng(
                    evento.latlng
                );

            }
            else {

                marcadorSeleccion = L.marker(
                    evento.latlng
                ).addTo(
                    mapaSeleccion
                );

            }


            marcadorSeleccion
                .bindPopup(
                    "Ubicación seleccionada"
                )
                .openPopup();


            errorMapa.innerText = "";


            validarFormulario();

        }
    );



    const mapaAlertas = L.map(
        "mapaAlertas"
    ).setView(
        [9.9281, -84.0907],
        8
    );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap"
        }
    ).addTo(mapaAlertas);


    const grupoMarcadores =
        L.layerGroup().addTo(
            mapaAlertas
        );




    function validarFormulario() {

        const tipo =
            tipoInput.value;

        const animal =
            animalInput.value.trim();

        const ubicacion =
            ubicacionInput.value.trim();

        const fecha =
            fechaInput.value;

        const descripcion =
            descripcionInput.value.trim();

        const latitud =
            latitudInput.value;

        const longitud =
            longitudInput.value;


        /* Tipo */

        if (tipo === "") {

            errorTipo.innerText =
                "Seleccione un tipo";

        }
        else {

            errorTipo.innerText = "";

        }


        /* Animal */

        if (animal.length < 3) {

            errorAnimal.innerText =
                "Mínimo 3 caracteres";

        }
        else {

            errorAnimal.innerText = "";

        }


        /* Ubicación */

        if (ubicacion.length < 3) {

            errorUbicacion.innerText =
                "Ingrese una ubicación";

        }
        else {

            errorUbicacion.innerText = "";

        }


        /* Fecha */

        if (fecha === "") {

            errorFecha.innerText =
                "Seleccione una fecha";

        }
        else {

            errorFecha.innerText = "";

        }


        /* Descripción */

        if (descripcion.length < 10) {

            errorDescripcion.innerText =
                "Mínimo 10 caracteres";

        }
        else {

            errorDescripcion.innerText = "";

        }


        /* Mapa */

        if (
            latitud === "" ||
            longitud === ""
        ) {

            errorMapa.innerText =
                "Seleccione un punto en el mapa";

        }
        else {

            errorMapa.innerText = "";

        }


        /* Botón */

        btnEnviar.disabled = !(
            tipo !== "" &&
            animal.length >= 3 &&
            ubicacion.length >= 3 &&
            fecha !== "" &&
            descripcion.length >= 10 &&
            latitud !== "" &&
            longitud !== ""
        );

    }


    tipoInput.addEventListener(
        "change",
        validarFormulario
    );

    animalInput.addEventListener(
        "input",
        validarFormulario
    );

    ubicacionInput.addEventListener(
        "input",
        validarFormulario
    );

    fechaInput.addEventListener(
        "change",
        validarFormulario
    );

    descripcionInput.addEventListener(
        "input",
        validarFormulario
    );


    async function cargarAlertas() {

        try {

            const respuesta =
                await fetch(API);


            const resultado =
                await respuesta.json();


            if (!respuesta.ok || !resultado.ok) {

                throw new Error(
                    resultado.detalle ||
                    resultado.mensaje ||
                    "No fue posible cargar las alertas"
                );

            }


            const alertas =
                Array.isArray(resultado.datos)
                    ? resultado.datos
                    : [];


            pintarAlertas(
                alertas
            );


            pintarMarcadores(
                alertas
            );


            actualizarContador(
                alertas.length
            );

        }
        catch (error) {

            console.error(
                "Error al cargar alertas:",
                error
            );


            contenedorAlertas.innerHTML =
                "<p>No fue posible cargar las alertas.</p>";


            actualizarContador(
                0
            );

        }

    }


    function pintarAlertas(alertas) {

        contenedorAlertas.innerHTML = "";


        if (alertas.length === 0) {

            contenedorAlertas.innerHTML =
                "<p>Todavía no hay alertas registradas.</p>";

            return;

        }


        alertas.forEach(
            function (alerta) {

                const tarjeta =
                    document.createElement(
                        "div"
                    );


                tarjeta.className =
                    "alerta";


                /* Título */

                const titulo =
                    document.createElement(
                        "h3"
                    );


                titulo.textContent =
                    obtenerNombreTipo(
                        alerta.tipo
                    );


                /* Lugar */

                const lugar =
                    document.createElement(
                        "p"
                    );


                lugar.textContent =
                    "Ubicación: " +
                    (
                        alerta.lugar_referencia ||
                        "No indicada"
                    );


                /* Fecha */

                const fecha =
                    document.createElement(
                        "p"
                    );


                fecha.textContent =
                    "Fecha: " +
                    formatearFecha(
                        alerta.fecha_reporte
                    );


                /* Descripción */

                const descripcion =
                    document.createElement(
                        "p"
                    );


                descripcion.textContent =
                    "Descripción: " +
                    (
                        alerta.descripcion ||
                        "Sin descripción"
                    );


                /* Estado */

                const estado =
                    document.createElement(
                        "p"
                    );


                estado.textContent =
                    "Estado: " +
                    (
                        alerta.estado ||
                        "Activo"
                    );


                tarjeta.appendChild(
                    titulo
                );

                tarjeta.appendChild(
                    lugar
                );

                tarjeta.appendChild(
                    fecha
                );

                tarjeta.appendChild(
                    descripcion
                );

                tarjeta.appendChild(
                    estado
                );


                contenedorAlertas.appendChild(
                    tarjeta
                );

            }
        );

    }


    function pintarMarcadores(alertas) {

        grupoMarcadores.clearLayers();


        const coordenadas = [];


        alertas.forEach(
            function (alerta) {


                if (
                    alerta.estado &&
                    alerta.estado !== "Activo"
                ) {

                    return;

                }


                const latitud =
                    parseFloat(
                        alerta.latitud
                    );


                const longitud =
                    parseFloat(
                        alerta.longitud
                    );


                if (
                    isNaN(latitud) ||
                    isNaN(longitud)
                ) {

                    return;

                }


                const posicion = [
                    latitud,
                    longitud
                ];


                coordenadas.push(
                    posicion
                );


                const marcador =
                    L.marker(
                        posicion
                    ).addTo(
                        grupoMarcadores
                    );


                const popup = `

                    <div class="popup-alerta">

                        <strong>
                            ${escaparHTML(
                                obtenerNombreTipo(
                                    alerta.tipo
                                )
                            )}
                        </strong>

                        <br><br>

                        <b>Ubicación:</b>

                        ${escaparHTML(
                            alerta.lugar_referencia ||
                            "No indicada"
                        )}

                        <br>

                        <b>Descripción:</b>

                        ${escaparHTML(
                            alerta.descripcion ||
                            "Sin descripción"
                        )}

                        <br>

                        <b>Fecha:</b>

                        ${escaparHTML(
                            formatearFecha(
                                alerta.fecha_reporte
                            )
                        )}

                    </div>

                `;


                marcador.bindPopup(
                    popup
                );

            }
        );


        if (
            coordenadas.length === 1
        ) {

            mapaAlertas.setView(
                coordenadas[0],
                14
            );

        }
        else if (
            coordenadas.length > 1
        ) {

            mapaAlertas.fitBounds(
                coordenadas,
                {
                    padding: [
                        40,
                        40
                    ]
                }
            );

        }
        else {

            mapaAlertas.setView(
                [9.9281, -84.0907],
                8
            );

        }

    }


    btnEnviar.addEventListener(
        "click",
        async function () {


            validarFormulario();


            if (
                btnEnviar.disabled
            ) {

                return;

            }


            const datos = {

                id_usuario: 1,

                tipo:
                    tipoInput.value,

                descripcion:
                    "Animal: " +
                    animalInput.value.trim() +
                    ". " +
                    descripcionInput.value.trim(),

                latitud:
                    parseFloat(
                        latitudInput.value
                    ),

                longitud:
                    parseFloat(
                        longitudInput.value
                    ),

                lugar_referencia:
                    ubicacionInput.value.trim(),

                estado:
                    "Activo"

            };


            try {

                btnEnviar.disabled =
                    true;


                btnEnviar.innerHTML = `

                    <i class="fa-solid fa-spinner fa-spin"></i>

                    Publicando...

                `;


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


                if (
                    !respuesta.ok ||
                    !resultado.ok
                ) {

                    throw new Error(
                        resultado.detalle ||
                        resultado.mensaje ||
                        "No se pudo publicar el reporte"
                    );

                }


                mensajeExito.innerText =
                    "¡Reporte publicado correctamente!";


                mensajeExito.style.color =
                    "#0F766E";


                limpiarFormulario();


                await cargarAlertas();


                setTimeout(
                    function () {

                        mensajeExito.innerText =
                            "";

                    },
                    3000
                );

            }
            catch (error) {

                console.error(
                    "Error al publicar:",
                    error
                );


                mensajeExito.innerText =
                    "Error: " +
                    error.message;


                mensajeExito.style.color =
                    "#DC2626";

            }
            finally {

                btnEnviar.innerHTML = `

                    <i class="fa-solid fa-paper-plane"></i>

                    Publicar Reporte

                `;


                validarFormulario();

            }

        }
    );


    function limpiarFormulario() {

        tipoInput.value = "";

        animalInput.value = "";

        ubicacionInput.value = "";

        fechaInput.value = "";

        descripcionInput.value = "";

        latitudInput.value = "";

        longitudInput.value = "";


        errorTipo.innerText = "";

        errorAnimal.innerText = "";

        errorUbicacion.innerText = "";

        errorFecha.innerText = "";

        errorDescripcion.innerText = "";

        errorMapa.innerText = "";


        if (
            marcadorSeleccion
        ) {

            mapaSeleccion.removeLayer(
                marcadorSeleccion
            );


            marcadorSeleccion =
                null;

        }


        mapaSeleccion.setView(
            [9.9281, -84.0907],
            8
        );


        btnEnviar.disabled =
            true;

    }


    function actualizarContador(
        cantidad
    ) {

        if (!cantidadAlertas) {

            return;

        }


        cantidadAlertas.innerText =
            cantidad +
            (
                cantidad === 1
                    ? " Reporte"
                    : " Reportes"
            );

    }


    function obtenerNombreTipo(
        tipo
    ) {

        if (
            tipo === "Perdida"
        ) {

            return "Animal Perdido";

        }


        if (
            tipo === "Encontrada"
        ) {

            return "Animal Encontrado";

        }


        return tipo || "Reporte";

    }

    function formatearFecha(
        fecha
    ) {

        if (!fecha) {

            return "No indicada";

        }


        const partes =
            fecha.split(" ")[0]
                .split("-");


        if (
            partes.length !== 3
        ) {

            return fecha;

        }


        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );

    }

    function escaparHTML(
        texto
    ) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            texto;


        return div.innerHTML;

    }


    setTimeout(
        function () {

            mapaSeleccion.invalidateSize();

            mapaAlertas.invalidateSize();

        },
        200
    );



    cargarAlertas();

});