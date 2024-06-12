// Clase Trabajador
class Trabajador {
    constructor(id, nombre, apellido, cargo, departamento) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.cargo = cargo;
        this.departamento = departamento;
    }
}

nombre = document.getElementById("nombre");
apellido = document.getElementById("apellido");
cargo = document.getElementById("cargo");
departamento = document.getElementById("departamento");
btnCrear = document.getElementById("btnCrear");

document.getElementById('btnRegresar').addEventListener('click', function () {
    history.back(); // Regresar a la página anterior en el historial del navegador
});

btnCrear.addEventListener("click", (CrearTrabajador));

function CrearTrabajador() {

    Inputnombre = nombre.value;
    Inputapellido = apellido.value;
    Inputcargo = cargo.value;
    Inputdepartamento = departamento.value;



    if (Inputnombre && Inputapellido && Inputcargo && Inputdepartamento) {
        
        let trabajador = new Trabajador(
            1, // id
            Inputnombre, // nombre
            Inputapellido, // apellido
            Inputcargo, // cargo
            Inputdepartamento // departamento
        );
    
        //console.log(trabajador);

        $.ajax({
            data: trabajador,
            url: "php/insertTrabajador.php",
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