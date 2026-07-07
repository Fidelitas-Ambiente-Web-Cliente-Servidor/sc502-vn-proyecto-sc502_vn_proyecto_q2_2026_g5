document.addEventListener("DOMContentLoaded", function () {

    let tipoInput = document.getElementById("tipo");
    let animalInput = document.getElementById("animal");
    let ubicacionInput = document.getElementById("ubicacion");
    let fechaInput = document.getElementById("fecha");
    let descripcionInput = document.getElementById("descripcion");

    let btnEnviar = document.getElementById("btnEnviar");

    let errorTipo = document.getElementById("errorTipo");
    let errorAnimal = document.getElementById("errorAnimal");
    let errorUbicacion = document.getElementById("errorUbicacion");
    let errorFecha = document.getElementById("errorFecha");
    let errorDescripcion = document.getElementById("errorDescripcion");

    let mensajeExito = document.getElementById("mensajeExito");

    let contenedorAlertas = document.getElementById("contenedorAlertas");

    function validarFormulario() {

        let tipo = tipoInput.value;
        let animal = animalInput.value;
        let ubicacion = ubicacionInput.value;
        let fecha = fechaInput.value;
        let descripcion = descripcionInput.value;

        if (tipo == "") {
            errorTipo.innerText = "Seleccione un tipo";
            errorTipo.style.color = "red";
        }
        else {
            errorTipo.innerText = "";
        }

        if (animal.length < 3) {
            errorAnimal.innerText = "Mínimo 3 caracteres";
            errorAnimal.style.color = "red";
        }
        else {
            errorAnimal.innerText = "";
        }

        if (ubicacion.length < 3) {
            errorUbicacion.innerText = "Ingrese una ubicación";
            errorUbicacion.style.color = "red";
        }
        else {
            errorUbicacion.innerText = "";
        }

        if (fecha == "") {
            errorFecha.innerText = "Seleccione una fecha";
            errorFecha.style.color = "red";
        }
        else {
            errorFecha.innerText = "";
        }

        if (descripcion.length < 10) {
            errorDescripcion.innerText = "Mínimo 10 caracteres";
            errorDescripcion.style.color = "red";
        }
        else {
            errorDescripcion.innerText = "";
        }

        if (
            tipo != "" &&
            animal.length >= 3 &&
            ubicacion.length >= 3 &&
            fecha != "" &&
            descripcion.length >= 10
        ) {

            btnEnviar.disabled = false;

        }
        else {

            btnEnviar.disabled = true;

        }

    }

const elementos = [
    tipoInput,
    animalInput,
    ubicacionInput,
    fechaInput,
    descripcionInput
];

elementos.forEach(function (elemento) {
    elemento.addEventListener("input", validarFormulario);
});


btnEnviar.addEventListener("click", function () {

    const alerta = [
        tipoInput.value,
        animalInput.value,
        ubicacionInput.value,
        fechaInput.value,
        descripcionInput.value
    ];

    const cardBody = document.createElement("div");
    tarjeta.classList.add("alerta");

    const titulo = document.createElement("h3");
    titulo.textContent = alerta[0];

    const animal = document.createElement("p");
    animal.textContent = "Animal";

    const ubicacion = document.createElement("p");
    ubicacion.textContent = "Ubicación";

    const fecha = document.createElement("p");
    fecha.textContent = "Fecha";

    const descripcion = document.createElement("p");
    descripcion.textContent = "Descripción";

    cardBody.appendChild(titulo);
    cardBody.appendChild(animal);
    cardBody.appendChild(ubicacion);
    cardBody.appendChild(fecha);
    cardBody.appendChild(descripcion);

    contenedorAlertas.appendChild(cardBody);

    mensajeExito.innerText = "¡Reporte publicado correctamente!";
    mensajeExito.style.color = "green";

    tipoInput.value = "";
    animalInput.value = "";
    ubicacionInput.value = "";
    fechaInput.value = "";
    descripcionInput.value = "";

    errorTipo.innerText = "";
    errorAnimal.innerText = "";
    errorUbicacion.innerText = "";
    errorFecha.innerText = "";
    errorDescripcion.innerText = "";

    btnEnviar.disabled = true;

    setTimeout(function () {
        mensajeExito.innerText = "";
    }, 2500);

});

});