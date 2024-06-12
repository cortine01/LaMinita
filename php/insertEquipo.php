<?php
include("conexion.php");

$nombre = $_POST["nombre"];
$descripcion = $_POST["descripcion"];
$caracteristicasTecnicas = $_POST["caracteristicasTecnicas"];
$ubicacionBodega = $_POST["ubicacionBodega"];
$estado = $_POST["estado"];


$insertar = "INSERT INTO equipo(nombre, descripcion, caracteristicasTecnicas, ubicacionBodega, estado) VALUES ('$nombre', '$descripcion', '$caracteristicasTecnicas', '$ubicacionBodega', '$estado')";

$resultado = mysqli_query($conex, $insertar);

if ($resultado) {
    echo "Datos Enviados Correctamente";
} else {
    echo "Error al Enviar los Datos";
}

mysqli_close($conex);
?>