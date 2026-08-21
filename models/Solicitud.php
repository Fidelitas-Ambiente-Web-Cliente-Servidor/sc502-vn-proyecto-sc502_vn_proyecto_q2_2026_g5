<?php

require_once __DIR__ . '/../database.php';

class Solicitud
{
    private $conexion;

    public function __construct()
    {
        $this->conexion = Database::conectar();
    }


    public function obtenerTodas()
    {
        $sql = "SELECT
                    s.id_solicitud,
                    s.id_mascota,
                    s.id_usuario,
                    s.fecha_solicitud,
                    s.estado,
                    s.observaciones,

                    m.nombre AS mascota,
                    m.especie,
                    m.raza,
                    m.foto,
                    m.estado AS estado_mascota,

                    u.nombre AS usuario_nombre,
                    u.apellido AS usuario_apellido,
                    u.correo AS usuario_correo,
                    u.telefono AS usuario_telefono

                FROM solicitudes_adopcion s

                INNER JOIN mascotas m
                    ON s.id_mascota = m.id_mascota

                INNER JOIN usuarios u
                    ON s.id_usuario = u.id_usuario

                ORDER BY s.fecha_solicitud DESC";


        $consulta = $this->conexion->prepare($sql);

        $consulta->execute();

        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }


    public function obtenerPorId($id)
    {
        $sql = "SELECT
                    s.id_solicitud,
                    s.id_mascota,
                    s.id_usuario,
                    s.fecha_solicitud,
                    s.estado,
                    s.observaciones,

                    m.nombre AS mascota,
                    m.especie,
                    m.raza,
                    m.foto,
                    m.estado AS estado_mascota,

                    u.nombre AS usuario_nombre,
                    u.apellido AS usuario_apellido,
                    u.correo AS usuario_correo,
                    u.telefono AS usuario_telefono

                FROM solicitudes_adopcion s

                INNER JOIN mascotas m
                    ON s.id_mascota = m.id_mascota

                INNER JOIN usuarios u
                    ON s.id_usuario = u.id_usuario

                WHERE s.id_solicitud = :id";


        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id' => $id
        ]);

        return $consulta->fetch(PDO::FETCH_ASSOC);
    }



    public function actualizarEstado(
        $id,
        $estado,
        $observaciones = null
    ) {

        $sql = "UPDATE solicitudes_adopcion

                SET
                    estado = :estado,
                    observaciones = :observaciones

                WHERE id_solicitud = :id";


        $consulta = $this->conexion->prepare($sql);


        return $consulta->execute([
            ':id' => $id,
            ':estado' => $estado,
            ':observaciones' => $observaciones
        ]);
    }


    public function completarAdopcion(
        $idSolicitud,
        $idMascota,
        $observaciones = null
    ) {

        try {

            $this->conexion->beginTransaction();


            // Actualizar solicitud

            $sqlSolicitud =
                "UPDATE solicitudes_adopcion

                 SET
                    estado = 'Completada',
                    observaciones = :observaciones

                 WHERE id_solicitud = :id_solicitud";


            $consultaSolicitud =
                $this->conexion->prepare(
                    $sqlSolicitud
                );


            $consultaSolicitud->execute([
                ':id_solicitud' => $idSolicitud,
                ':observaciones' => $observaciones
            ]);


            // Actualizar mascota

            $sqlMascota =
                "UPDATE mascotas

                 SET estado = 'Adoptado'

                 WHERE id_mascota = :id_mascota";


            $consultaMascota =
                $this->conexion->prepare(
                    $sqlMascota
                );


            $consultaMascota->execute([
                ':id_mascota' => $idMascota
            ]);


            // Cancelar otras solicitudes activas
            // de esa misma mascota

            $sqlOtras =
                "UPDATE solicitudes_adopcion

                 SET estado = 'Cancelada'

                 WHERE id_mascota = :id_mascota

                 AND id_solicitud <> :id_solicitud

                 AND estado IN (
                    'Pendiente',
                    'En revisión',
                    'Aprobada'
                 )";


            $consultaOtras =
                $this->conexion->prepare(
                    $sqlOtras
                );


            $consultaOtras->execute([
                ':id_mascota' => $idMascota,
                ':id_solicitud' => $idSolicitud
            ]);


            $this->conexion->commit();


            return true;


        } catch (Exception $e) {

            if (
                $this->conexion->inTransaction()
            ) {

                $this->conexion->rollBack();

            }


            throw $e;
        }
    }


    public function contarTodas()
    {
        $sql = "SELECT COUNT(*)
                FROM solicitudes_adopcion";


        return $this->conexion
            ->query($sql)
            ->fetchColumn();
    }


    public function contarPendientes()
    {
        $sql = "SELECT COUNT(*)

                FROM solicitudes_adopcion

                WHERE estado = 'Pendiente'";


        return $this->conexion
            ->query($sql)
            ->fetchColumn();
    }
}
