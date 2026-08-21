<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../controllers/AdopcionController.php';

$controller = new AdopcionController();

$metodo = $_SERVER['REQUEST_METHOD'];


/*
 * Usuario temporal.
 *
 * Después este valor debe venir
 * del usuario autenticado.
 */
$idUsuarioActual = 1;


try {



    if ($metodo === 'GET') {



        if (
            isset($_GET['accion']) &&
            $_GET['accion'] === 'mis-solicitudes'
        ) {

            $solicitudes =
                $controller->misSolicitudes(
                    $idUsuarioActual
                );


            echo json_encode([
                'ok' => true,
                'datos' => $solicitudes
            ]);


            exit;
        }




        if (isset($_GET['id'])) {

            $mascota =
                $controller->obtenerMascota(
                    $_GET['id']
                );


            if (!$mascota) {

                http_response_code(404);

                echo json_encode([
                    'ok' => false,
                    'mensaje' =>
                        'Mascota no encontrada'
                ]);


                exit;
            }


            echo json_encode([
                'ok' => true,
                'datos' => $mascota
            ]);


            exit;
        }



        $mascotas =
            $controller->listarMascotas();


        echo json_encode([
            'ok' => true,
            'datos' => $mascotas
        ]);


        exit;
    }



    if ($metodo === 'POST') {

        $datos = json_decode(
            file_get_contents('php://input'),
            true
        );


        if (
            !$datos ||
            !isset($datos['id_mascota'])
        ) {

            http_response_code(400);

            echo json_encode([
                'ok' => false,
                'mensaje' =>
                    'La mascota es obligatoria'
            ]);


            exit;
        }




        $mascota =
            $controller->obtenerMascota(
                $datos['id_mascota']
            );


        if (!$mascota) {

            http_response_code(404);

            echo json_encode([
                'ok' => false,
                'mensaje' =>
                    'Mascota no encontrada'
            ]);


            exit;
        }



        if (
            $mascota['estado'] !== 'Disponible'
        ) {

            http_response_code(409);

            echo json_encode([
                'ok' => false,
                'mensaje' =>
                    'La mascota ya no está disponible para adopción'
            ]);


            exit;
        }

        $yaSolicito =
            $controller->yaSolicito(
                $datos['id_mascota'],
                $idUsuarioActual
            );


        if ($yaSolicito) {

            http_response_code(409);

            echo json_encode([
                'ok' => false,
                'mensaje' =>
                    'Ya existe una solicitud activa para esta mascota'
            ]);


            exit;
        }


        $observaciones = [];


        if (
            isset($datos['nombre']) &&
            $datos['nombre'] !== ''
        ) {

            $observaciones[] =
                'Nombre: ' . $datos['nombre'];
        }


        if (
            isset($datos['cedula']) &&
            $datos['cedula'] !== ''
        ) {

            $observaciones[] =
                'Cédula: ' . $datos['cedula'];
        }


        if (
            isset($datos['telefono']) &&
            $datos['telefono'] !== ''
        ) {

            $observaciones[] =
                'Teléfono: ' . $datos['telefono'];
        }


        if (
            isset($datos['correo']) &&
            $datos['correo'] !== ''
        ) {

            $observaciones[] =
                'Correo: ' . $datos['correo'];
        }


        if (
            isset($datos['direccion']) &&
            $datos['direccion'] !== ''
        ) {

            $observaciones[] =
                'Dirección: ' . $datos['direccion'];
        }


        if (
            isset($datos['vivienda']) &&
            $datos['vivienda'] !== ''
        ) {

            $observaciones[] =
                'Vivienda: ' . $datos['vivienda'];
        }


        if (
            isset($datos['motivo']) &&
            $datos['motivo'] !== ''
        ) {

            $observaciones[] =
                'Motivo: ' . $datos['motivo'];
        }


        $observaciones[] =
            'Tiene otras mascotas: ' .
            (
                !empty($datos['otras_mascotas'])
                    ? 'Sí'
                    : 'No'
            );


        $observaciones[] =
            'Acepta visita domiciliaria: ' .
            (
                !empty($datos['acepta_visita'])
                    ? 'Sí'
                    : 'No'
            );



        $idSolicitud =
            $controller->crearSolicitud([
                'id_mascota' =>
                    $datos['id_mascota'],

                'id_usuario' =>
                    $idUsuarioActual,

                'observaciones' =>
                    implode(
                        "\n",
                        $observaciones
                    )
            ]);


        http_response_code(201);


        echo json_encode([
            'ok' => true,
            'mensaje' =>
                'Solicitud enviada correctamente',
            'id' =>
                $idSolicitud
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