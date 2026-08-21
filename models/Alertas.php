<?php

require_once __DIR__ . '/../database.php';

class Alerta
{
    private $conexion;

    public function __construct()
    {
        $this->conexion = Database::conectar();
    }


    // =========================================
    // OBTENER TODAS LAS ALERTAS
    // =========================================

    public function obtenerTodos()
    {
        $sql = "SELECT 
                    id_reporte, 
                    id_usuario,
                    tipo,
                    descripcion,
                    latitud,
                    longitud,
                    lugar_referencia,
                    foto,
                    estado,
                    fecha_reporte
                FROM reportes
                ORDER BY id_reporte DESC";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute();

        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }


    // =========================================
    // OBTENER ALERTA
    // =========================================

    public function obtenerPorId($id)
    {
        $sql = "SELECT
                    id_reporte,
                    id_usuario,
                    tipo,
                    descripcion,
                    latitud,
                    longitud,
                    lugar_referencia,
                    foto,
                    estado,
                    fecha_reporte
                FROM reportes
                WHERE id_reporte = :id";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id' => $id
        ]);

        return $consulta->fetch(PDO::FETCH_ASSOC);
    }


    // =========================================
    // CREAR ALERTA
    // =========================================

    public function crear($datos)
    {
        $sql = "INSERT INTO reportes
                (
                    id_usuario,
                    tipo,
                    descripcion,
                    latitud,
                    longitud,
                    lugar_referencia,
                    foto,
                    estado
                )
                VALUES
                (
                    :id_usuario,
                    :tipo,
                    :descripcion,
                    :latitud,
                    :longitud,
                    :lugar_referencia,
                    :foto,
                    :estado
                )";

        

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id_usuario' => $datos['id_usuario'],
            ':tipo' => $datos['tipo'],
            ':descripcion' => $datos['descripcion'] ?? null,
            ':latitud' => $datos['latitud'],
            ':longitud' => $datos['longitud'],
            ':lugar_referencia' => $datos['lugar_referencia'] ?? null,
            ':foto' => $datos['foto'] ?? null,
            ':estado' => $datos['estado'] ?? 'Activo'
        ]);

        return $this->conexion->lastInsertId();
    }


    // =========================================
    // ACTUALIZAR ALERTA
    // =========================================

    public function actualizar($id, $datos)
    {
        $campos = [
            'tipo = :tipo',
            'descripcion = :descripcion',
            'latitud = :latitud',
            'longitud = :longitud',
            'lugar_referencia = :lugar_referencia',
            'estado = :estado'
        ];

        $parametros = [
            ':id' => $id,
            ':tipo' => $datos['tipo'],
            ':descripcion' => $datos['descripcion'] ?? null,
            ':latitud' => $datos['latitud'] ?? null,
            ':longitud' => $datos['longitud'] ?? null,
            ':lugar_referencia' => $datos['lugar_referencia'] ?? null,
            ':estado' => $datos['estado'] ?? 'Activo'
        ];

        if (
            isset($datos['foto']) &&
            $datos['foto'] !== ''
        ) {
            $campos[] = 'foto = :foto';
            $parametros[':foto'] = $datos['foto'];
        }

        $sql = "UPDATE reportes
                SET " . 
                implode(', ', $campos) . 
                "
                WHERE id_reporte = :id";

        $consulta = $this->conexion->prepare($sql);

        return $consulta->execute($parametros);
    }


    // =========================================
    // ELIMINAR ALERTA
    // =========================================

    public function eliminar($id)
    {
        $sql = "DELETE FROM reportes WHERE id_reporte = :id";

        $consulta = $this->conexion->prepare($sql);

        return $consulta->execute([
            ':id' => $id
        ]);
    }
}