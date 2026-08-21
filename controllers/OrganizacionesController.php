<?php

require_once __DIR__ . '/../models/Organizacion.php';

class OrganizacionesController
{
    private $organizacionModel;

    public function __construct()
    {
        $this->organizacionModel = new Organizacion();
    }


    public function listar()
    {
        return $this->organizacionModel->obtenerTodas();
    }


    public function obtener($id)
    {
        return $this->organizacionModel->obtenerPorId($id);
    }


    public function crear($datos)
    {
        return $this->organizacionModel->crear($datos);
    }


    public function actualizar($id, $datos)
    {
        return $this->organizacionModel->actualizar(
            $id,
            $datos
        );
    }
}