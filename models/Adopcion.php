<?php

require_once __DIR__ . '/../database.php';

class Adopcion
{
    private $conexion;

    public function __construct()
    {
        $this->conexion = Database::conectar();
    }


    public function obtenerMascotas()
    {
        $sql = "SELECT
                    m.id_mascota,
                    m.id_usuario,
                    m.nombre,
                    m.especie,
                    m.raza,
                    m.sexo,
                    m.edad_aproximada,
                    m.tamano,
                    m.estado_salud,
                    m.vacunas,
                    m.descripcion,
                    m.foto,
                    m.estado,
                    m.fecha_registro,

                    u.nombre AS responsable_nombre,
                    u.apellido AS responsable_apellido,
                    u.correo AS responsable_correo,
                    u.telefono AS responsable_telefono,
                    u.canton AS responsable_canton,
                    u.rol AS responsable_rol,

                    o.id_organizacion,
                    o.nombre AS organizacion_nombre,
                    o.tipo AS organizacion_tipo,
                    o.telefono AS organizacion_telefono,
                    o.correo AS organizacion_correo,
                    o.direccion AS organizacion_direccion,
                    o.canton AS organizacion_canton,
                    o.verificada AS organizacion_verificada

                FROM mascotas m

                INNER JOIN usuarios u
                    ON m.id_usuario = u.id_usuario

                LEFT JOIN organizaciones o
                    ON u.id_organizacion = o.id_organizacion

                WHERE m.estado = 'Disponible'

                ORDER BY m.fecha_registro DESC";


        $consulta = $this->conexion->prepare($sql);

        $consulta->execute();

        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }




    public function obtenerMascotaPorId($id)
    {
        $sql = "SELECT
                    m.id_mascota,
                    m.id_usuario,
                    m.nombre,
                    m.especie,
                    m.raza,
                    m.sexo,
                    m.edad_aproximada,
                    m.tamano,
                    m.estado_salud,
                    m.vacunas,
                    m.descripcion,
                    m.foto,
                    m.estado,
                    m.fecha_registro,

                    u.nombre AS responsable_nombre,
                    u.apellido AS responsable_apellido,
                    u.correo AS responsable_correo,
                    u.telefono AS responsable_telefono,
                    u.canton AS responsable_canton,
                    u.rol AS responsable_rol,

                    o.id_organizacion,
                    o.nombre AS organizacion_nombre,
                    o.tipo AS organizacion_tipo,
                    o.telefono AS organizacion_telefono,
                    o.correo AS organizacion_correo,
                    o.direccion AS organizacion_direccion,
                    o.canton AS organizacion_canton,
                    o.verificada AS organizacion_verificada

                FROM mascotas m

                INNER JOIN usuarios u
                    ON m.id_usuario = u.id_usuario

                LEFT JOIN organizaciones o
                    ON u.id_organizacion = o.id_organizacion

                WHERE m.id_mascota = :id";


        $consulta = $this->conexion->prepare($sql);


        $consulta->execute([
            ':id' => $id
        ]);


        return $consulta->fetch(PDO::FETCH_ASSOC);
    }



    public function crearSolicitud($datos)
    {
        $sql = "INSERT INTO solicitudes_adopcion
                (
                    id_mascota,
                    id_usuario,
                    estado,
                    observaciones
                )
                VALUES
                (
                    :id_mascota,
                    :id_usuario,
                    'Pendiente',
                    :observaciones
                )";


        $consulta = $this->conexion->prepare($sql);


        $consulta->execute([
            ':id_mascota' => $datos['id_mascota'],
            ':id_usuario' => $datos['id_usuario'],
            ':observaciones' => $datos['observaciones'] ?? null
        ]);


        return $this->conexion->lastInsertId();
    }


    public function yaSolicito(
        $idMascota,
        $idUsuario
    ) {

        $sql = "SELECT COUNT(*)

                FROM solicitudes_adopcion

                WHERE id_mascota = :id_mascota
                  AND id_usuario = :id_usuario
                  AND estado IN (
                      'Pendiente',
                      'En revisión',
                      'Aprobada'
                  )";


        $consulta = $this->conexion->prepare($sql);


        $consulta->execute([
            ':id_mascota' => $idMascota,
            ':id_usuario' => $idUsuario
        ]);


        return $consulta->fetchColumn() > 0;
    }


    public function obtenerSolicitudesUsuario($idUsuario)
    {
        $sql = "SELECT
                    s.id_solicitud,
                    s.id_mascota,
                    s.fecha_solicitud,
                    s.estado,
                    s.observaciones,

                    m.nombre AS mascota,
                    m.especie,
                    m.raza,
                    m.foto

                FROM solicitudes_adopcion s

                INNER JOIN mascotas m
                    ON s.id_mascota = m.id_mascota

                WHERE s.id_usuario = :id_usuario

                ORDER BY s.fecha_solicitud DESC";


        $consulta = $this->conexion->prepare($sql);


        $consulta->execute([
            ':id_usuario' => $idUsuario
        ]);


        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }
}