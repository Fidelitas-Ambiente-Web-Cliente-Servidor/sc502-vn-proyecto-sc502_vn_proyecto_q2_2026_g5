// =========================================
// AUTH GUARD
// =========================================
// Incluir este script en cualquier página que
// requiera sesión iniciada. Si no hay sesión,
// redirige a login.html. Si hay sesión, agrega
// un bloque con el nombre del usuario y un botón
// para cerrar sesión dentro del sidebar.

(async function () {

    try {

        const respuesta = await fetch("api/auth.php?accion=sesion");

        const resultado = await respuesta.json();

        if (!resultado.ok || !resultado.logueado) {

            window.location.href = "login.html";
            return;

        }

        mostrarUsuario(resultado.usuario);

    } catch (error) {

        window.location.href = "login.html";

    }

})();


// =========================================
// MOSTRAR USUARIO EN EL SIDEBAR
// =========================================

function mostrarUsuario(usuario) {

    const sidebar = document.querySelector(".sidebar");

    if (!sidebar) return;

    // Ocultar el enlace "Iniciar sesión"

    const enlaceLogin = sidebar.querySelector('a[href="login.html"]');

    if (enlaceLogin) {

        const item = enlaceLogin.closest("li");

        (item || enlaceLogin).style.display = "none";

    }

    const bloque = document.createElement("div");

    bloque.className = "auth-usuario";

    bloque.innerHTML = `
        <div class="auth-usuario-info">
            <i class="fa-solid fa-circle-user"></i>
            <span>${usuario.nombre} ${usuario.apellido}</span>
        </div>
        <button id="btnCerrarSesion" class="auth-usuario-salir">
            <i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión
        </button>
    `;

    sidebar.appendChild(bloque);

    document
        .getElementById("btnCerrarSesion")
        .addEventListener("click", cerrarSesion);

}


// =========================================
// CERRAR SESIÓN
// =========================================

async function cerrarSesion() {

    try {

        await fetch("api/auth.php?accion=logout", {
            method: "POST"
        });

    } finally {

        window.location.href = "login.html";

    }

}
