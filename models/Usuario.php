<?php

require_once __DIR__ . '/../database.php';

class Usuario
{
    private $conexion;

    public function __construct()
    {
        $this->conexion = Database::conectar();
    }


    // =========================================
    // OBTENER USUARIO POR CORREO
    // =========================================

    public function obtenerPorCorreo($correo)
    {
        $sql = "SELECT
                    id_usuario,
                    id_organizacion,
                    nombre,
                    apellido,
                    correo,
                    contraseña,
                    telefono,
                    rol,
                    canton,
                    estado
                FROM usuarios
                WHERE correo = :correo";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':correo' => $correo
        ]);

        return $consulta->fetch(PDO::FETCH_ASSOC);
    }


    // =========================================
    // OBTENER USUARIO POR ID
    // =========================================

    public function obtenerPorId($id)
    {
        $sql = "SELECT
                    id_usuario,
                    id_organizacion,
                    nombre,
                    apellido,
                    correo,
                    telefono,
                    rol,
                    canton,
                    estado
                FROM usuarios
                WHERE id_usuario = :id";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id' => $id
        ]);

        return $consulta->fetch(PDO::FETCH_ASSOC);
    }


    // =========================================
    // CREAR USUARIO (REGISTRO)
    // =========================================

    public function crear($datos)
    {
        $sql = "INSERT INTO usuarios
                (
                    nombre,
                    apellido,
                    correo,
                    contraseña,
                    telefono,
                    rol,
                    canton
                )
                VALUES
                (
                    :nombre,
                    :apellido,
                    :correo,
                    :contrasena,
                    :telefono,
                    :rol,
                    :canton
                )";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':nombre' => $datos['nombre'],
            ':apellido' => $datos['apellido'],
            ':correo' => $datos['correo'],

            // Ya viene hasheada desde el controller
            // (el placeholder va sin ñ a propósito: PDO
            // no soporta bien acentos en nombres de parámetros,
            // aunque la COLUMNA de la tabla sí se llame "contraseña")
            ':contrasena' => $datos['contraseña'],

            ':telefono' => $datos['telefono'] ?? null,
            ':rol' => $datos['rol'] ?? 'Ciudadano',
            ':canton' => $datos['canton'] ?? null
        ]);

        return $this->conexion->lastInsertId();
    }


    // =========================================
    // CORREO YA REGISTRADO
    // =========================================

    public function correoExiste($correo)
    {
        $sql = "SELECT id_usuario
                FROM usuarios
                WHERE correo = :correo";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':correo' => $correo
        ]);

        return $consulta->fetch(PDO::FETCH_ASSOC) !== false;
    }
}
