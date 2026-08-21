<?php

// =========================================
// ARRANQUE DE SESIÓN
// =========================================
// Se incluye en cualquier api/*.php que necesite
// saber si hay un usuario logueado (auth.php,
// solicitudes.php, alerta.php, etc.)

if (session_status() === PHP_SESSION_NONE) {

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    session_start();
}


// =========================================
// HELPERS DE SESIÓN
// =========================================

function usuarioLogueado()
{
    return isset($_SESSION['id_usuario']);
}

function usuarioActualId()
{
    return $_SESSION['id_usuario'] ?? null;
}

function requerirSesion()
{
    if (!usuarioLogueado()) {

        http_response_code(401);

        echo json_encode([
            'ok' => false,
            'mensaje' => 'Debes iniciar sesión'
        ]);

        exit;
    }
}
