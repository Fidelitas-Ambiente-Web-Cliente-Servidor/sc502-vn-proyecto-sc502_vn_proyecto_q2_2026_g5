<?php

require_once __DIR__ . '/../database.php';

class Organizacion
{
    private $conexion;

    public function __construct()
    {
        $this->conexion = Database::conectar();
    }



    public function obtenerPorId($id)
    {
        $sql = "SELECT
                    id_organizacion,
                    nombre,
                    tipo,
                    telefono,
                    correo,
                    direccion,
                    canton,
                    verificada,
                    fecha_registro
                FROM organizaciones
                WHERE id_organizacion = :id";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id' => $id
        ]);

        return $consulta->fetch(PDO::FETCH_ASSOC);
    }



    public function obtenerTodas()
    {
        $sql = "SELECT
                    id_organizacion,
                    nombre,
                    tipo,
                    telefono,
                    correo,
                    direccion,
                    canton,
                    verificada,
                    fecha_registro
                FROM organizaciones
                ORDER BY id_organizacion DESC";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute();

        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }



    public function crear($datos)
    {
        $sql = "INSERT INTO organizaciones
                (
                    nombre,
                    tipo,
                    telefono,
                    correo,
                    direccion,
                    canton,
                    verificada
                )
                VALUES
                (
                    :nombre,
                    :tipo,
                    :telefono,
                    :correo,
                    :direccion,
                    :canton,
                    :verificada
                )";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':nombre' => $datos['nombre'],
            ':tipo' => $datos['tipo'],
            ':telefono' => $datos['telefono'] ?? null,
            ':correo' => $datos['correo'] ?? null,
            ':direccion' => $datos['direccion'] ?? null,
            ':canton' => $datos['canton'] ?? null,
            ':verificada' => $datos['verificada'] ?? 0
        ]);

        return $this->conexion->lastInsertId();
    }



    public function actualizar($id, $datos)
    {
        $sql = "UPDATE organizaciones
                SET
                    nombre = :nombre,
                    tipo = :tipo,
                    telefono = :telefono,
                    correo = :correo,
                    direccion = :direccion,
                    canton = :canton
                WHERE id_organizacion = :id";

        $consulta = $this->conexion->prepare($sql);

        return $consulta->execute([
            ':id' => $id,
            ':nombre' => $datos['nombre'],
            ':tipo' => $datos['tipo'],
            ':telefono' => $datos['telefono'] ?? null,
            ':correo' => $datos['correo'] ?? null,
            ':direccion' => $datos['direccion'] ?? null,
            ':canton' => $datos['canton'] ?? null
        ]);
    }
}