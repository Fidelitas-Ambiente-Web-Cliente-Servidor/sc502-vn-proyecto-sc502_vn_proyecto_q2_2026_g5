document.addEventListener("DOMContentLoaded", () => {

    // Datos de prueba
    const animales = JSON.parse(localStorage.getItem("animales")) || [];

    const solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];

    document.getElementById("totalAnimales").textContent = animales.length;

    document.getElementById("totalSolicitudes").textContent = solicitudes.length;

    const adoptados = animales.filter(animal => animal.estado === "Adoptado");

    document.getElementById("totalAdoptados").textContent = adoptados.length;

    const pendientes = animales.filter(animal => animal.estado !== "Adoptado");

    document.getElementById("totalPendientes").textContent = pendientes.length;

    const actividad = document.getElementById("actividadLista");

    actividad.innerHTML = "";

    if (animales.length === 0) {

        actividad.innerHTML = "<li>No hay animales registrados.</li>";

    } else {

        animales.slice(-5).reverse().forEach(animal => {

            actividad.innerHTML += `
                <li>
                    🐾 ${animal.nombre} (${animal.estado})
                </li>
            `;

        });

    }

});