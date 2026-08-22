<?php

require_once __DIR__ . '/../models/Solicitud.php';

class SolicitudesController
{
    private $solicitudModel;

    public function __construct()
    {
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