<?php

require_once __DIR__ . '/../database.php';

class Solicitud
{
    private $conexion;

    public function __construct()
    {
        $this->conexion = Database::conectar();
    }


    // =========================================
    // OBTENER UNA SOLICITUD (con datos de la mascota)
    // =========================================

    public function obtenerPorId($id)
    {
        $sql = "SELECT
                    s.id_solicitud,
                    s.id_mascota,
                    s.id_usuario,
                    s.fecha_solicitud,
                    s.estado,
                    s.observaciones,
                    m.id_usuario AS id_usuario_mascota,
                    m.nombre AS nombre_mascota
                FROM solicitudes_adopcion s
                INNER JOIN mascotas m ON m.id_mascota = s.id_mascota
                WHERE s.id_solicitud = :id";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id' => $id
        ]);

        return $consulta->fetch(PDO::FETCH_ASSOC);
    }


    // =========================================
    // MIS SOLICITUDES ENVIADAS
    // (las que yo hice para adoptar animales)
    // =========================================

    public function obtenerEnviadasPor($id_usuario)
    {
        $sql = "SELECT
                    s.id_solicitud,
                    s.fecha_solicitud,
                    s.estado,
                    s.observaciones,
                    m.id_mascota,
                    m.nombre AS nombre_mascota,
                    m.especie,
                    m.foto
                FROM solicitudes_adopcion s
                INNER JOIN mascotas m ON m.id_mascota = s.id_mascota
                WHERE s.id_usuario = :id_usuario
                ORDER BY s.id_solicitud DESC";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id_usuario' => $id_usuario
        ]);

        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }


    // =========================================
    // SOLICITUDES RECIBIDAS
    // (las que otros usuarios hicieron por
    // animales que YO registré)
    // =========================================

    public function obtenerRecibidasPor($id_usuario)
    {
        $sql = "SELECT
                    s.id_solicitud,
                    s.fecha_solicitud,
                    s.estado,
                    s.observaciones,
                    m.id_mascota,
                    m.nombre AS nombre_mascota,
                    m.especie,
                    m.foto,
                    u.nombre AS solicitante_nombre,
                    u.apellido AS solicitante_apellido,
                    u.correo AS solicitante_correo,
                    u.telefono AS solicitante_telefono
                FROM solicitudes_adopcion s
                INNER JOIN mascotas m ON m.id_mascota = s.id_mascota
                INNER JOIN usuarios u ON u.id_usuario = s.id_usuario
                WHERE m.id_usuario = :id_usuario
                ORDER BY s.id_solicitud DESC";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id_usuario' => $id_usuario
        ]);

        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }


    // =========================================
    // YA EXISTE UNA SOLICITUD PENDIENTE
    // (evita que la misma persona duplique
    // la solicitud por el mismo animal)
    // =========================================

    public function existeSolicitudActiva($id_mascota, $id_usuario)
    {
        $sql = "SELECT id_solicitud
                FROM solicitudes_adopcion
                WHERE id_mascota = :id_mascota
                    AND id_usuario = :id_usuario
                    AND estado IN ('Pendiente', 'En revisión', 'Aprobada')";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id_mascota' => $id_mascota,
            ':id_usuario' => $id_usuario
        ]);

        return $consulta->fetch(PDO::FETCH_ASSOC) !== false;
    }


    // =========================================
    // CREAR SOLICITUD
    // =========================================

    public function crear($id_mascota, $id_usuario, $observaciones)
    {
        $sql = "INSERT INTO solicitudes_adopcion
                (
                    id_mascota,
                    id_usuario,
                    observaciones
                )
                VALUES
                (
                    :id_mascota,
                    :id_usuario,
                    :observaciones
                )";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id_mascota' => $id_mascota,
            ':id_usuario' => $id_usuario,
            ':observaciones' => $observaciones
        ]);

        return $this->conexion->lastInsertId();
    }


    // =========================================
    // ACTUALIZAR ESTADO (aceptar / rechazar)
    // =========================================

    public function actualizarEstado($id, $estado)
    {
        $sql = "UPDATE solicitudes_adopcion
                SET estado = :estado
                WHERE id_solicitud = :id";

        $consulta = $this->conexion->prepare($sql);

        return $consulta->execute([
            ':id' => $id,
            ':estado' => $estado
        ]);
    }


    // =========================================
    // MARCAR MASCOTA COMO ADOPTADA
    // =========================================

    public function marcarMascotaAdoptada($id_mascota)
    {
        $sql = "UPDATE mascotas
                SET estado = 'Adoptado'
                WHERE id_mascota = :id_mascota";

        $consulta = $this->conexion->prepare($sql);

        return $consulta->execute([
            ':id_mascota' => $id_mascota
        ]);
    }
}
