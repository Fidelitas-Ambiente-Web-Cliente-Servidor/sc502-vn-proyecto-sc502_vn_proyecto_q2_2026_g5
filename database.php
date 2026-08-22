<?php

class Database{

    private static $conexion = null;

    public static function conectar(){

        if(self::$conexion == null){

            $server = "db";
            $database = "huellas_a_casa";
            $userDB = "root";
            $passDB = "root";

            self::$conexion = new PDO(
                "mysql:host=$server;dbname=$database;charset=utf8mb4",
                $userDB,
                $passDB
            );

            self::$conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }

        return self::$conexion;
    }
}
