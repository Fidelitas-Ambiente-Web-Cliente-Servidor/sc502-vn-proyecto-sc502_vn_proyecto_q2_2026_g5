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
    // OBTENER TODOS LOS USUARIOS
    // =========================================

    public function obtenerTodos()
    {
        $sql = "SELECT
                    u.id_usuario,
                    u.id_organizacion,
                    u.nombre,
                    u.apellido,
                    u.correo,
                    u.telefono,
                    u.rol,
                    u.canton,
                    u.fecha_registro,
                    u.estado,

                    o.nombre AS organizacion_nombre

                FROM usuarios u

                LEFT JOIN organizaciones o
                    ON u.id_organizacion = o.id_organizacion

                ORDER BY u.nombre, u.apellido";


        $consulta = $this->conexion->prepare($sql);

        $consulta->execute();

        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }


    // =========================================
    // OBTENER USUARIO POR ID
    // =========================================

    public function obtenerPorId($id)
    {
        $sql = "SELECT
                    u.id_usuario,
                    u.id_organizacion,
                    u.nombre,
                    u.apellido,
                    u.correo,
                    u.telefono,
                    u.rol,
                    u.canton,
                    u.fecha_registro,
                    u.estado,

                    o.nombre AS organizacion_nombre

                FROM usuarios u

                LEFT JOIN organizaciones o
                    ON u.id_organizacion = o.id_organizacion

                WHERE u.id_usuario = :id";


        $consulta = $this->conexion->prepare($sql);


        $consulta->execute([
            ':id' => $id
        ]);


        return $consulta->fetch(PDO::FETCH_ASSOC);
    }


    // =========================================
    // OBTENER USUARIO POR CORREO
    // Se utiliza para iniciar sesión
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
                    fecha_registro,
                    estado

                FROM usuarios

                WHERE correo = :correo

                LIMIT 1";


        $consulta = $this->conexion->prepare($sql);


        $consulta->execute([
            ':correo' => $correo
        ]);


        return $consulta->fetch(PDO::FETCH_ASSOC);
    }


    // =========================================
    // COMPROBAR SI EL CORREO YA EXISTE
    // =========================================

    public function correoExiste($correo)
    {
        $sql = "SELECT COUNT(*)

                FROM usuarios

                WHERE correo = :correo";


        $consulta = $this->conexion->prepare($sql);


        $consulta->execute([
            ':correo' => $correo
        ]);


        return $consulta->fetchColumn() > 0;
    }


    // =========================================
    // CREAR USUARIO
    // =========================================

    public function crear($datos)
    {
        $sql = "INSERT INTO usuarios
                (
                    id_organizacion,
                    nombre,
                    apellido,
                    correo,
                    contraseña,
                    telefono,
                    rol,
                    canton,
                    estado
                )
                VALUES
                (
                    :id_organizacion,
                    :nombre,
                    :apellido,
                    :correo,
                    :contrasena,
                    :telefono,
                    :rol,
                    :canton,
                    :estado
                )";


        $consulta = $this->conexion->prepare($sql);


        $consulta->execute([
            ':id_organizacion' =>
                $datos['id_organizacion'] ?? null,

            ':nombre' =>
                $datos['nombre'],

            ':apellido' =>
                $datos['apellido'],

            ':correo' =>
                $datos['correo'],

            ':contrasena' =>
                $datos['contraseña'],

            ':telefono' =>
                $datos['telefono'] ?? null,

            ':rol' =>
                $datos['rol'] ?? 'Ciudadano',

            ':canton' =>
                $datos['canton'] ?? null,

            ':estado' =>
                $datos['estado'] ?? 1
        ]);


        return $this->conexion->lastInsertId();
    }


    // =========================================
    // OBTENER USUARIOS DE UNA ORGANIZACIÓN
    // =========================================

    public function obtenerPorOrganizacion($idOrganizacion)
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
                    fecha_registro,
                    estado

                FROM usuarios

                WHERE id_organizacion = :id_organizacion

                ORDER BY nombre, apellido";


        $consulta = $this->conexion->prepare($sql);


        $consulta->execute([
            ':id_organizacion' => $idOrganizacion
        ]);


        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }


    // =========================================
    // ASIGNAR ORGANIZACIÓN A UN USUARIO
    // =========================================

    public function asignarOrganizacion(
        $idUsuario,
        $idOrganizacion
    ) {

        $sql = "UPDATE usuarios

                SET id_organizacion = :id_organizacion

                WHERE id_usuario = :id_usuario";


        $consulta = $this->conexion->prepare($sql);


        return $consulta->execute([
            ':id_usuario' => $idUsuario,
            ':id_organizacion' => $idOrganizacion
        ]);
    }


    // =========================================
    // QUITAR ORGANIZACIÓN
    // =========================================

    public function quitarOrganizacion($idUsuario)
    {
        $sql = "UPDATE usuarios

                SET id_organizacion = NULL

                WHERE id_usuario = :id_usuario";


        $consulta = $this->conexion->prepare($sql);


        return $consulta->execute([
            ':id_usuario' => $idUsuario
        ]);
    }
}