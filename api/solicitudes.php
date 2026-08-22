<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../controllers/SolicitudesController.php';

$controller = new SolicitudesController();

$metodo = $_SERVER['REQUEST_METHOD'];


try {

    // =========================================
    // GET
    // =========================================

    if ($metodo === 'GET') {


        // -------------------------------------
        // ESTADÍSTICAS
        // -------------------------------------

        if (
            isset($_GET['accion']) &&
            $_GET['accion'] === 'estadisticas'
        ) {

            echo json_encode([
                'ok' => true,
                'datos' => [
                    'total' =>
                        (int) $controller->totalSolicitudes(),

                    'pendientes' =>
                        (int) $controller->totalPendientes()
                ]
            ]);

            exit;
        }


        // -------------------------------------
        // OBTENER POR ID
        // -------------------------------------

        if (isset($_GET['id'])) {

            $solicitud =
                $controller->obtener(
                    $_GET['id']
                );


            if (!$solicitud) {

                http_response_code(404);

                echo json_encode([
                    'ok' => false,
                    'mensaje' =>
                        'Solicitud no encontrada'
                ]);

                exit;
            }


            echo json_encode([
                'ok' => true,
                'datos' => $solicitud
            ]);

            exit;
        }



        $solicitudes =
            $controller->listar();


        echo json_encode([
            'ok' => true,
            'datos' => $solicitudes
        ]);

        exit;
    }


    if ($metodo === 'PUT') {

        $datos = json_decode(
            file_get_contents('php://input'),
            true
        );


        if (
            !$datos ||
            !isset($datos['id']) ||
            !isset($datos['estado'])
        ) {

            http_response_code(400);

            echo json_encode([
                'ok' => false,
                'mensaje' =>
                    'El ID y el estado son obligatorios'
            ]);

            exit;
        }


        $solicitud =
            $controller->obtener(
                $datos['id']
            );


        if (!$solicitud) {

            http_response_code(404);

            echo json_encode([
                'ok' => false,
                'mensaje' =>
                    'Solicitud no encontrada'
            ]);

            exit;
        }


        $observaciones =
            $datos['observaciones'] ?? null;


        $resultado =
            $controller->actualizarEstado(
                $datos['id'],
                $datos['estado'],
                $observaciones
            );


        if (!$resultado) {

            http_response_code(500);

            echo json_encode([
                'ok' => false,
                'mensaje' =>
                    'No se pudo actualizar la solicitud'
            ]);

            exit;
        }


        echo json_encode([
            'ok' => true,
            'mensaje' =>
                'Solicitud actualizada correctamente'
        ]);

        exit;
    }



    http_response_code(405);

    echo json_encode([
        'ok' => false,
        'mensaje' =>
            'Método HTTP no permitido'
    ]);


} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'ok' => false,
        'mensaje' =>
            'Error interno del servidor',

        'detalle' =>
            $e->getMessage(),

        'archivo' =>
            $e->getFile(),

        'linea' =>
            $e->getLine()
    ]);
}