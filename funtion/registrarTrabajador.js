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

btnCrear.addEventListener("click", CrearTrabajador)

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
    
        console.log(trabajador);
    } else {
        alert("Rellene todos los campos")
    }
}