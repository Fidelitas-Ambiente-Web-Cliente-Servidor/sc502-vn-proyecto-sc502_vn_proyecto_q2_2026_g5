<?php

require_once __DIR__ . '/../database.php';

class Reporte
{
    private $conexion;

    public function __construct()
    {
        $this->conexion = Database::conectar();
    }


    // =========================================
    // MIS REPORTES (DEL USUARIO LOGUEADO)
    // =========================================

    public function obtenerPorUsuario($id_usuario)
    {
        $sql = "SELECT
                    id_reporte,
                    id_usuario,
                    tipo,
                    animal,
                    fecha_evento,
                    descripcion,
                    lugar_referencia,
                    foto,
                    fecha_reporte,
                    estado
                FROM reportes
                WHERE id_usuario = :id_usuario
                ORDER BY id_reporte DESC";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id_usuario' => $id_usuario
        ]);

        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }


    // =========================================
    // OBTENER UN REPORTE
    // =========================================

    public function obtenerPorId($id)
    {
        $sql = "SELECT *
                FROM reportes
                WHERE id_reporte = :id";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id' => $id
        ]);

        return $consulta->fetch(PDO::FETCH_ASSOC);
    }


    // =========================================
    // CREAR REPORTE
    // =========================================

    public function crear($datos)
    {
        $sql = "INSERT INTO reportes
                (
                    id_usuario,
                    tipo,
                    animal,
                    fecha_evento,
                    descripcion,
                    lugar_referencia
                )
                VALUES
                (
                    :id_usuario,
                    :tipo,
                    :animal,
                    :fecha_evento,
                    :descripcion,
                    :lugar_referencia
                )";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id_usuario' => $datos['id_usuario'],
            ':tipo' => $datos['tipo'],
            ':animal' => $datos['animal'],
            ':fecha_evento' => $datos['fecha_evento'],
            ':descripcion' => $datos['descripcion'],
            ':lugar_referencia' => $datos['lugar_referencia'] ?? null
        ]);

        return $this->conexion->lastInsertId();
    }


    // =========================================
    // ACTUALIZAR ESTADO
    // =========================================

    public function actualizarEstado($id, $estado)
    {
        $sql = "UPDATE reportes
                SET estado = :estado
                WHERE id_reporte = :id";

        $consulta = $this->conexion->prepare($sql);

        return $consulta->execute([
            ':id' => $id,
            ':estado' => $estado
        ]);
    }


    // =========================================
    // ELIMINAR REPORTE
    // =========================================

    public function eliminar($id)
    {
        $sql = "DELETE FROM reportes
                WHERE id_reporte = :id";

        $consulta = $this->conexion->prepare($sql);

        return $consulta->execute([
            ':id' => $id
        ]);
    }
}
