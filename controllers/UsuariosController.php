<?php

require_once __DIR__ . '/../models/Usuario.php';

class UsuariosController
{
    private $usuarioModel;

    public function __construct()
    {
        $this->usuarioModel =
            new Usuario();
    }


    public function listar()
    {
        return $this->usuarioModel
            ->obtenerTodos();
    }


    public function obtener($id)
    {
        return $this->usuarioModel
            ->obtenerPorId($id);
    }


    public function listarPorOrganizacion(
        $idOrganizacion
    ) {

        return $this->usuarioModel
            ->obtenerPorOrganizacion(
                $idOrganizacion
            );
    }


    public function asignarOrganizacion(
        $idUsuario,
        $idOrganizacion
    ) {

        return $this->usuarioModel
            ->asignarOrganizacion(
                $idUsuario,
                $idOrganizacion
            );
    }


    public function quitarOrganizacion(
        $idUsuario
    ) {

        return $this->usuarioModel
            ->quitarOrganizacion(
                $idUsuario
            );
    }
}