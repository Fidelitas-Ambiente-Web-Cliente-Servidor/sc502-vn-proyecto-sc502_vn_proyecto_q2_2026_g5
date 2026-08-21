<?php

require_once __DIR__ . '/../models/Alertas.php';

class AlertaController
{
    private $alertaModel;

    public function __construct()
    {  

        $this->alertaModel = new Alerta();
    }

    public function listar()
    {
        return $this->alertaModel->obtenerTodos();
    }

    public function obtener($id)
    {
        return $this->alertaModel->obtenerPorId($id);
    }

    public function crear($datos)
    {
        return $this->alertaModel->crear($datos);
    }

    public function actualizar($id, $datos)
    {
        return $this->alertaModel->actualizar($id, $datos);
    }

    public function eliminar($id)
    {
        return $this->alertaModel->eliminar($id);
    }
}