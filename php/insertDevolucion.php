<?php
include("conexion.php");


$insertar = "";


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