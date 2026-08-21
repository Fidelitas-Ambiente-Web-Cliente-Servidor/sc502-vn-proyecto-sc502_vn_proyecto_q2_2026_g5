const API = "api/reportes.php";

document.addEventListener("DOMContentLoaded", function () {


    let tipoInput =
        document.getElementById("tipo");

    let animalInput =
        document.getElementById("animal");

    let ubicacionInput =
        document.getElementById("ubicacion");

    let fechaInput =
        document.getElementById("fecha");


    // =========================================
    // TIPOS: texto del <option> -> ENUM de la BD
    // =========================================

    const TIPOS = {
        "Animal Perdido": "Perdida",
        "Animal Encontrado": "Encontrada"
    };

    const TIPOS_INVERSO = {
        "Perdida": "Animal Perdido",
        "Encontrada": "Animal Encontrado"
    };


    // =========================================
    // CARGAR MIS ALERTAS AL ENTRAR
    // =========================================

    cargarAlertas();


    // =========================================
    // VALIDACIÓN DEL FORMULARIO
    // =========================================

    function validarFormulario() {
    let descripcionInput =
        document.getElementById("descripcion");


    let latitudInput =
        document.getElementById("latitud");

    let longitudInput =
        document.getElementById("longitud");


    let btnEnviar =
        document.getElementById("btnEnviar");


    let errorTipo =
        document.getElementById("errorTipo");

    let errorAnimal =
        document.getElementById("errorAnimal");

    let errorUbicacion =
        document.getElementById("errorUbicacion");

    let errorFecha =
        document.getElementById("errorFecha");

    let errorDescripcion =
        document.getElementById("errorDescripcion");

    let errorMapa =
        document.getElementById("errorMapa");


    let mensajeExito =
        document.getElementById("mensajeExito");


    let contenedorAlertas =
        document.getElementById("contenedorAlertas");


    let cantidadAlertas =
        document.getElementById("cantidadAlertas");



    let mapaSeleccion = L.map(
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


            let latitud =
                evento.latlng.lat;


            let longitud =
                evento.latlng.lng;



            /* Guardar coordenadas */

            latitudInput.value =
                latitud;


            longitudInput.value =
                longitud;



            /* Si ya existe marcador lo movemos */

            if (marcadorSeleccion) {


                marcadorSeleccion.setLatLng(
                    evento.latlng
                );


            }
            else {


                marcadorSeleccion =
                    L.marker(
                        evento.latlng
                    )
                        .addTo(
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



    let mapaAlertas = L.map(
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




    let grupoMarcadores =
        L.layerGroup()
            .addTo(
                mapaAlertas
            );




    function cargarAlertas() {


        fetch(
            "api/alerta.php"
        )


            .then(
                function (respuesta) {


                    if (!respuesta.ok) {

                        throw new Error(
                            "Error HTTP: " +
                            respuesta.status
                        );

                    }


                    return respuesta.json();


                }
            )


            .then(
                function (resultado) {


                    if (
                        resultado.ok &&
                        Array.isArray(resultado.datos)
                    ) {


                        /* Limpiar tarjetas */

                        contenedorAlertas.innerHTML = "";


                        /* Limpiar mapa */

                        grupoMarcadores.clearLayers();



                        /* Actualizar contador */

                        cantidadAlertas.innerText =
                            resultado.datos.length +
                            (
                                resultado.datos.length === 1
                                    ? " Reporte"
                                    : " Reportes"
                            );



                        /* Coordenadas para ajustar mapa */

                        let coordenadas = [];



                        resultado.datos.forEach(
                            function (alerta) {


                                /* Mostrar tarjeta */

                                crearTarjetaAlerta(
                                    alerta
                                );


                                /* Mostrar marcador */

                                crearMarcadorAlerta(
                                    alerta,
                                    coordenadas
                                );


                            }
                        );



                        /* Ajustar mapa a los marcadores */

                        if (
                            coordenadas.length > 0
                        ) {


                            mapaAlertas.fitBounds(
                                coordenadas,
                                {
                                    padding: [
                                        40,
                                        40
                                    ],
                                    maxZoom: 14
                                }
                            );


                        }


                    }


                }
            )


            .catch(
                function (error) {


                    console.log(
                        "Error al cargar alertas:",
                        error
                    );


                    contenedorAlertas.innerHTML =
                        "<p>No fue posible cargar las alertas.</p>";


                }
            );


    }

    tipoInput.addEventListener("input", validarFormulario);
    animalInput.addEventListener("input", validarFormulario);
    ubicacionInput.addEventListener("input", validarFormulario);
    fechaInput.addEventListener("input", validarFormulario);
    descripcionInput.addEventListener("input", validarFormulario);


    // =========================================
    // ENVIAR REPORTE (POST a la API real)
    // =========================================

    btnEnviar.addEventListener("click", async function () {

        const datos = {
            tipo: TIPOS[tipoInput.value] || tipoInput.value,
            animal: animalInput.value.trim(),
            lugar_referencia: ubicacionInput.value.trim(),
            fecha_evento: fechaInput.value,
            descripcion: descripcionInput.value.trim()
        };

    function crearMarcadorAlerta(
        alerta,
        coordenadas
    ) {


        if (
            alerta.latitud === null ||
            alerta.longitud === null ||
            alerta.latitud === "" ||
            alerta.longitud === ""
        ) {

            return;

        }



        let latitud =
            parseFloat(
                alerta.latitud
            );


        let longitud =
            parseFloat(
                alerta.longitud
            );



        if (
            isNaN(latitud) ||
            isNaN(longitud)
        ) {

            return;

        }



        let posicion = [
            latitud,
            longitud
        ];



        coordenadas.push(
            posicion
        );



        /* Crear marcador */

        let marcador =
            L.marker(
                posicion
            );


        marcador.addTo(
            grupoMarcadores
        );



        /* Popup */

        let popup = `

            <div class="popup-alerta">

                <strong>
                    ${escaparHTML(alerta.tipo || "Reporte")}
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
            alerta.fecha_reporte ||
            "No indicada"
        )}

            </div>

        `;



        marcador.bindPopup(
            popup
        );


    }




    function crearTarjetaAlerta(
        alerta
    ) {


        let tarjeta =
            document.createElement(
                "div"
            );


        tarjeta.className =
            "alerta";



        /* Título */

        let titulo =
            document.createElement(
                "h3"
            );


        titulo.textContent =
            alerta.tipo ||
            "Reporte";



        /* Ubicación */

        let lugar =
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

        let fecha =
            document.createElement(
                "p"
            );


        fecha.textContent =
            "Fecha: " +
            (
                alerta.fecha_reporte ||
                "No indicada"
            );



        /* Descripción */

        let descripcion =
            document.createElement(
                "p"
            );


        descripcion.textContent =
            "Descripción: " +
            (
                alerta.descripcion ||
                "Sin descripción"
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



        contenedorAlertas.appendChild(
            tarjeta
        );


    }



    function validarFormulario() {


        let tipo =
            tipoInput.value;


        let animal =
            animalInput.value.trim();


        let ubicacion =
            ubicacionInput.value.trim();


        let fecha =
            fechaInput.value;


        let descripcion =
            descripcionInput.value.trim();


        let latitud =
            latitudInput.value;


        let longitud =
            longitudInput.value;



        /* TIPO */

        if (
            tipo === ""
        ) {


            errorTipo.innerText =
                "Seleccione un tipo";


        }
        else {


            errorTipo.innerText = "";


        }



        /* ANIMAL */

        if (
            animal.length < 3
        ) {


            errorAnimal.innerText =
                "Mínimo 3 caracteres";


        }
        else {


            errorAnimal.innerText = "";


        }



        /* UBICACIÓN */

        if (
            ubicacion.length < 3
        ) {


            errorUbicacion.innerText =
                "Ingrese una ubicación";


        }
        else {


            errorUbicacion.innerText = "";


        }



        /* FECHA */

        if (
            fecha === ""
        ) {


            errorFecha.innerText =
                "Seleccione una fecha";


        }
        else {


            errorFecha.innerText = "";


        }



        /* DESCRIPCIÓN */

        if (
            descripcion.length < 10
        ) {


            errorDescripcion.innerText =
                "Mínimo 10 caracteres";


        }
        else {


            errorDescripcion.innerText = "";


        }



        /* MAPA */

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



        /* HABILITAR BOTÓN */

        if (
            tipo !== "" &&
            animal.length >= 3 &&
            ubicacion.length >= 3 &&
            fecha !== "" &&
            descripcion.length >= 10 &&
            latitud !== "" &&
            longitud !== ""
        ) {


            btnEnviar.disabled =
                false;


        }
        else {


            btnEnviar.disabled =
                true;


        }


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




    btnEnviar.addEventListener(
        "click",
        function () {


            validarFormulario();


            if (
                btnEnviar.disabled
            ) {

                return;

            }


            let datos = {


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



            /* Deshabilitar mientras guarda */

            btnEnviar.disabled = true;


            btnEnviar.innerHTML = `

                <i class="fa-solid fa-spinner fa-spin"></i>

                Publicando...

            `;


            fetch(
                "api/alerta.php",
                {


                    method:
                        "POST",


                    headers: {

                        "Content-Type":
                            "application/json"

                    },


                    body:
                        JSON.stringify(
                            datos
                        )


                }
            )


                .then(
                    function (respuesta) {


                        return respuesta
                            .json()
                            .then(
                                function (resultado) {


                                    return {

                                        estado:
                                            respuesta.status,

                                        resultado:
                                            resultado

                                    };


                                }
                            );


                    }
                )


                .then(
                    function (respuesta) {


                        let resultado =
                            respuesta.resultado;



                        if (!resultado.ok) {

                            console.log("Respuesta completa del servidor:", resultado);

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



                        /* =========================================
                           LIMPIAR FORMULARIO
                        ========================================= */


                        tipoInput.value = "";


                        animalInput.value = "";


                        ubicacionInput.value = "";


                        fechaInput.value = "";


                        descripcionInput.value = "";


                        latitudInput.value = "";


                        longitudInput.value = "";



                        /* Quitar marcador selección */

                        if (
                            marcadorSeleccion
                        ) {


                            mapaSeleccion.removeLayer(
                                marcadorSeleccion
                            );


                            marcadorSeleccion =
                                null;


                        }



                        /* Centrar nuevamente */

                        mapaSeleccion.setView(
                            [9.9281, -84.0907],
                            8
                        );



                        cargarAlertas();



                        setTimeout(
                            function () {


                                mensajeExito.innerText =
                                    "";


                            },
                            3000
                        );


                    }
                )


                .catch(
                    function (error) {


                        console.log(
                            error
                        );


                        mensajeExito.innerText =
                            "Error: " +
                            error.message;


                        mensajeExito.style.color =
                            "#DC2626";


                    }
                )


                .finally(
                    function () {


                        btnEnviar.innerHTML = `

                        <i class="fa-solid fa-paper-plane"></i>

                        Publicar Reporte

                    `;


                        validarFormulario();


                    }
                );


        }
    );



    function escaparHTML(
        texto
    ) {


        let div =
            document.createElement(
                "div"
            );


        div.textContent =
            texto;


        return div.innerHTML;


    }



    cargarAlertas();


    // =========================================
    // CARGAR Y PINTAR MIS ALERTAS (GET real)
    // =========================================

    async function cargarAlertas() {

        contenedorAlertas.innerHTML = "<p>Cargando...</p>";

        try {

            const respuesta = await fetch(API);

            const resultado = await respuesta.json();

            if (!resultado.ok) {

                contenedorAlertas.innerHTML = "<p>No se pudieron cargar tus alertas.</p>";
                return;

            }

            pintarAlertas(resultado.datos);

        } catch (error) {

            contenedorAlertas.innerHTML = "<p>No se pudo conectar con el servidor.</p>";

        }

    }

    function pintarAlertas(reportes) {

        contenedorAlertas.innerHTML = "";

        if (reportes.length === 0) {

            contenedorAlertas.innerHTML = "<p>Todavía no has publicado ninguna alerta.</p>";
            return;

        }

        reportes.forEach(r => {

            let tarjeta = document.createElement("div");
            tarjeta.className = "alerta";

            let titulo = document.createElement("h3");
            titulo.textContent = TIPOS_INVERSO[r.tipo] || r.tipo;

            let mascota = document.createElement("p");
            mascota.textContent = "Animal: " + r.animal;

            let lugar = document.createElement("p");
            lugar.textContent = "Ubicación: " + (r.lugar_referencia || "");

            let fecha = document.createElement("p");
            fecha.textContent = "Fecha: " + r.fecha_evento;

            let descripcion = document.createElement("p");
            descripcion.textContent = "Descripción: " + r.descripcion;

            let estado = document.createElement("span");
            estado.className = "estadoReporte";
            estado.textContent = r.estado;

            tarjeta.appendChild(titulo);
            tarjeta.appendChild(mascota);
            tarjeta.appendChild(lugar);
            tarjeta.appendChild(fecha);
            tarjeta.appendChild(descripcion);
            tarjeta.appendChild(estado);

            contenedorAlertas.appendChild(tarjeta);

        });

    }

});
