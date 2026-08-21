<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../controllers/UsuariosController.php';

$controller =
    new UsuariosController();

$metodo =
    $_SERVER['REQUEST_METHOD'];


try {

    // =========================================
    // GET
    // =========================================

    if ($metodo === 'GET') {


        // USUARIOS POR ORGANIZACIÓN

        if (
            isset($_GET['id_organizacion'])
        ) {

            $usuarios =
                $controller
                    ->listarPorOrganizacion(
                        $_GET['id_organizacion']
                    );


            echo json_encode([
                'ok' => true,
                'datos' => $usuarios
            ]);


            exit;
        }


        // USUARIO POR ID

        if (
            isset($_GET['id'])
        ) {

            $usuario =
                $controller->obtener(
                    $_GET['id']
                );


            if (!$usuario) {

                http_response_code(404);


                echo json_encode([
                    'ok' => false,
                    'mensaje' =>
                        'Usuario no encontrado'
                ]);


                exit;
            }


            echo json_encode([
                'ok' => true,
                'datos' => $usuario
            ]);


            exit;
        }


        // TODOS

        $usuarios =
            $controller->listar();


        echo json_encode([
            'ok' => true,
            'datos' => $usuarios
        ]);


        exit;
    }


    // =========================================
    // PUT
    // ASIGNAR / QUITAR ORGANIZACIÓN
    // =========================================

    if ($metodo === 'PUT') {

        $datos = json_decode(
            file_get_contents('php://input'),
            true
        );


        if (
            !$datos ||
            !isset($datos['id_usuario'])
        ) {

            http_response_code(400);


            echo json_encode([
                'ok' => false,
                'mensaje' =>
                    'El ID del usuario es obligatorio'
            ]);


            exit;
        }


        $usuario =
            $controller->obtener(
                $datos['id_usuario']
            );


        if (!$usuario) {

            http_response_code(404);


            echo json_encode([
                'ok' => false,
                'mensaje' =>
                    'Usuario no encontrado'
            ]);


            exit;
        }


        // QUITAR ORGANIZACIÓN

        if (
            !isset($datos['id_organizacion']) ||
            $datos['id_organizacion'] === null ||
            $datos['id_organizacion'] === ''
        ) {

            $controller
                ->quitarOrganizacion(
                    $datos['id_usuario']
                );


            echo json_encode([
                'ok' => true,
                'mensaje' =>
                    'Usuario removido de la organización'
            ]);


            exit;
        }


        // ASIGNAR ORGANIZACIÓN

        $controller
            ->asignarOrganizacion(
                $datos['id_usuario'],
                $datos['id_organizacion']
            );


        echo json_encode([
            'ok' => true,
            'mensaje' =>
                'Usuario asociado correctamente'
        ]);


        exit;
    }


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