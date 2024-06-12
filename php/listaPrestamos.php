<?php
    include("conexion.php");

    $insertar = "SELECT p.idPrestamo, p.fechaPrestamo, p.idTrabajador, p.idBodeguero, p.cantidadEquipos, p.fechaDevolucionEstimada, pe.idEquipo FROM prestamo p JOIN prestamoequipo pe ON p.idPrestamo = pe.idPrestamo";

    $resultado = mysqli_query($conex, $insertar);

    $data = array();

    if ($resultado->num_rows > 0) {
        while($row = $resultado->fetch_assoc()) {
           $data[] = $row;
        }
    } else {
        $data[] = ["error" => "No se encontraron datos"];
    }

    
    echo json_encode($data);
    
    mysqli_close($conex);
?>