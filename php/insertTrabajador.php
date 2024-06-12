<?php
include("conexion.php");

$nombre = $_POST['nombre'];
$apellido = $_POST['apellido'];
$cargo = $_POST['cargo'];
$departamento = $_POST['departamento'];


$insertar = "INSERT INTO trabajador(nombre, apellido, cargo, departamento) VALUES ('$nombre', '$apellido', '$cargo', '$departamento')";

$resultado = mysqli_query($conex, $insertar);

if ($resultado) {
    echo "Datos Enviados Correctamente";
} else {
    echo "Error al Enviar los Datos";
}

mysqli_close($conex);
?>