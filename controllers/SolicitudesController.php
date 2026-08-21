<?php

require_once __DIR__ . '/../models/Solicitud.php';

class SolicitudesController
{
    private $solicitudModel;

    public function __construct()
    {
        $this->solicitudModel = new Solicitud();
    }


    // =========================================
    // MIS SOLICITUDES ENVIADAS
    // =========================================

    public function enviadas($id_usuario)
    {
        return $this->solicitudModel->obtenerEnviadasPor($id_usuario);
    }


    // =========================================
    // SOLICITUDES RECIBIDAS
    // (para las mascotas que yo registré)
    // =========================================

    public function recibidas($id_usuario)
    {
        return $this->solicitudModel->obtenerRecibidasPor($id_usuario);
    }


    // =========================================
    // CREAR SOLICITUD
    // =========================================

    public function crear($id_mascota, $observaciones, $id_usuario)
    {
        if ($this->solicitudModel->existeSolicitudActiva($id_mascota, $id_usuario)) {

            return [
                'ok' => false,
                'mensaje' => 'Ya tenés una solicitud activa para este animal'
            ];

        }

        $id = $this->solicitudModel->crear(
            $id_mascota,
            $id_usuario,
            $observaciones
        );

        return [
            'ok' => true,
            'mensaje' => 'Solicitud enviada correctamente',
            'id' => $id
        ];
    }


    // =========================================
    // ACTUALIZAR ESTADO
    // Solo el usuario que registró la mascota
    // puede aceptar o rechazar la solicitud
    // =========================================

    public function actualizarEstado($id_solicitud, $estado, $id_usuario)
    {
        $solicitud = $this->solicitudModel->obtenerPorId($id_solicitud);

        if (!$solicitud) {

            return [
                'ok' => false,
                'mensaje' => 'Solicitud no encontrada'
            ];

        }

        if ($solicitud['id_usuario_mascota'] != $id_usuario) {

            return [
                'ok' => false,
                'mensaje' => 'No tenés permiso para gestionar esta solicitud'
            ];

        }

        $this->solicitudModel->actualizarEstado($id_solicitud, $estado);

        // Si se aprueba, la mascota pasa a "Adoptado"

        if ($estado === 'Aprobada') {
            $this->solicitudModel->marcarMascotaAdoptada($solicitud['id_mascota']);
        }

        return [
            'ok' => true,
            'mensaje' => 'Solicitud actualizada correctamente'
        ];
    }
}
        $this->solicitudModel =
            new Solicitud();
    }


    public function listar()
    {
        return $this->solicitudModel
            ->obtenerTodas();
    }


    public function obtener($id)
    {
        return $this->solicitudModel
            ->obtenerPorId($id);
    }


    public function actualizarEstado(
        $id,
        $estado,
        $observaciones = null
    ) {

        $estadosPermitidos = [
            'Pendiente',
            'En revisión',
            'Aprobada',
            'Rechazada',
            'Completada',
            'Cancelada'
        ];


        if (
            !in_array(
                $estado,
                $estadosPermitidos
            )
        ) {

            throw new Exception(
                'El estado de la solicitud no es válido'
            );
        }


        $solicitud =
            $this->solicitudModel
                ->obtenerPorId($id);


        if (!$solicitud) {

            return false;
        }


        $estadoActual =
            $solicitud['estado'];


        if (
            $estado === 'En revisión' &&
            $estadoActual !== 'Pendiente'
        ) {

            throw new Exception(
                'Solo una solicitud pendiente puede pasar a revisión'
            );
        }


        if (
            $estado === 'Aprobada' &&
            $estadoActual !== 'En revisión'
        ) {

            throw new Exception(
                'Solo una solicitud en revisión puede ser aprobada'
            );
        }


        if (
            $estado === 'Completada' &&
            $estadoActual !== 'Aprobada'
        ) {

            throw new Exception(
                'Solo una solicitud aprobada puede completarse'
            );
        }


        if (
            $estado === 'Rechazada' &&
            !in_array(
                $estadoActual,
                [
                    'Pendiente',
                    'En revisión'
                ]
            )
        ) {

            throw new Exception(
                'Esta solicitud ya no puede ser rechazada'
            );
        }



        if (
            $estado === 'Completada'
        ) {

            return $this->solicitudModel
                ->completarAdopcion(
                    $id,
                    $solicitud['id_mascota'],
                    $observaciones
                );
        }


        return $this->solicitudModel
            ->actualizarEstado(
                $id,
                $estado,
                $observaciones
            );
    }


    public function totalSolicitudes()
    {
        return $this->solicitudModel
            ->contarTodas();
    }



    public function totalPendientes()
    {
        return $this->solicitudModel
            ->contarPendientes();
    }
}
