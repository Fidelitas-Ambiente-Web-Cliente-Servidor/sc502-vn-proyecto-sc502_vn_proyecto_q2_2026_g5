<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../controllers/AuthController.php';

$controller = new AuthController();

$metodo = $_SERVER['REQUEST_METHOD'];

// La acción llega como ?accion=login|registro|logout|sesion
$accion = $_GET['accion'] ?? '';

try {

    // =========================================
    // GET /api/auth.php?accion=sesion
    // =========================================

    if ($metodo === 'GET' && $accion === 'sesion') {

        echo json_encode(
            $controller->sesionActual()
        );

        exit;
    }


    // =========================================
    // POST /api/auth.php?accion=login
    // =========================================

    if ($metodo === 'POST' && $accion === 'login') {

        $datos = json_decode(
            file_get_contents('php://input'),
            true
        );

        if (
            empty($datos['correo']) ||
            empty($datos['contraseña'])
        ) {

            http_response_code(400);

            echo json_encode([
                'ok' => false,
                'mensaje' => 'Correo y contraseña son obligatorios'
            ]);

            exit;
        }

        $resultado = $controller->login(
            $datos['correo'],
            $datos['contraseña']
        );

        if (!$resultado['ok']) {
            http_response_code(401);
        }

        echo json_encode($resultado);

        exit;
    }


    // =========================================
    // POST /api/auth.php?accion=registro
    // =========================================

    if ($metodo === 'POST' && $accion === 'registro') {

        $datos = json_decode(
            file_get_contents('php://input'),
            true
        );

        $resultado = $controller->registrar($datos);

        if (!$resultado['ok']) {
            http_response_code(400);
        } else {
            http_response_code(201);
        }

        echo json_encode($resultado);

        exit;
    }


    // =========================================
    // POST /api/auth.php?accion=logout
    // =========================================

    if ($metodo === 'POST' && $accion === 'logout') {

        echo json_encode(
            $controller->logout()
        );

        exit;
    }


    // =========================================
    // ACCIÓN NO VÁLIDA
    // =========================================

    http_response_code(400);

    echo json_encode([
        'ok' => false,
        'mensaje' => 'Acción no válida'
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'ok' => false,
        'mensaje' => 'Error interno del servidor',
        'detalle' => $e->getMessage(),
        'archivo' => $e->getFile(),
        'linea' => $e->getLine()
    ]);
}
