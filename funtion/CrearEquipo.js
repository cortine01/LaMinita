// Clase Equipo
class Equipo {
    constructor(id, nombre, descripcion, caracteristicasTecnicas, ubicacionBodega, estado) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.caracteristicasTecnicas = caracteristicasTecnicas;
        this.ubicacionBodega = ubicacionBodega;
        this.estado = estado;
    }
}

nombre = document.getElementById("nombre");
DescripcionEquipos = document.getElementById("DescripcionEquipos");
CaracteristicasEquipos = document.getElementById("CaracteristicasEquipos");
Ubicacion = document.getElementById("Ubicacion");
options = document.getElementById("options");
btnCrear = document.getElementById("btnCrear");

document.getElementById('btnRegresar').addEventListener('click', function () {
    history.back(); // Regresar a la página anterior en el historial del navegador
});

btnCrear.addEventListener("click", (CrearTrabajador));


function CrearTrabajador() {

    
    inputnombre = nombre.value;
    inputDescripcionEquipos = DescripcionEquipos.value;
    inputCaracteristicasEquipos = CaracteristicasEquipos.value;
    inputUbicacion = Ubicacion.value;
    var selectedValue = options.value;

    if (inputnombre && inputDescripcionEquipos && inputCaracteristicasEquipos && inputUbicacion && selectedValue) {
        
        let equipo = new Equipo(
            1,
            inputnombre,
            inputDescripcionEquipos,
            inputCaracteristicasEquipos,
            inputUbicacion,
            selectedValue
        );
    
        //console.log(trabajador);

        $.ajax({
            data: equipo,
            url: "php/insertEquipo.php",
            type: "POST",
  
            beforesend: function(){
  
            },
            success: function(mensaje){
              alert(mensaje);
            },
            error: function(jqXHR, status, error){
              console.log("Fail: " + error.message);
            }});

    } else {
        alert("Rellene todos los campos")
    }
}