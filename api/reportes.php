<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../controllers/ReportesController.php';

// Todas las acciones de este endpoint requieren sesión iniciada

requerirSesion();

$controller = new ReportesController();

$metodo = $_SERVER['REQUEST_METHOD'];

$id_usuario = usuarioActualId();

try {

    // =========================================
    // GET
    // Mis reportes (los del usuario logueado)
    // =========================================

    if ($metodo === 'GET') {

        $reportes = $controller->misReportes($id_usuario);

        echo json_encode([
            'ok' => true,
            'datos' => $reportes
        ]);

        exit;
    }


    // =========================================
    // POST
    // Crear reporte
    // =========================================

    if ($metodo === 'POST') {

        $datos = json_decode(
            file_get_contents('php://input'),
            true
        );

        if (
            empty($datos['tipo']) ||
            empty($datos['animal']) ||
            empty($datos['fecha_evento']) ||
            empty($datos['descripcion'])
        ) {

            http_response_code(400);

            echo json_encode([
                'ok' => false,
                'mensaje' => 'Tipo, animal, fecha y descripción son obligatorios'
            ]);

            exit;
        }

        $id = $controller->crear($datos, $id_usuario);

        http_response_code(201);

        echo json_encode([
            'ok' => true,
            'mensaje' => 'Reporte publicado correctamente',
            'id' => $id
        ]);

        exit;
    }


    // =========================================
    // PUT
    // Actualizar estado (Activo / Resuelto / Cancelado)
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
    // DELETE
    // =========================================

    if ($metodo === 'DELETE') {

        $datos = json_decode(
            file_get_contents('php://input'),
            true
        );

        if (!$datos || !isset($datos['id'])) {

            http_response_code(400);

            echo json_encode([
                'ok' => false,
                'mensaje' => 'El ID del reporte es obligatorio'
            ]);

            exit;
        }

        $resultado = $controller->eliminar(
            $datos['id'],
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
