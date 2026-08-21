<?php

require_once __DIR__ . '/../models/Animal.php';

class AnimalesController
{
    private $animalModel;

    public function __construct()
    {
        $this->animalModel = new Animal();
    }

    public function listar()
    {
        return $this->animalModel->obtenerTodos();
    }

    public function obtener($id)
    {
        return $this->animalModel->obtenerPorId($id);
    }


    public function crear($datos)
    {
        return $this->animalModel->crear($datos);
    }


    public function actualizar($id, $datos)
    {
        return $this->animalModel->actualizar($id, $datos);
    }


    public function eliminar($id)
    {
        return $this->animalModel->eliminar($id);
    }
}