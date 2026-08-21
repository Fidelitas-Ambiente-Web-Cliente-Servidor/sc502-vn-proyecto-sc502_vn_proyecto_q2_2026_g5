<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../controllers/OrganizacionesController.php';

$controller = new OrganizacionesController();

$metodo = $_SERVER['REQUEST_METHOD'];


try {

    // =========================================
    // GET
    // =========================================

    if ($metodo === 'GET') {

        // GET /api/organizaciones.php?id=1

        if (isset($_GET['id'])) {

            $organizacion =
                $controller->obtener(
                    $_GET['id']
                );


            if (!$organizacion) {

                http_response_code(404);

                echo json_encode([
                    'ok' => false,
                    'mensaje' =>
                        'Organización no encontrada'
                ]);

                exit;
            }


            echo json_encode([
                'ok' => true,
                'datos' => $organizacion
            ]);

            exit;
        }


        // LISTAR TODAS

        $organizaciones =
            $controller->listar();


        echo json_encode([
            'ok' => true,
            'datos' => $organizaciones
        ]);

        exit;
    }


    // =========================================
    // POST
    // CREAR ORGANIZACIÓN
    // =========================================

    if ($metodo === 'POST') {

        $datos = json_decode(
            file_get_contents('php://input'),
            true
        );


        if (
            !$datos ||
            empty($datos['nombre']) ||
            empty($datos['tipo'])
        ) {

            http_response_code(400);

            echo json_encode([
                'ok' => false,
                'mensaje' =>
                    'El nombre y el tipo son obligatorios'
            ]);

            exit;
        }


        $tiposPermitidos = [
            'Fundacion',
            'Rescatista',
            'Refugio'
        ];


        if (
            !in_array(
                $datos['tipo'],
                $tiposPermitidos
            )
        ) {

            http_response_code(400);

            echo json_encode([
                'ok' => false,
                'mensaje' =>
                    'El tipo de organización no es válido'
            ]);

            exit;
        }


        $id =
            $controller->crear($datos);


        http_response_code(201);


        echo json_encode([
            'ok' => true,
            'mensaje' =>
                'Organización registrada correctamente',
            'id' => $id
        ]);

        exit;
    }


    // =========================================
    // PUT
    // ACTUALIZAR ORGANIZACIÓN
    // =========================================

    if ($metodo === 'PUT') {

        $datos = json_decode(
            file_get_contents('php://input'),
            true
        );


        if (
            !$datos ||
            !isset($datos['id']) ||
            empty($datos['nombre']) ||
            empty($datos['tipo'])
        ) {

            http_response_code(400);

            echo json_encode([
                'ok' => false,
                'mensaje' =>
                    'El ID, nombre y tipo son obligatorios'
            ]);

            exit;
        }


        $organizacion =
            $controller->obtener(
                $datos['id']
            );


        if (!$organizacion) {

            http_response_code(404);

            echo json_encode([
                'ok' => false,
                'mensaje' =>
                    'Organización no encontrada'
            ]);

            exit;
        }


        $tiposPermitidos = [
            'Fundacion',
            'Rescatista',
            'Refugio'
        ];


        if (
            !in_array(
                $datos['tipo'],
                $tiposPermitidos
            )
        ) {

            http_response_code(400);

            echo json_encode([
                'ok' => false,
                'mensaje' =>
                    'El tipo de organización no es válido'
            ]);

            exit;
        }


        $controller->actualizar(
            $datos['id'],
            $datos
        );


        echo json_encode([
            'ok' => true,
            'mensaje' =>
                'Organización actualizada correctamente'
        ]);

        exit;
    }


    // =========================================
    // MÉTODO NO PERMITIDO
    // =========================================

    http_response_code(405);

    echo json_encode([
        'ok' => false,
        'mensaje' =>
            'Método HTTP no permitido'
    ]);


} catch (Throwable $e) {

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