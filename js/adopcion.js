document.addEventListener("DOMContentLoaded", function () {

    let cantonesPorProvincia = {
        "San José": ["San José", "Escazú", "Desamparados", "Curridabat"],
        "Alajuela": ["Alajuela", "San Ramón", "Grecia"],
        "Cartago": ["Cartago", "Paraíso", "Turrialba"],
        "Heredia": ["Heredia", "Barva", "Santo Domingo"],
        "Guanacaste": ["Liberia", "Nicoya", "Santa Cruz"],
        "Puntarenas": ["Puntarenas", "Esparza", "Golfito"],
        "Limón": ["Limón", "Pococí", "Talamanca"]
    };

    let rescatistas = [
        {
            id: 1,
            nombre: "María Fernández",
            organizacion: "Refugio Patitas Felices",
            ubicacion: "Escazú, San José",
            telefono: "8888-1234",
            correo: "patitasfelices@gmail.com",
            descripcion: "Refugio sin fines de lucro dedicado al rescate de perros y gatos abandonados desde el 2016. Todos nuestros animales son revisados por un veterinario antes de salir en adopción."
        },
        {
            id: 2,
            nombre: "Ana Rojas",
            organizacion: "Asociación Rescate Guanacaste",
            ubicacion: "Liberia, Guanacaste",
            telefono: "8777-5566",
            correo: "rescateguanacaste@hotmail.com",
            descripcion: "Grupo de voluntarios que atiende animales en situación de calle en la zona de Liberia y Santa Cruz. Trabajamos con esterilización y adopción responsable."
        },
        {
            id: 3,
            nombre: "Carlos Vindas",
            organizacion: "Fundación Huellas Solidarias",
            ubicacion: "Heredia centro",
            telefono: "8666-9988",
            correo: "huellassolidarias@gmail.com",
            descripcion: "Fundación enfocada en el rescate de animales heridos o en abandono en la provincia de Heredia. Contamos con casa hogar temporal para 20 animales."
        },
        {
            id: 4,
            nombre: "Sor Lucía Araya",
            organizacion: "Refugio San Francisco de Asís",
            ubicacion: "Paraíso, Cartago",
            telefono: "8555-3322",
            correo: "sanfranciscoasis.cr@gmail.com",
            descripcion: "Refugio con más de 10 años de experiencia en el cuidado de animales de edad avanzada y con discapacidad."
        },
        {
            id: 5,
            nombre: "José Solano",
            organizacion: "Rescate Animal Puntarenas",
            ubicacion: "Puntarenas centro",
            telefono: "8444-7711",
            correo: "rescatepuntarenas@gmail.com",
            descripcion: "Nos dedicamos al rescate de animales en la zona costera, principalmente perros abandonados en playas y muelles."
        }
    ];

    let animales = [
        { id: 1, nombre: "Firulais", especie: "Perro", raza: "Mestizo", tamano: "Mediano", sexo: "Macho", edad: "2 años", provincia: "San José", canton: "Escazú", distancia: 4, vacunado: true, esterilizado: true, estado: "Disponible", imagen: "https://placedog.net/500/350?id=1", rescatistaId: 1, descripcion: "Firulais es un perro muy juguetón y cariñoso, le encanta pasear y se lleva bien con niños y otros perros." },
        { id: 2, nombre: "Michi", especie: "Gato", raza: "Siames", tamano: "Pequeño", sexo: "Hembra", edad: "1 año", provincia: "San José", canton: "Curridabat", distancia: 7, vacunado: true, esterilizado: false, estado: "Disponible", imagen: "https://placedog.net/500/350?id=2", rescatistaId: 1, descripcion: "Michi es tranquila y algo tímida al inicio, pero muy cariñosa una vez toma confianza. Ideal para apartamento." },
        { id: 3, nombre: "Rocky", especie: "Perro", raza: "Labrador", tamano: "Grande", sexo: "Macho", edad: "3 años", provincia: "Heredia", canton: "Heredia", distancia: 12, vacunado: true, esterilizado: true, estado: "Disponible", imagen: "https://placedog.net/500/350?id=3", rescatistaId: 3, descripcion: "Rocky es un perro activo, necesita espacio para correr y familia con experiencia en perros grandes." },
        { id: 4, nombre: "Luna", especie: "Gato", raza: "Persa", tamano: "Pequeño", sexo: "Hembra", edad: "4 años", provincia: "Heredia", canton: "Santo Domingo", distancia: 15, vacunado: true, esterilizado: true, estado: "En proceso", imagen: "https://placedog.net/500/350?id=4", rescatistaId: 3, descripcion: "Luna es muy tranquila, disfruta dormir en lugares soleados y no le gusta mucho el ruido." },
        { id: 5, nombre: "Toby", especie: "Perro", raza: "Poodle", tamano: "Pequeño", sexo: "Macho", edad: "5 años", provincia: "Cartago", canton: "Paraíso", distancia: 20, vacunado: true, esterilizado: true, estado: "Disponible", imagen: "https://placedog.net/500/350?id=5", rescatistaId: 4, descripcion: "Toby es un perro adulto muy tranquilo, ideal para personas mayores o familias sin niños pequeños." },
        { id: 6, nombre: "Nala", especie: "Gato", raza: "Mestizo", tamano: "Mediano", sexo: "Hembra", edad: "8 meses", provincia: "Cartago", canton: "Cartago", distancia: 18, vacunado: false, esterilizado: false, estado: "Disponible", imagen: "https://placedog.net/500/350?id=6", rescatistaId: 4, descripcion: "Nala es una gatita joven, muy activa y curiosa. Se recomienda adoptarla con paciencia para su adaptación." },
        { id: 7, nombre: "Max", especie: "Perro", raza: "Criollo", tamano: "Grande", sexo: "Macho", edad: "6 años", provincia: "Guanacaste", canton: "Liberia", distancia: 35, vacunado: true, esterilizado: true, estado: "Disponible", imagen: "https://placedog.net/500/350?id=7", rescatistaId: 2, descripcion: "Max fue rescatado de la calle, es un perro noble y protector, ya está totalmente adaptado a la vida en casa." },
        { id: 8, nombre: "Coco", especie: "Perro", raza: "Chihuahua", tamano: "Pequeño", sexo: "Hembra", edad: "1 año", provincia: "Guanacaste", canton: "Santa Cruz", distancia: 40, vacunado: true, esterilizado: false, estado: "Disponible", imagen: "https://placedog.net/500/350?id=8", rescatistaId: 2, descripcion: "Coco es pequeña pero muy valiente, le encanta estar en brazos y socializa bien con otras mascotas." },
        { id: 9, nombre: "Simona", especie: "Gato", raza: "Mestizo", tamano: "Mediano", sexo: "Hembra", edad: "2 años", provincia: "Puntarenas", canton: "Puntarenas", distancia: 28, vacunado: true, esterilizado: true, estado: "Disponible", imagen: "https://placedog.net/500/350?id=9", rescatistaId: 5, descripcion: "Simona es cariñosa y le gusta seguir a las personas por la casa, buena con niños." },
        { id: 10, nombre: "Duke", especie: "Perro", raza: "Pastor Alemán", tamano: "Grande", sexo: "Macho", edad: "4 años", provincia: "Puntarenas", canton: "Golfito", distancia: 45, vacunado: true, esterilizado: true, estado: "En proceso", imagen: "https://placedog.net/500/350?id=10", rescatistaId: 5, descripcion: "Duke es un perro guardián, obediente y ya entrenado en comandos básicos." },
        { id: 11, nombre: "Pelusa", especie: "Gato", raza: "Angora", tamano: "Pequeño", sexo: "Hembra", edad: "3 años", provincia: "San José", canton: "Desamparados", distancia: 9, vacunado: true, esterilizado: true, estado: "Disponible", imagen: "https://placedog.net/500/350?id=11", rescatistaId: 1, descripcion: "Pelusa necesita cepillado frecuente por su pelaje largo, es muy dócil y cariñosa." },
        { id: 12, nombre: "Bruno", especie: "Perro", raza: "Beagle", tamano: "Mediano", sexo: "Macho", edad: "2 años", provincia: "Alajuela", canton: "Alajuela", distancia: 22, vacunado: true, esterilizado: false, estado: "Disponible", imagen: "https://placedog.net/500/350?id=12", rescatistaId: 3, descripcion: "Bruno es muy energético, ideal para familias activas que disfruten salir a caminar o correr." },
        { id: 13, nombre: "Kiara", especie: "Gato", raza: "Siames", tamano: "Pequeño", sexo: "Hembra", edad: "6 meses", provincia: "Alajuela", canton: "Grecia", distancia: 26, vacunado: false, esterilizado: false, estado: "Disponible", imagen: "https://placedog.net/500/350?id=13", rescatistaId: 3, descripcion: "Kiara es una gatita bebé, requiere cuidados especiales y seguimiento con el veterinario." },
        { id: 14, nombre: "Zeus", especie: "Perro", raza: "Rottweiler", tamano: "Grande", sexo: "Macho", edad: "5 años", provincia: "Limón", canton: "Limón", distancia: 50, vacunado: true, esterilizado: true, estado: "Disponible", imagen: "https://placedog.net/500/350?id=14", rescatistaId: 2, descripcion: "Zeus es un perro grande y tranquilo, se recomienda adoptante con experiencia en razas grandes." }
    ];

    let animalSeleccionadoId = null;
    let solicitudesEnviadas = [];

    let filtroNombre = document.getElementById("filtroNombre");
    let filtroEspecie = document.getElementById("filtroEspecie");
    let filtroRaza = document.getElementById("filtroRaza");
    let filtroTamano = document.getElementById("filtroTamano");
    let filtroProvincia = document.getElementById("filtroProvincia");
    let filtroCanton = document.getElementById("filtroCanton");
    let filtroDistancia = document.getElementById("filtroDistancia");
    let filtroDistanciaValor = document.getElementById("filtroDistanciaValor");
    let btnLimpiar = document.getElementById("btnLimpiar");

    let contenedorAnimales = document.getElementById("contenedorAnimales");
    let resultadoConteo = document.getElementById("resultadoConteo");
    let sinResultados = document.getElementById("sinResultados");

    function poblarSelectRazas() {

        let razas = [];

        for (let i = 0; i < animales.length; i++) {
            if (razas.indexOf(animales[i].raza) === -1) {
                razas.push(animales[i].raza);
            }
        }

        razas.sort();

        for (let i = 0; i < razas.length; i++) {
            let opcion = document.createElement("option");
            opcion.value = razas[i];
            opcion.textContent = razas[i];
            filtroRaza.appendChild(opcion);
        }

    }

    function poblarSelectProvincias() {

        for (let provincia in cantonesPorProvincia) {
            let opcion = document.createElement("option");
            opcion.value = provincia;
            opcion.textContent = provincia;
            filtroProvincia.appendChild(opcion);
        }

    }

    function poblarSelectCantones(provincia) {

        filtroCanton.innerHTML = "";

        let opcionTodos = document.createElement("option");
        opcionTodos.value = "Todos";
        opcionTodos.textContent = "Todos";
        filtroCanton.appendChild(opcionTodos);

        if (provincia !== "Todas" && cantonesPorProvincia[provincia]) {
            let cantones = cantonesPorProvincia[provincia];
            for (let i = 0; i < cantones.length; i++) {
                let opcion = document.createElement("option");
                opcion.value = cantones[i];
                opcion.textContent = cantones[i];
                filtroCanton.appendChild(opcion);
            }
        }

    }

    function obtenerRescatista(id) {
        for (let i = 0; i < rescatistas.length; i++) {
            if (rescatistas[i].id === id) {
                return rescatistas[i];
            }
        }
        return null;
    }

    function crearTarjetaAnimal(animal) {

        let tarjeta = document.createElement("div");
        tarjeta.className = "card cardAnimal";

        let foto = document.createElement("img");
        foto.className = "foto";
        foto.src = animal.imagen;
        foto.alt = animal.nombre;

        let nombre = document.createElement("h3");
        nombre.textContent = animal.nombre;

        let razaEdad = document.createElement("p");
        razaEdad.className = "datosAnimal";
        razaEdad.textContent = animal.raza + " • " + animal.edad + " • " + animal.tamano;

        let ubicacion = document.createElement("p");
        ubicacion.className = "datosAnimal";
        ubicacion.textContent = animal.canton + ", " + animal.provincia + " (" + animal.distancia + " km)";

        let estado = document.createElement("span");
        estado.className = animal.estado === "Disponible" ? "estadoBadge estadoDisponible" : "estadoBadge estadoProceso";
        estado.textContent = animal.estado;

        let boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = "Ver perfil";
        boton.setAttribute("data-id", animal.id);

        tarjeta.appendChild(foto);
        tarjeta.appendChild(nombre);
        tarjeta.appendChild(razaEdad);
        tarjeta.appendChild(ubicacion);
        tarjeta.appendChild(estado);
        tarjeta.appendChild(boton);

        return tarjeta;

    }

    function renderizarAnimales(lista) {

        contenedorAnimales.innerHTML = "";

        document.getElementById("statResultados").textContent = lista.length;

        if (lista.length === 0) {
            sinResultados.textContent = "No se encontraron animales con los filtros seleccionados.";
            resultadoConteo.textContent = "";
            return;
        }

        sinResultados.textContent = "";
        resultadoConteo.textContent = "Se encontraron " + lista.length + " animales.";

        for (let i = 0; i < lista.length; i++) {
            contenedorAnimales.appendChild(crearTarjetaAnimal(lista[i]));
        }

    }

    function aplicarFiltros() {

        let nombre = filtroNombre.value.toLowerCase().trim();
        let especie = filtroEspecie.value;
        let raza = filtroRaza.value;
        let tamano = filtroTamano.value;
        let provincia = filtroProvincia.value;
        let canton = filtroCanton.value;
        let distanciaMax = parseInt(filtroDistancia.value);

        let resultado = animales.filter(function (animal) {

            if (nombre !== "" && animal.nombre.toLowerCase().indexOf(nombre) === -1) {
                return false;
            }
            if (especie !== "Todas" && animal.especie !== especie) {
                return false;
            }
            if (raza !== "Todas" && animal.raza !== raza) {
                return false;
            }
            if (tamano !== "Todos" && animal.tamano !== tamano) {
                return false;
            }
            if (provincia !== "Todas" && animal.provincia !== provincia) {
                return false;
            }
            if (canton !== "Todos" && animal.canton !== canton) {
                return false;
            }
            if (animal.distancia > distanciaMax) {
                return false;
            }

            return true;

        });

        renderizarAnimales(resultado);

    }

    function limpiarFiltros() {

        filtroNombre.value = "";
        filtroEspecie.value = "Todas";
        filtroRaza.value = "Todas";
        filtroTamano.value = "Todos";
        filtroProvincia.value = "Todas";
        poblarSelectCantones("Todas");
        filtroDistancia.value = 60;
        filtroDistanciaValor.textContent = "60 km";

        renderizarAnimales(animales);

    }

    function mostrarVista(idVista) {

        let vistas = document.querySelectorAll(".vista");

        for (let i = 0; i < vistas.length; i++) {
            vistas[i].classList.add("oculto");
        }

        document.getElementById(idVista).classList.remove("oculto");

        window.scrollTo(0, 0);

    }

    function mostrarPerfil(idAnimal) {

        let animal = null;

        for (let i = 0; i < animales.length; i++) {
            if (animales[i].id === idAnimal) {
                animal = animales[i];
            }
        }

        if (animal === null) {
            return;
        }

        animalSeleccionadoId = animal.id;

        let foto = document.getElementById("perfilFoto");
        foto.src = animal.imagen;
        foto.alt = animal.nombre;

        document.getElementById("perfilNombre").textContent = animal.nombre;

        let estadoSpan = document.getElementById("perfilEstado");
        estadoSpan.textContent = animal.estado;
        estadoSpan.className = animal.estado === "Disponible" ? "estadoBadge estadoDisponible" : "estadoBadge estadoProceso";

        document.getElementById("perfilEspecieRaza").textContent = animal.especie + " • " + animal.raza;
        document.getElementById("perfilEdad").textContent = animal.edad;
        document.getElementById("perfilSexo").textContent = animal.sexo;
        document.getElementById("perfilTamano").textContent = animal.tamano;
        document.getElementById("perfilUbicacion").textContent = animal.canton + ", " + animal.provincia;
        document.getElementById("perfilDistancia").textContent = animal.distancia + " km de tu ubicación";
        document.getElementById("perfilVacunado").textContent = animal.vacunado ? "Sí" : "No";
        document.getElementById("perfilEsterilizado").textContent = animal.esterilizado ? "Sí" : "No";
        document.getElementById("perfilDescripcion").textContent = animal.descripcion;

        let rescatista = obtenerRescatista(animal.rescatistaId);

        if (rescatista !== null) {

            document.getElementById("rescatistaNombre").textContent = rescatista.nombre;
            document.getElementById("rescatistaOrg").textContent = rescatista.organizacion;
            document.getElementById("rescatistaUbicacion").textContent = rescatista.ubicacion;
            document.getElementById("rescatistaTelefono").textContent = rescatista.telefono;
            document.getElementById("rescatistaCorreo").textContent = rescatista.correo;
            document.getElementById("rescatistaDescripcion").textContent = rescatista.descripcion;

            let otrosAnimales = animales.filter(function (a) {
                return a.rescatistaId === rescatista.id && a.id !== animal.id;
            });

            document.getElementById("rescatistaOtrosAnimales").textContent = "Este rescatista tiene " + otrosAnimales.length + " animal(es) más publicados para adopción.";

        }

        mostrarVista("vistaPerfil");

    }

    filtroNombre.addEventListener("input", aplicarFiltros);
    filtroEspecie.addEventListener("change", aplicarFiltros);
    filtroRaza.addEventListener("change", aplicarFiltros);
    filtroTamano.addEventListener("change", aplicarFiltros);

    filtroProvincia.addEventListener("change", function () {
        poblarSelectCantones(filtroProvincia.value);
        aplicarFiltros();
    });

    filtroCanton.addEventListener("change", aplicarFiltros);

    filtroDistancia.addEventListener("input", function () {
        filtroDistanciaValor.textContent = filtroDistancia.value + " km";
        aplicarFiltros();
    });

    btnLimpiar.addEventListener("click", limpiarFiltros);

    contenedorAnimales.addEventListener("click", function (evento) {
        if (evento.target.tagName === "BUTTON") {
            let idAnimal = parseInt(evento.target.getAttribute("data-id"));
            mostrarPerfil(idAnimal);
        }
    });

    document.getElementById("btnVolverBusqueda").addEventListener("click", function () {
        mostrarVista("vistaBusqueda");
    });

    document.getElementById("btnVolverPerfil").addEventListener("click", function () {
        mostrarVista("vistaPerfil");
    });

    document.getElementById("btnSolicitarAdopcion").addEventListener("click", function () {

        let animal = null;

        for (let i = 0; i < animales.length; i++) {
            if (animales[i].id === animalSeleccionadoId) {
                animal = animales[i];
            }
        }

        if (animal !== null) {
            document.getElementById("solicitudAnimalNombre").textContent = animal.nombre;
        }

        mostrarVista("vistaSolicitud");

    });

    /* ---------- Formulario de solicitud de adopción ---------- */

    let solNombre = document.getElementById("solNombre");
    let solCedula = document.getElementById("solCedula");
    let solTelefono = document.getElementById("solTelefono");
    let solCorreo = document.getElementById("solCorreo");
    let solDireccion = document.getElementById("solDireccion");
    let solVivienda = document.getElementById("solVivienda");
    let solMotivo = document.getElementById("solMotivo");
    let solOtrasMascotas = document.getElementById("solOtrasMascotas");
    let solVisita = document.getElementById("solVisita");

    let errorSolNombre = document.getElementById("errorSolNombre");
    let errorSolCedula = document.getElementById("errorSolCedula");
    let errorSolTelefono = document.getElementById("errorSolTelefono");
    let errorSolCorreo = document.getElementById("errorSolCorreo");
    let errorSolDireccion = document.getElementById("errorSolDireccion");
    let errorSolVivienda = document.getElementById("errorSolVivienda");
    let errorSolMotivo = document.getElementById("errorSolMotivo");
    let errorSolVisita = document.getElementById("errorSolVisita");

    let btnEnviarSolicitud = document.getElementById("btnEnviarSolicitud");
    let mensajeSolicitud = document.getElementById("mensajeSolicitud");
    let contenedorSolicitudes = document.getElementById("contenedorSolicitudes");

    function esNumerico(texto) {
        return /^[0-9]+$/.test(texto);
    }

    function validarSolicitud() {

        let nombre = solNombre.value.trim();
        let cedula = solCedula.value.trim();
        let telefono = solTelefono.value.trim();
        let correo = solCorreo.value.trim();
        let direccion = solDireccion.value.trim();
        let vivienda = solVivienda.value;
        let motivo = solMotivo.value.trim();

        let valido = true;

        if (nombre.length < 3) {
            errorSolNombre.textContent = "Ingrese su nombre completo";
            errorSolNombre.style.color = "red";
            valido = false;
        } else {
            errorSolNombre.textContent = "";
        }

        if (cedula.length !== 9 || !esNumerico(cedula)) {
            errorSolCedula.textContent = "La cédula debe tener 9 dígitos";
            errorSolCedula.style.color = "red";
            valido = false;
        } else {
            errorSolCedula.textContent = "";
        }

        if (telefono.length !== 8 || !esNumerico(telefono)) {
            errorSolTelefono.textContent = "El teléfono debe tener 8 dígitos";
            errorSolTelefono.style.color = "red";
            valido = false;
        } else {
            errorSolTelefono.textContent = "";
        }

        if (correo.indexOf("@") === -1 || correo.indexOf(".") === -1) {
            errorSolCorreo.textContent = "Ingrese un correo válido";
            errorSolCorreo.style.color = "red";
            valido = false;
        } else {
            errorSolCorreo.textContent = "";
        }

        if (direccion.length < 10) {
            errorSolDireccion.textContent = "Describa la dirección con más detalle";
            errorSolDireccion.style.color = "red";
            valido = false;
        } else {
            errorSolDireccion.textContent = "";
        }

        if (vivienda === "") {
            errorSolVivienda.textContent = "Seleccione un tipo de vivienda";
            errorSolVivienda.style.color = "red";
            valido = false;
        } else {
            errorSolVivienda.textContent = "";
        }

        if (motivo.length < 20) {
            errorSolMotivo.textContent = "Explique su motivo con al menos 20 caracteres";
            errorSolMotivo.style.color = "red";
            valido = false;
        } else {
            errorSolMotivo.textContent = "";
        }

        if (!solVisita.checked) {
            errorSolVisita.textContent = "Debe aceptar la visita domiciliaria";
            errorSolVisita.style.color = "red";
            valido = false;
        } else {
            errorSolVisita.textContent = "";
        }

        btnEnviarSolicitud.disabled = !valido;

    }

    solNombre.addEventListener("input", validarSolicitud);
    solCedula.addEventListener("input", validarSolicitud);
    solTelefono.addEventListener("input", validarSolicitud);
    solCorreo.addEventListener("input", validarSolicitud);
    solDireccion.addEventListener("input", validarSolicitud);
    solVivienda.addEventListener("change", validarSolicitud);
    solMotivo.addEventListener("input", validarSolicitud);
    solVisita.addEventListener("change", validarSolicitud);

    btnEnviarSolicitud.addEventListener("click", function () {

        let animal = null;

        for (let i = 0; i < animales.length; i++) {
            if (animales[i].id === animalSeleccionadoId) {
                animal = animales[i];
            }
        }

        let hoy = new Date();
        let fecha = hoy.getDate() + "/" + (hoy.getMonth() + 1) + "/" + hoy.getFullYear();

        let tarjeta = document.createElement("div");
        tarjeta.className = "tarjetaSolicitud";

        let titulo = document.createElement("h4");
        titulo.textContent = "Solicitud para " + (animal !== null ? animal.nombre : "");

        let solicitante = document.createElement("p");
        solicitante.textContent = "Solicitante: " + solNombre.value.trim();

        let contacto = document.createElement("p");
        contacto.textContent = "Contacto: " + solTelefono.value.trim() + " / " + solCorreo.value.trim();

        let fechaP = document.createElement("p");
        fechaP.textContent = "Fecha de envío: " + fecha;

        let estadoP = document.createElement("p");
        estadoP.textContent = "Estado: En revisión por el rescatista";

        tarjeta.appendChild(titulo);
        tarjeta.appendChild(solicitante);
        tarjeta.appendChild(contacto);
        tarjeta.appendChild(fechaP);
        tarjeta.appendChild(estadoP);

        contenedorSolicitudes.appendChild(tarjeta);

        solicitudesEnviadas.push({
            animal: animal !== null ? animal.nombre : "",
            solicitante: solNombre.value.trim(),
            fecha: fecha
        });

        mensajeSolicitud.textContent = "¡Solicitud enviada correctamente! El rescatista se pondrá en contacto pronto.";
        mensajeSolicitud.style.color = "green";

        solNombre.value = "";
        solCedula.value = "";
        solTelefono.value = "";
        solCorreo.value = "";
        solDireccion.value = "";
        solVivienda.value = "";
        solMotivo.value = "";
        solOtrasMascotas.checked = false;
        solVisita.checked = false;

        errorSolNombre.textContent = "";
        errorSolCedula.textContent = "";
        errorSolTelefono.textContent = "";
        errorSolCorreo.textContent = "";
        errorSolDireccion.textContent = "";
        errorSolVivienda.textContent = "";
        errorSolMotivo.textContent = "";
        errorSolVisita.textContent = "";

        btnEnviarSolicitud.disabled = true;

        setTimeout(function () {
            mensajeSolicitud.textContent = "";
        }, 3000);

    });

    function poblarEstadisticas() {

        let disponibles = animales.filter(function (animal) {
            return animal.estado === "Disponible";
        });

        document.getElementById("statTotal").textContent = animales.length;
        document.getElementById("statDisponibles").textContent = disponibles.length;
        document.getElementById("statRescatistas").textContent = rescatistas.length;

    }

    poblarSelectRazas();
    poblarSelectProvincias();
    poblarSelectCantones("Todas");
    poblarEstadisticas();
    renderizarAnimales(animales);

});
