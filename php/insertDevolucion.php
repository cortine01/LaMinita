<?php
include("conexion.php");

$fechaDevolucion = $_POST['fechaDevolucion'];
$observaciones = $_POST['observaciones'];
$prestamoDevuelto = $_POST['prestamoDevuelto'];

$insertar = "CALL InsertarDevolucion('$fechaDevolucion', 'Bueno', '$observaciones', '$prestamoDevuelto');";

echo $insertar;

$resultado = mysqli_query($conex, $insertar);

if ($resultado) {
    echo "Datos Enviados Correctamente";
} else {
    echo "Error al Enviar los Datos";
}

mysqli_close($conex);
?>