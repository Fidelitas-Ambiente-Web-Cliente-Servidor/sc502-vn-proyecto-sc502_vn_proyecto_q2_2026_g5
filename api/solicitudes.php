<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../controllers/SolicitudesController.php';

// Todas las acciones de este endpoint requieren sesión iniciada

requerirSesion();

$controller = new SolicitudesController();

$metodo = $_SERVER['REQUEST_METHOD'];

$id_usuario = usuarioActualId();

try {

    // =========================================
    // GET /api/solicitudes.php?tipo=enviadas
    // GET /api/solicitudes.php?tipo=recibidas
    // =========================================

    if ($metodo === 'GET') {

        $tipo = $_GET['tipo'] ?? 'recibidas';

        if ($tipo === 'enviadas') {
            $datos = $controller->enviadas($id_usuario);
        } else {
            $datos = $controller->recibidas($id_usuario);
        }

        echo json_encode([
            'ok' => true,
            'datos' => $datos
        ]);

        exit;
    }


    // =========================================
    // POST
    // Crear una solicitud de adopción
    // =========================================

    if ($metodo === 'POST') {

        $datos = json_decode(
            file_get_contents('php://input'),
            true
        );

        if (empty($datos['id_mascota'])) {

            http_response_code(400);

            echo json_encode([
                'ok' => false,
                'mensaje' => 'El animal es obligatorio'
            ]);

            exit;
        }

        $resultado = $controller->crear(
            $datos['id_mascota'],
            $datos['observaciones'] ?? null,
            $id_usuario
        );

        if (!$resultado['ok']) {
            http_response_code(400);
        } else {
            http_response_code(201);
        }

        echo json_encode($resultado);

        exit;
    }


    // =========================================
    // PUT
    // Aceptar / rechazar una solicitud
    // Body: { id, estado: "Aprobada" | "Rechazada" }
    // =========================================

    if ($metodo === 'PUT') {

        $datos = json_decode(
            file_get_contents('php://input'),
            true
        );

        if (
            !$datos ||
            !isset($datos['id']) ||
            empty($datos['estado'])
        ) {

            http_response_code(400);

            echo json_encode([
                'ok' => false,
                'mensaje' => 'El ID y el estado son obligatorios'
            ]);

            exit;
        }

        $resultado = $controller->actualizarEstado(
            $datos['id'],
            $datos['estado'],
            $id_usuario
        );

        if (!$resultado['ok']) {
            http_response_code(403);
        }

        echo json_encode($resultado);

        exit;
    }


    // =========================================
    // MÉTODO NO PERMITIDO
    // =========================================

    http_response_code(405);

    echo json_encode([
        'ok' => false,
        'mensaje' => 'Método HTTP no permitido'
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
