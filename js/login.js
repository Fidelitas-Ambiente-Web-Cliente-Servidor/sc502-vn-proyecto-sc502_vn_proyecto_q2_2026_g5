const API = "api/auth.php";

const tabs =
    document.querySelectorAll(".auth-tab");

const formLogin =
    document.getElementById("form-login");

const formRegistro =
    document.getElementById("form-registro");

const mensaje =
    document.getElementById("mensaje");


/* =====================================================
   CAMBIAR ENTRE LOGIN Y REGISTRO
===================================================== */

tabs.forEach(function (tab) {

    tab.addEventListener(
        "click",
        function () {

            tabs.forEach(function (t) {

                t.classList.remove(
                    "activo"
                );

            });


            tab.classList.add(
                "activo"
            );


            limpiarMensaje();


            if (
                tab.dataset.tab === "login"
            ) {

                formLogin.classList.remove(
                    "oculto"
                );

                formRegistro.classList.add(
                    "oculto"
                );

            }
            else {

                formRegistro.classList.remove(
                    "oculto"
                );

                formLogin.classList.add(
                    "oculto"
                );

            }

        }
    );

});


/* =====================================================
   MENSAJES
===================================================== */

function mostrarMensaje(
    texto,
    tipo
) {

    mensaje.textContent =
        texto;

    mensaje.className =
        "auth-mensaje " +
        tipo;

}


function limpiarMensaje() {

    mensaje.textContent =
        "";

    mensaje.className =
        "auth-mensaje";

}


/* =====================================================
   CONVERTIR RESPUESTA A JSON
===================================================== */

async function obtenerJSON(
    respuesta
) {

    const texto =
        await respuesta.text();


    console.log(
        "Respuesta del servidor:",
        texto
    );


    let resultado;


    try {

        resultado =
            JSON.parse(texto);

    }
    catch (error) {

        throw new Error(
            "El servidor no devolvió JSON válido. Revise la consola."
        );

    }


    return resultado;

}


/* =====================================================
   LOGIN
===================================================== */

formLogin.addEventListener(
    "submit",
    async function (evento) {

        evento.preventDefault();


        limpiarMensaje();


        const datos = {

            correo:
                document
                    .getElementById(
                        "login-correo"
                    )
                    .value
                    .trim(),

            contraseña:
                document
                    .getElementById(
                        "login-contraseña"
                    )
                    .value

        };


        try {

            const respuesta =
                await fetch(
                    API +
                    "?accion=login",
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
                );


            const resultado =
                await obtenerJSON(
                    respuesta
                );


            console.log(
                "Resultado login:",
                resultado
            );


            if (
                !respuesta.ok ||
                !resultado.ok
            ) {

                mostrarMensaje(
                    resultado.detalle ||
                    resultado.mensaje ||
                    "No fue posible iniciar sesión.",
                    "error"
                );

                return;

            }


            mostrarMensaje(
                resultado.mensaje ||
                "Sesión iniciada correctamente.",
                "exito"
            );


            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                500
            );

        }
        catch (error) {

            console.error(
                "Error Login:",
                error
            );


            mostrarMensaje(
                error.message,
                "error"
            );

        }

    }
);


/* =====================================================
   REGISTRO
===================================================== */

formRegistro.addEventListener(
    "submit",
    async function (evento) {

        evento.preventDefault();


        limpiarMensaje();


        const datos = {

            nombre:
                document
                    .getElementById(
                        "reg-nombre"
                    )
                    .value
                    .trim(),

            apellido:
                document
                    .getElementById(
                        "reg-apellido"
                    )
                    .value
                    .trim(),

            correo:
                document
                    .getElementById(
                        "reg-correo"
                    )
                    .value
                    .trim(),

            telefono:
                document
                    .getElementById(
                        "reg-telefono"
                    )
                    .value
                    .trim(),

            canton:
                document
                    .getElementById(
                        "reg-canton"
                    )
                    .value
                    .trim(),

            contraseña:
                document
                    .getElementById(
                        "reg-contraseña"
                    )
                    .value

        };


        try {

            const respuesta =
                await fetch(
                    API +
                    "?accion=registro",
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
                );


            const resultado =
                await obtenerJSON(
                    respuesta
                );


            console.log(
                "Resultado registro:",
                resultado
            );


            if (
                !respuesta.ok ||
                !resultado.ok
            ) {

                mostrarMensaje(
                    resultado.detalle ||
                    resultado.mensaje ||
                    "No fue posible registrar el usuario.",
                    "error"
                );

                return;

            }


            mostrarMensaje(
                resultado.mensaje ||
                "Usuario registrado correctamente.",
                "exito"
            );


            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                500
            );

        }
        catch (error) {

            console.error(
                "Error Registro:",
                error
            );


            mostrarMensaje(
                error.message,
                "error"
            );

        }

    }
);