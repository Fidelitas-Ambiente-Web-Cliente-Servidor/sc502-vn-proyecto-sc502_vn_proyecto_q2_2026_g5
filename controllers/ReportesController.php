<?php

require_once __DIR__ . '/../models/Reporte.php';

class ReportesController
{
    private $reporteModel;

    public function __construct()
    {
        $this->reporteModel = new Reporte();
    }


    // =========================================
    // MIS REPORTES
    // =========================================

    public function misReportes($id_usuario)
    {
        return $this->reporteModel->obtenerPorUsuario($id_usuario);
    }


    // =========================================
    // CREAR REPORTE
    // =========================================

    public function crear($datos, $id_usuario)
    {
        // El id_usuario SIEMPRE viene de la sesión,
        // nunca del cliente, para evitar que alguien
        // publique un reporte a nombre de otra persona.

        $datos['id_usuario'] = $id_usuario;

        return $this->reporteModel->crear($datos);
    }


    // =========================================
    // ACTUALIZAR ESTADO (solo el dueño del reporte)
    // =========================================

    public function actualizarEstado($id, $estado, $id_usuario)
    {
        $reporte = $this->reporteModel->obtenerPorId($id);

        if (!$reporte) {
            return [
                'ok' => false,
                'mensaje' => 'Reporte no encontrado'
            ];
        }

        if ($reporte['id_usuario'] != $id_usuario) {
            return [
                'ok' => false,
                'mensaje' => 'No tenés permiso para modificar este reporte'
            ];
        }

        $this->reporteModel->actualizarEstado($id, $estado);

        return [
            'ok' => true,
            'mensaje' => 'Reporte actualizado correctamente'
        ];
    }


    // =========================================
    // ELIMINAR (solo el dueño del reporte)
    // =========================================

    public function eliminar($id, $id_usuario)
    {
        $reporte = $this->reporteModel->obtenerPorId($id);

        if (!$reporte) {
            return [
                'ok' => false,
                'mensaje' => 'Reporte no encontrado'
            ];
        }

        if ($reporte['id_usuario'] != $id_usuario) {
            return [
                'ok' => false,
                'mensaje' => 'No tenés permiso para eliminar este reporte'
            ];
        }

        $this->reporteModel->eliminar($id);

        return [
            'ok' => true,
            'mensaje' => 'Reporte eliminado correctamente'
        ];
    }
}
