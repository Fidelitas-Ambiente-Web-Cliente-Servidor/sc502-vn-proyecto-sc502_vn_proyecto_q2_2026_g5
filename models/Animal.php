<?php

require_once __DIR__ . '/../database.php';

class Animal
{
    private $conexion;

    public function __construct()
    {
        $this->conexion = Database::conectar();
    }


    // =========================================
    // OBTENER TODOS LOS ANIMALES
    // =========================================

    public function obtenerTodos()
    {
        $sql = "SELECT
                    id_mascota,
                    id_usuario,
                    nombre,
                    especie,
                    raza,
                    sexo,
                    edad_aproximada,
                    tamano,
                    estado_salud,
                    vacunas,
                    descripcion,
                    foto,
                    estado,
                    fecha_registro
                FROM mascotas
                ORDER BY id_mascota DESC";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute();

        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }


    // =========================================
    // OBTENER ANIMAL
    // =========================================

    public function obtenerPorId($id)
    {
        $sql = "SELECT
                    id_mascota,
                    id_usuario,
                    nombre,
                    especie,
                    raza,
                    sexo,
                    edad_aproximada,
                    tamano,
                    estado_salud,
                    vacunas,
                    descripcion,
                    foto,
                    estado,
                    fecha_registro
                FROM mascotas
                WHERE id_mascota = :id";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id' => $id
        ]);

        return $consulta->fetch(PDO::FETCH_ASSOC);
    }


    // =========================================
    // CREAR ANIMAL
    // =========================================

    public function crear($datos)
    {
        $sql = "INSERT INTO mascotas
                (
                    id_usuario,
                    nombre,
                    especie,
                    raza,
                    sexo,
                    edad_aproximada,
                    tamano,
                    estado_salud,
                    vacunas,
                    descripcion,
                    foto,
                    estado
                )
                VALUES
                (
                    :id_usuario,
                    :nombre,
                    :especie,
                    :raza,
                    :sexo,
                    :edad_aproximada,
                    :tamano,
                    :estado_salud,
                    :vacunas,
                    :descripcion,
                    :foto,
                    :estado
                )";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id_usuario' => $datos['id_usuario'],
            ':nombre' => $datos['nombre'],
            ':especie' => $datos['especie'],
            ':raza' => $datos['raza'] ?? null,
            ':sexo' => $datos['sexo'] ?? null,
            ':edad_aproximada' => $datos['edad_aproximada'] ?? null,
            ':tamano' => $datos['tamano'] ?? null,
            ':estado_salud' => $datos['estado_salud'] ?? null,
            ':vacunas' => $datos['vacunas'] ?? null,
            ':descripcion' => $datos['descripcion'] ?? null,

            // URL de Dog CEO
            ':foto' => $datos['foto'] ?? null,

            ':estado' => $datos['estado'] ?? 'Disponible'
        ]);

        return $this->conexion->lastInsertId();
    }


    // =========================================
    // ACTUALIZAR ANIMAL
    // =========================================

    public function actualizar($id, $datos)
    {
        $campos = [
            'nombre = :nombre',
            'especie = :especie',
            'raza = :raza',
            'sexo = :sexo',
            'edad_aproximada = :edad_aproximada',
            'tamano = :tamano',
            'estado_salud = :estado_salud',
            'vacunas = :vacunas',
            'descripcion = :descripcion',
            'estado = :estado'
        ];

        $parametros = [
            ':id' => $id,
            ':nombre' => $datos['nombre'],
            ':especie' => $datos['especie'],
            ':raza' => $datos['raza'] ?? null,
            ':sexo' => $datos['sexo'] ?? null,
            ':edad_aproximada' => $datos['edad_aproximada'] ?? null,
            ':tamano' => $datos['tamano'] ?? null,
            ':estado_salud' => $datos['estado_salud'] ?? null,
            ':vacunas' => $datos['vacunas'] ?? null,
            ':descripcion' => $datos['descripcion'] ?? null,
            ':estado' => $datos['estado'] ?? 'Disponible'
        ];


        // =========================================
        // ACTUALIZAR FOTO SI VIENE UNA NUEVA
        // =========================================

        if (
            isset($datos['foto']) &&
            $datos['foto'] !== ''
        ) {

            $campos[] = 'foto = :foto';

            $parametros[':foto'] =
                $datos['foto'];
        }


        $sql = "UPDATE mascotas
                SET " .
                implode(', ', $campos) .
                "
                WHERE id_mascota = :id";


        $consulta =
            $this->conexion->prepare($sql);


        return $consulta->execute(
            $parametros
        );
    }


    // =========================================
    // ELIMINAR ANIMAL
    // =========================================

    public function eliminar($id)
    {
        $sql = "DELETE FROM mascotas
                WHERE id_mascota = :id";

        $consulta =
            $this->conexion->prepare($sql);

        return $consulta->execute([
            ':id' => $id
        ]);
    }
}