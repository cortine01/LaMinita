
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

// Clase Prestamo
class Prestamo {
    constructor(id, fechaPrestamo, trabajadorSolicitante, fechaDevolucionEstimada, equipoPrestado) {
        this.id = id;
        this.fechaPrestamo = fechaPrestamo;
        this.trabajadorSolicitante = trabajadorSolicitante;
        this.fechaDevolucionEstimada = fechaDevolucionEstimada;
        this.equipoPrestado = equipoPrestado;
    }
}


// Llamar a la función para crear los trabajadores de ejemplo

equiposDisponibles = document.getElementById("equiposDisponibles");
cajaBuscador = document.getElementById("cajaBuscador");

trabajadorPrestar = document.getElementById("trabajadorPrestar");
cajaPrestar = document.getElementById("cajaBorrarSeleccionado");

cajaTrabajador = document.getElementById("cajaTrabajador");

// Lista para almacenar los trabajadores
let listaTrabajadores = [];

let idTrabajadorSeleccionado;

let listaEquipos = [];
// Llamada para crear los equipos de ejemplo y luego agregar el contenido
crearEquiposEjemplo(listaEquipos).then(() => {

    crearTrabajadoresEjemplo(listaTrabajadores).then(() => {
        agregarContenidoEquiposDisponibles(listaEquipos, cajaBuscador);
        agregarContenidoTrabajadores(listaTrabajadores, cajaTrabajador);
    });

});


document.getElementById("equiposDisponibles").addEventListener("keyup", () => buscadorEquiposDisponibles(equiposDisponibles, cajaBuscador));
document.getElementById("trabajadorPrestar").addEventListener("keyup", () => buscadorEquiposDisponibles(trabajadorPrestar, cajaTrabajador));

document.getElementById("btnRegistrarDisponble").addEventListener("click", () => agregarSeleccionados(listaEquipos, verAndEliminarSeleccionados(cajaBuscador), cajaPrestar));
document.getElementById("btnBorrarDisponble").addEventListener("click", () => agregarSeleccionados(listaEquipos, verAndEliminarSeleccionados(cajaPrestar), cajaBuscador));

document.getElementById("cajaTrabajador").addEventListener("click", () => {
    for (let i = 0; i < listaTrabajadores.length; i++) {
        if (listaTrabajadores[i].id == verSeleccionados(cajaTrabajador)) {
            const element = listaTrabajadores[i];
            idTrabajadorSeleccionado = element.id;
            document.querySelector('#tablaPrestarTrabajador tbody td:nth-child(1)').textContent = element.nombre;
            document.querySelector('#tablaPrestarTrabajador tbody td:nth-child(2)').textContent = element.apellido;
            document.querySelector('#tablaPrestarTrabajador tbody td:nth-child(3)').textContent = element.cargo;
            document.querySelector('#tablaPrestarTrabajador tbody td:nth-child(4)').textContent = element.departamento;
        }
    }
});

document.getElementById("btnCrearPrestamo").addEventListener("click", CrearPrestamo);



function agregarContenidoEquiposDisponibles(ListaObjetos, destino) {
    for (let i = 0; i < ListaObjetos.length; i++) {
        if (ListaObjetos[i].estado == "Disponible") {
            var option = document.createElement('option');
            option.value = ListaObjetos[i].id;
            option.textContent = ListaObjetos[i].nombre;
            destino.appendChild(option);
        }
    }
}

function agregarContenidoTrabajadores(ListaObjetos, destino) {
    for (let i = 0; i < ListaObjetos.length; i++) {
        var option = document.createElement('option');
        option.value = ListaObjetos[i].id;
        option.textContent = ListaObjetos[i].nombre;
        destino.appendChild(option);
    }
}

function buscadorEquiposDisponibles(buscador, caja) {
    filter = buscador.value.toUpperCase();
    option = caja.getElementsByTagName("option");

    for (let i = 0; i < option.length; i++) {
        const textValue = option[i].textContent;

        if (textValue.toUpperCase().indexOf(filter) > -1) {
            option[i].style.display = "";
        } else {
            option[i].style.display = "none";
        }
    }
}

function verAndEliminarSeleccionados(caja) {
    let selected = [];
    for (let i = 0; i < caja.options.length; i++) {
        if (caja.options[i].selected) {
            selected.push(caja.options[i].value);
        }
    }

    for (let i = caja.options.length - 1; i >= 0; i--) {
        if (caja.options[i].selected) {
            caja.removeChild(caja.options[i]);
        }
    }


    return selected;

}

