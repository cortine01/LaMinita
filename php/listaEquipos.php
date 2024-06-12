<?php
    include("conexion.php");

    $insertar = "SELECT * FROM equipo";

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