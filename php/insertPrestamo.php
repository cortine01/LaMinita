<?php

// Clase Equipo
class Equipo {
    public $id;
    public $nombre;
    public $descripcion;
    public $caracteristicasTecnicas;
    public $ubicacionBodega;
    public $estado;

    public function __construct($id, $nombre, $descripcion, $caracteristicasTecnicas, $ubicacionBodega, $estado) {
        $this->id = $id;
        $this->nombre = $nombre;
        $this->descripcion = $descripcion;
        $this->caracteristicasTecnicas = $caracteristicasTecnicas;
        $this->ubicacionBodega = $ubicacionBodega;
        $this->estado = $estado;
    }
}

include("conexion.php");


$fechaPrestamo = $_POST['fechaPrestamo'];
$trabajadorSolicitante = $_POST['trabajadorSolicitante'];
$fechaDevolucionEstimada = $_POST['fechaDevolucionEstimada'];

$equipoPrestadoJson = $_POST['equipoPrestado'];
$equipoPrestadoArray = json_decode($equipoPrestadoJson, true);

$equipoPrestado = [];
foreach ($equipoPrestadoArray as $equipoData) {
    $equipoPrestado[] = new Equipo(
        $equipoData['id'],
        $equipoData['nombre'],
        $equipoData['descripcion'],
        $equipoData['caracteristicasTecnicas'],
        $equipoData['ubicacionBodega'],
        $equipoData['estado']
    );
}


$values = [];
foreach ($equipoPrestado as $equipo) {
    $values[] = "({$equipo->id})";
    }
    
$valuesString = implode(", ", $values);
$cantidadEquipos = count($equipoPrestado);

$insertar = "CREATE TEMPORARY TABLE IF NOT EXISTS TempPrestamoEquipos (idEquipo INT);
INSERT INTO TempPrestamoEquipos (idEquipo) VALUES $valuesString;
CALL InsertarPrestamo('$fechaPrestamo', '$trabajadorSolicitante', 2, '$cantidadEquipos', '$fechaDevolucionEstimada');
TRUNCATE TABLE TempPrestamoEquipos;
DROP TEMPORARY TABLE IF EXISTS TempPrestamoEquipos;
";

//echo $insertar;

if (mysqli_multi_query($conex, $insertar)) {
    do {
        // Store first result set
        if ($result = mysqli_store_result($conex)) {
            mysqli_free_result($result);
        }
        // If there are more results, continue to the next query
    } while (mysqli_next_result($conex));
    echo "Prestamo Creado Correctamente";
} else {
    echo "Error al Crear el Prestamo: " . mysqli_error($conex);
}

mysqli_close($conex);
?>