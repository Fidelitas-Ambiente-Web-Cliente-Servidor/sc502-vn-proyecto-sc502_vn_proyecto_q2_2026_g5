<?php

require_once __DIR__ . '/../models/Adopcion.php';

class AdopcionController
{
    private $adopcionModel;

    public function __construct()
    {
        $this->adopcionModel = new Adopcion();
    }


    public function listarMascotas()
    {
        return $this->adopcionModel->obtenerMascotas();
    }


    public function obtenerMascota($id)
    {
        return $this->adopcionModel->obtenerMascotaPorId($id);
    }


    public function crearSolicitud($datos)
    {
        return $this->adopcionModel->crearSolicitud($datos);
    }


    public function yaSolicito($idMascota, $idUsuario)
    {
        return $this->adopcionModel->yaSolicito(
            $idMascota,
            $idUsuario
        );
    }


    public function misSolicitudes($idUsuario)
    {
        return $this->adopcionModel->obtenerSolicitudesUsuario(
            $idUsuario
        );
    }
}