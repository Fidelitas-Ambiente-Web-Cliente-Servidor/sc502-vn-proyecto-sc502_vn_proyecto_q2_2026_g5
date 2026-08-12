<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../controllers/AnimalesController.php';

$controller = new AnimalesController();

$metodo = $_SERVER['REQUEST_METHOD'];

try {

    // =========================================
    // GET
    // =========================================

    if ($metodo === 'GET') {

        // GET /api/animales.php?id=1

        if (isset($_GET['id'])) {

            $animal = $controller->obtener($_GET['id']);

            if ($animal) {

                echo json_encode([
                    'ok' => true,
                    'datos' => $animal
                ]);

            } else {

                http_response_code(404);

                echo json_encode([
                    'ok' => false,
                    'mensaje' => 'Animal no encontrado'
                ]);
            }

        } else {

            $animales = $controller->listar();

            echo json_encode([
                'ok' => true,
                'datos' => $animales
            ]);
        }

        exit;
    }


    // =========================================
    // POST
    // CREAR / ACTUALIZAR
    // =========================================

    if ($metodo === 'POST') {

        $datos = json_decode(
            file_get_contents('php://input'),
            true
    );


        // =====================================
        // USUARIO
        // =====================================

        if (!isset($datos['id_usuario'])) {

            $datos['id_usuario'] = 1;

        }


        // =====================================
        // VALIDAR DATOS
        // =====================================

        if (
            empty($datos['nombre']) ||
            empty($datos['especie'])
        ) {

            http_response_code(400);

            echo json_encode([
                'ok' => false,
                'mensaje' => 'El nombre y la especie son obligatorios'
            ]);

            exit;
        }

        // =====================================
        // ACTUALIZAR
        // =====================================

        if (
            isset($datos['id']) &&
            $datos['id'] !== ''
        ) {

            $id = $datos['id'];


            $animal = $controller->obtener($id);


            if (!$animal) {

                http_response_code(404);

                echo json_encode([
                    'ok' => false,
                    'mensaje' => 'Animal no encontrado'
                ]);

                exit;
            }


            $controller->actualizar(
                $id,
                $datos
            );


            echo json_encode([
                'ok' => true,
                'mensaje' => 'Animal actualizado correctamente'
            ]);

            exit;
        }


        // =====================================
        // CREAR
        // =====================================

        $id = $controller->crear($datos);


        http_response_code(201);

        echo json_encode([
            'ok' => true,
            'mensaje' => 'Animal registrado correctamente',
            'id' => $id
        ]);

        exit;
    }


    // =========================================
    // PUT
    // =========================================

    if ($metodo === 'PUT') {

        $datos = json_decode(
            file_get_contents('php://input'),
            true
        );


        if (
            !$datos ||
            !isset($datos['id'])
        ) {

            http_response_code(400);

            echo json_encode([
                'ok' => false,
                'mensaje' => 'El ID del animal es obligatorio'
            ]);

            exit;
        }


        $animal = $controller->obtener(
            $datos['id']
        );


        if (!$animal) {

            http_response_code(404);

            echo json_encode([
                'ok' => false,
                'mensaje' => 'Animal no encontrado'
            ]);

            exit;
        }


        $controller->actualizar(
            $datos['id'],
            $datos
        );


        echo json_encode([
            'ok' => true,
            'mensaje' => 'Animal actualizado correctamente'
        ]);

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


        if (
            !$datos ||
            !isset($datos['id'])
        ) {

            http_response_code(400);

            echo json_encode([
                'ok' => false,
                'mensaje' => 'El ID del animal es obligatorio'
            ]);

            exit;
        }


        $animal = $controller->obtener(
            $datos['id']
        );


        if (!$animal) {

            http_response_code(404);

            echo json_encode([
                'ok' => false,
                'mensaje' => 'Animal no encontrado'
            ]);

            exit;
        }


        $controller->eliminar(
            $datos['id']
        );


        echo json_encode([
            'ok' => true,
            'mensaje' => 'Animal eliminado correctamente'
        ]);

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