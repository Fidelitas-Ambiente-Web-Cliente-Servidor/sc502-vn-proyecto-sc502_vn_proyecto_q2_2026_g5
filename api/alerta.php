<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../controllers/AlertaController.php';

$controller = new AlertaController();

$metodo = $_SERVER['REQUEST_METHOD'];

try {

    if ($metodo === 'GET') {

        if (isset($_GET['id'])) {
            $alerta = $controller->obtener($_GET['id']);

            if ($alerta) {
                echo json_encode(['ok' => true, 'datos' => $alerta]);
            } else {
                http_response_code(404);
                echo json_encode(['ok' => false, 'mensaje' => 'Alerta no encontrada']);
            }
        } else {
            $alertas = $controller->listar();
            echo json_encode(['ok' => true, 'datos' => $alertas]);
        }

        exit;
    }


    if ($metodo === 'POST') {

        $datos = json_decode(file_get_contents('php://input'), true);

        if (!isset($datos['id_usuario'])) {
            $datos['id_usuario'] = 1;
        }

        if (
            empty($datos['tipo']) ||
            empty($datos['descripcion']) ||
            !isset($datos['latitud']) ||
            !isset($datos['longitud'])
        ) {
            http_response_code(400);
            echo json_encode([
                'ok' => false,
                'mensaje' => 'El tipo, la descripción y la ubicación en el mapa son obligatorios'
            ]);
            exit;
        }

        if (isset($datos['id']) && $datos['id'] !== '') {
            $id = $datos['id'];
            $alerta = $controller->obtener($id);

            if (!$alerta) {
                http_response_code(404);
                echo json_encode(['ok' => false, 'mensaje' => 'Alerta no encontrada']);
                exit;
            }

            $resultado = $controller->actualizar($id, $datos);
            echo json_encode(['ok' => true, 'mensaje' => 'Alerta actualizada correctamente']);
            exit;

        } else {
            $datos['fecha_reporte'] = isset($datos['fecha_reporte']) ? $datos['fecha_reporte'] : date('Y-m-d');
            $datos['estado'] = isset($datos['estado']) ? $datos['estado'] : 'Activo';
            $datos['foto'] = isset($datos['foto']) ? $datos['foto'] : null;

            $id = $controller->crear($datos);

            http_response_code(201);
            echo json_encode([
                'ok' => true,
                'mensaje' => 'Alerta publicada correctamente',
                'id' => $id
            ]);
            exit;
        }
    }


    if ($metodo === 'PUT') {

        $datos = json_decode(file_get_contents('php://input'), true);

        if (!$datos || !isset($datos['id'])) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'mensaje' => 'El ID de la alerta es obligatorio']);
            exit;
        }

        $alerta = $controller->obtener($datos['id']);

        if (!$alerta) {
            http_response_code(404);
            echo json_encode(['ok' => false, 'mensaje' => 'Alerta no encontrada']);
            exit;
        }

        $controller->actualizar($datos['id'], $datos);

        echo json_encode(['ok' => true, 'mensaje' => 'Alerta actualizada correctamente']);
        exit;
    }


    if ($metodo === 'DELETE') {

        $datos = json_decode(file_get_contents('php://input'), true);

        if (!$datos || !isset($datos['id'])) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'mensaje' => 'El ID de la alerta es obligatorio']);
            exit;
        }

        $alerta = $controller->obtener($datos['id']);

        if (!$alerta) {
            http_response_code(404);
            echo json_encode(['ok' => false, 'mensaje' => 'Alerta no encontrada']);
            exit;
        }

        $controller->eliminar($datos['id']);

        echo json_encode(['ok' => true, 'mensaje' => 'Alerta eliminada correctamente']);
        exit;
    }

    http_response_code(405);
    echo json_encode(['ok' => false, 'mensaje' => 'Método HTTP no permitido']);

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