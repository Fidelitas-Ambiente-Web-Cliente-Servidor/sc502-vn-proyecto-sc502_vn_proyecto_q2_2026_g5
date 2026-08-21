// =========================================
// UI DE SESIÓN (PÁGINAS PÚBLICAS)
// =========================================
// A diferencia de auth-guard.js, este script NO
// redirige si no hay sesión (se usa en páginas que
// cualquier visitante puede ver, como index.html,
// adopcion.html, animales.html o educacion.html).
//
// Si hay una sesión activa:
//   - oculta el enlace "Iniciar sesión" del sidebar
//   - agrega al final del sidebar el nombre, apellido
//     y el botón "Cerrar sesión" del usuario
//
// Si no hay sesión, deja el sidebar tal cual (con el
// enlace "Iniciar sesión" visible).

(async function () {

    try {

        const respuesta = await fetch("api/auth.php?accion=sesion");

        const resultado = await respuesta.json();

        if (resultado.ok && resultado.logueado) {

            aplicarSesionEnSidebar(resultado.usuario);

        }

    } catch (error) {

        // Sin conexión con el servidor: se deja el sidebar sin cambios

    }

})();


// =========================================
// APLICAR SESIÓN EN EL SIDEBAR
// =========================================

function aplicarSesionEnSidebar(usuario) {

    const sidebar = document.querySelector(".sidebar");

    if (!sidebar) return;

    // Ocultar el enlace "Iniciar sesión"

    const enlaceLogin = sidebar.querySelector('a[href="login.html"]');

    if (enlaceLogin) {

        const item = enlaceLogin.closest("li");

        (item || enlaceLogin).style.display = "none";

    }

    // Evitar duplicar el bloque de usuario

    if (sidebar.querySelector(".auth-usuario")) return;

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
        .addEventListener("click", cerrarSesionYRedirigir);

}


// =========================================
// CERRAR SESIÓN
// =========================================

async function cerrarSesionYRedirigir() {

    try {

        await fetch("api/auth.php?accion=logout", {
            method: "POST"
        });

    } finally {

        window.location.href = "login.html";

    }

}
