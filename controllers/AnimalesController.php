<?php

require_once __DIR__ . '/../models/Animal.php';

class AnimalesController
{
    private $animalModel;

    public function __construct()
    {
        $this->animalModel = new Animal();
    }


    // =========================================
    // LISTAR ANIMALES
    // =========================================

    public function listar()
    {
        return $this->animalModel->obtenerTodos();
    }


    // =========================================
    // OBTENER ANIMAL
    // =========================================

    public function obtener($id)
    {
        return $this->animalModel->obtenerPorId($id);
    }


    // =========================================
    // CREAR ANIMAL
    // =========================================

    public function crear($datos)
    {
        return $this->animalModel->crear($datos);
    }


    // =========================================
    // ACTUALIZAR ANIMAL
    // =========================================

    public function actualizar($id, $datos)
    {
        return $this->animalModel->actualizar($id, $datos);
    }


    // =========================================
    // ELIMINAR ANIMAL
    // =========================================

    public function eliminar($id)
    {
        return $this->animalModel->eliminar($id);
    }
}