const API = "api/auth.php";

const tabs = document.querySelectorAll(".auth-tab");
const formLogin = document.getElementById("form-login");
const formRegistro = document.getElementById("form-registro");
const mensaje = document.getElementById("mensaje");


// =========================================
// CAMBIAR ENTRE LOGIN Y REGISTRO
// =========================================

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(t => t.classList.remove("activo"));
        tab.classList.add("activo");

        limpiarMensaje();

        if (tab.dataset.tab === "login") {

            formLogin.classList.remove("oculto");
            formRegistro.classList.add("oculto");

        } else {

            formRegistro.classList.remove("oculto");
            formLogin.classList.add("oculto");

        }

    });

});


// =========================================
// MENSAJES
// =========================================

function mostrarMensaje(texto, tipo) {

    mensaje.textContent = texto;
    mensaje.className = "auth-mensaje " + tipo;

}

function limpiarMensaje() {

    mensaje.textContent = "";
    mensaje.className = "auth-mensaje";

}


// =========================================
// LOGIN
// =========================================

formLogin.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    limpiarMensaje();

    const datos = {
        correo: document.getElementById("login-correo").value.trim(),
        contraseña: document.getElementById("login-contraseña").value
    };

    try {

        const respuesta = await fetch(`${API}?accion=login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (!resultado.ok) {

            mostrarMensaje(resultado.mensaje, "error");
            return;

        }

        mostrarMensaje(resultado.mensaje, "exito");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 500);

    } catch (error) {

        mostrarMensaje("No se pudo conectar con el servidor", "error");

    }

});


// =========================================
// REGISTRO
// =========================================

formRegistro.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    limpiarMensaje();

    const datos = {
        nombre: document.getElementById("reg-nombre").value.trim(),
        apellido: document.getElementById("reg-apellido").value.trim(),
        correo: document.getElementById("reg-correo").value.trim(),
        telefono: document.getElementById("reg-telefono").value.trim(),
        canton: document.getElementById("reg-canton").value.trim(),
        contraseña: document.getElementById("reg-contraseña").value
    };

    try {

        const respuesta = await fetch(`${API}?accion=registro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (!resultado.ok) {

            mostrarMensaje(resultado.mensaje, "error");
            return;

        }

        mostrarMensaje(resultado.mensaje, "exito");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 500);

    } catch (error) {

        mostrarMensaje("No se pudo conectar con el servidor", "error");

    }

});