function verSeleccionados(caja) {
    let selected = [];
    for (let i = 0; i < caja.options.length; i++) {
        if (caja.options[i].selected) {
            selected.push(caja.options[i].value);
        }
    }

    return selected;

}

function verListaObjetos(caja, lista) {
    let selected = [];
    let listaObjetos = [];
    for (let i = 0; i < caja.options.length; i++) {
        selected.push(caja.options[i].value);
    }

    for (let i = 0; i < lista.length; i++) {
        for (let j = 0; j < selected.length; j++) {
            if (lista[i].id == selected[j]) {
                listaObjetos.push(lista[i]);
            }

        }

    }

    return listaObjetos;

}

function agregarSeleccionados(lista, listaSeleccionados, destino) {
    for (let i = 0; i < lista.length; i++) {
        for (let j = 0; j < listaSeleccionados.length; j++) {
            if (lista[i].id == listaSeleccionados[j]) {
                var option = document.createElement('option');
                option.value = lista[i].id;
                option.textContent = lista[i].nombre;
                destino.appendChild(option);
            }
        }
    }
}

function CrearPrestamo() {

    // Obtener la fecha actual
    var fechaActual = new Date();
    var dia = fechaActual.getDate();
    var mes = fechaActual.getMonth() + 1; // Los meses comienzan en 0
    var anio = fechaActual.getFullYear();
    var fechaFormateada = anio + '-' + mes + '-' + dia;

    // Obtener los demás valores
    var fechaEntrega = document.getElementById("fechaEntrega").value;
    var listaCajaPrestar = verListaObjetos(cajaPrestar, listaEquipos);

    // Verificar si los valores son nulos
    if (idTrabajadorSeleccionado && fechaEntrega && listaCajaPrestar) {
        // Crear el objeto Prestamo solo si los valores no son nulos
        let prestamo = new Prestamo(
            1,
            fechaFormateada,
            idTrabajadorSeleccionado,
            fechaEntrega,
            listaCajaPrestar
        );

        let equipoPrestadoJson = JSON.stringify(listaCajaPrestar);

        $.ajax({
            data: {
                fechaPrestamo: prestamo.fechaPrestamo,
                trabajadorSolicitante: prestamo.trabajadorSolicitante,
                fechaDevolucionEstimada: prestamo.fechaDevolucionEstimada,
                equipoPrestado: equipoPrestadoJson
            },
            url: "php/insertPrestamo.php",
            type: "POST",

            beforesend: function () {

            },
            success: function (mensaje) {
                alert(mensaje);
            },
            error: function (jqXHR, status, error) {
                console.log("Fail: " + error.message);
            }
        });

        console.log(prestamo);
    } else {
        // Lanzar un alert si alguno de los valores es nulo
        alert("Por favor, complete todos los campos antes de proceder.");
    }

}

// Función para crear trabajadores de ejemplo y agregarlos a la lista
function crearTrabajadoresEjemplo(lista) {
    return new Promise((resolve, reject) => {
        var params = {
            "postulado": "selectedOption"
        }

        $.ajax({
            data: params,
            url: "php/listaTrabajadores.php",
            type: "GET",
            dataType: "json",
            success: function (data) {
                for (let i = 0; i < data.length; i++) {
                    let trabajador = new Trabajador(
                        data[i].idTrabajador, // id
                        data[i].nombre, // nombre
                        data[i].apellido, // apellido
                        data[i].cargo, // cargo
                        data[i].departamento // departamento
                    );
                    lista.push(trabajador);
                }

                resolve();  // Resolver la promesa
            },
            error: function (jqXHR, status, error) {
                console.log("Error: " + error);
                reject(error);  // Rechazar la promesa en caso de error
            }
        });
    });
}

// Función para crear equipos de ejemplo y agregarlos a la lista
function crearEquiposEjemplo(lista) {
    return new Promise((resolve, reject) => {
        var params = {
            "postulado": "selectedOption"
        }

        $.ajax({
            data: params,
            url: "php/listaEquipos.php",
            type: "GET",
            dataType: "json",
            success: function (data) {
                for (let i = 0; i < data.length; i++) {
                    let equipo = new Equipo(
                        data[i].idEquipo, // id
                        data[i].nombre, // nombre
                        data[i].descripcion, // descripcion
                        data[i].caracteristicasTecnicas, // caracteristicasTecnicas
                        data[i].ubicacionBodega, // ubicacionBodega
                        data[i].estado // estado
                    );
                    lista.push(equipo);
                }
                resolve();  // Resolver la promesa
            },
            error: function (jqXHR, status, error) {
                console.log("Error: " + error);
                reject(error);  // Rechazar la promesa en caso de error
            }
        });
    });
}