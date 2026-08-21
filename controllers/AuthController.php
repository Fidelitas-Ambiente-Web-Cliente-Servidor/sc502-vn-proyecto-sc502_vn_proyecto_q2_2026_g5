<?php

require_once __DIR__ . '/../models/Usuario.php';

class AuthController
{
    private $usuarioModel;

    public function __construct()
    {
        $this->usuarioModel = new Usuario();
    }


    // =========================================
    // LOGIN
    // =========================================

    public function login($correo, $contraseña)
    {
        $usuario = $this->usuarioModel->obtenerPorCorreo($correo);

        if (!$usuario) {
            return [
                'ok' => false,
                'mensaje' => 'Correo o contraseña incorrectos'
            ];
        }

        if (!$usuario['estado']) {
            return [
                'ok' => false,
                'mensaje' => 'Esta cuenta está deshabilitada'
            ];
        }

        if (!password_verify($contraseña, $usuario['contraseña'])) {
            return [
                'ok' => false,
                'mensaje' => 'Correo o contraseña incorrectos'
            ];
        }

        // =====================================
        // GUARDAR SESIÓN
        // =====================================

        $_SESSION['id_usuario'] = $usuario['id_usuario'];
        $_SESSION['nombre'] = $usuario['nombre'];
        $_SESSION['apellido'] = $usuario['apellido'];
        $_SESSION['correo'] = $usuario['correo'];
        $_SESSION['rol'] = $usuario['rol'];

        unset($usuario['contraseña']);

        return [
            'ok' => true,
            'mensaje' => 'Sesión iniciada correctamente',
            'usuario' => $usuario
        ];
    }


    // =========================================
    // REGISTRO
    // =========================================

    public function registrar($datos)
    {
        if (
            empty($datos['nombre']) ||
            empty($datos['apellido']) ||
            empty($datos['correo']) ||
            empty($datos['contraseña'])
        ) {
            return [
                'ok' => false,
                'mensaje' => 'Nombre, apellido, correo y contraseña son obligatorios'
            ];
        }

        if (!filter_var($datos['correo'], FILTER_VALIDATE_EMAIL)) {
            return [
                'ok' => false,
                'mensaje' => 'El correo no es válido'
            ];
        }

        if (strlen($datos['contraseña']) < 6) {
            return [
                'ok' => false,
                'mensaje' => 'La contraseña debe tener al menos 6 caracteres'
            ];
        }

        if ($this->usuarioModel->correoExiste($datos['correo'])) {
            return [
                'ok' => false,
                'mensaje' => 'Ya existe una cuenta con ese correo'
            ];
        }

        // =====================================
        // HASHEAR CONTRASEÑA
        // =====================================

        $datos['contraseña'] = password_hash(
            $datos['contraseña'],
            PASSWORD_DEFAULT
        );

        $id = $this->usuarioModel->crear($datos);

        // =====================================
        // INICIAR SESIÓN AUTOMÁTICAMENTE
        // =====================================

        $_SESSION['id_usuario'] = $id;
        $_SESSION['nombre'] = $datos['nombre'];
        $_SESSION['apellido'] = $datos['apellido'];
        $_SESSION['correo'] = $datos['correo'];
        $_SESSION['rol'] = $datos['rol'] ?? 'Ciudadano';

        return [
            'ok' => true,
            'mensaje' => 'Cuenta creada correctamente',
            'usuario' => [
                'id_usuario' => $id,
                'nombre' => $datos['nombre'],
                'apellido' => $datos['apellido'],
                'correo' => $datos['correo'],
                'rol' => $datos['rol'] ?? 'Ciudadano'
            ]
        ];
    }


    // =========================================
    // LOGOUT
    // =========================================

    public function logout()
    {
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {

            $parametros = session_get_cookie_params();

            setcookie(
                session_name(),
                '',
                time() - 42000,
                $parametros['path'],
                $parametros['domain'],
                $parametros['secure'],
                $parametros['httponly']
            );
        }

        session_destroy();

        return [
            'ok' => true,
            'mensaje' => 'Sesión cerrada correctamente'
        ];
    }


    // =========================================
    // SESIÓN ACTUAL
    // =========================================

    public function sesionActual()
    {
        if (!isset($_SESSION['id_usuario'])) {
            return [
                'ok' => true,
                'logueado' => false
            ];
        }

        return [
            'ok' => true,
            'logueado' => true,
            'usuario' => [
                'id_usuario' => $_SESSION['id_usuario'],
                'nombre' => $_SESSION['nombre'],
                'apellido' => $_SESSION['apellido'],
                'correo' => $_SESSION['correo'],
                'rol' => $_SESSION['rol']
            ]
        ];
    }
}
