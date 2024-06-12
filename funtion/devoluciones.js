class Trabajador {
    constructor(id, nombre, apellido, cargo, departamento) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.cargo = cargo;
        this.departamento = departamento;
    }
}

// Clase Prestamo
class Prestamo {
    constructor(id, fechaPrestamo, trabajadorSolicitante, fechainputTrabajadortimada, equipoPrestado) {
        this.id = id;
        this.fechaPrestamo = fechaPrestamo;
        this.trabajadorSolicitante = trabajadorSolicitante;
        this.fechainputTrabajadortimada = fechainputTrabajadortimada;
        this.equipoPrestado = equipoPrestado;
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

//Clase Devolucion
class Devolucion {
    constructor(idDevolucion, fechaDevolucion, estadoEquipo, observaciones, prestamoDevuelto) {
        this.idDevolucion = idDevolucion;
        this.fechaDevolucion = fechaDevolucion;
        this.estadoEquipo = estadoEquipo;
        this.observaciones = observaciones;
        this.prestamoDevuelto = prestamoDevuelto;
    }
}



//Crear lista de trabajadores
let listaTrabajadores = [];
let listaEquipos = [];
//Crear lista de Prestamos
let listaPrestamos= [];



inputTrabajador = document.getElementById("inputTrabajador");
cajaTrabajador = document.getElementById("cajaTrabajador");

inputPrestamo = document.getElementById("inputPrestamo");
cajaPrestamos = document.getElementById("cajaPrestamos");

ContenidoTabla = document.getElementById('ContenidoTabla');


crearTrabajadoresEjemplo(listaTrabajadores).then(() => {
    
    crearEquiposEjemplo(listaEquipos).then(() => {

        ListaPrestamos(listaPrestamos, listaEquipos).then(() => {
            console.log(listaEquipos);
            console.log(listaTrabajadores);
            console.log(listaPrestamos);
            agregarContenidoPrestamos(listaPrestamos, cajaPrestamos);
        });
    });
});

document.getElementById("inputPrestamo").addEventListener("keyup", () => buscadorEquiposDisponibles(inputPrestamo, cajaPrestamos));

document.getElementById("cajaPrestamos").addEventListener("click", () => {
    for (let i = 0; i < listaPrestamos.length; i++) {
        if (listaPrestamos[i].id == verSeleccionados(cajaPrestamos)) {
            const element = listaPrestamos[i];
            //idTrabajadorSeleccionado = element.id;
            var contenido = "";
            var contenido2 = "";

            for (let j = 0; j < element.equipoPrestado.length; j++) {
                const element2 = element.equipoPrestado[j];
                contenido += `
                <div>
                - ${element2.nombre} 
                <select id="estadoEquipo-${element2.id}">
                <option value="disponible">Disponible</option>
                <option value="danado">Dañado</option>
                <option value="fuera de servicio">Fuera de Servicio</option>
                            </select>
                            </div>
                            `;

            }
            for (let k = 0; k < listaTrabajadores.length; k++) {
                const element2 = listaTrabajadores[k];
                if (element2.id == element.trabajadorSolicitante) {

                    contenido2 = element2.nombre + " " + element2.apellido;
                }
            }

            ContenidoTabla.getElementsByTagName('td')[0].innerHTML = element.fechaPrestamo;
            ContenidoTabla.getElementsByTagName('td')[1].innerHTML = contenido2;
            ContenidoTabla.getElementsByTagName('td')[2].innerHTML = element.fechainputTrabajadortimada;
            ContenidoTabla.getElementsByTagName('td')[3].innerHTML = contenido;
        }
    }
});

document.getElementById("btnCrearDevolucion").addEventListener("click", CrearDevolucion);

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


function agregarContenidoTrabajadores(ListaObjetos, destino) {
    for (let i = 0; i < ListaObjetos.length; i++) {
        var option = document.createElement('option');
        option.value = ListaObjetos[i].id;
        option.textContent = ListaObjetos[i].nombre;
        destino.appendChild(option);
    }
}

function agregarContenidoPrestamos(ListaObjetos, destino) {
    for (let i = 0; i < ListaObjetos.length; i++) {
        var option = document.createElement('option');
        option.value = ListaObjetos[i].id;
        for (let j = 0; j < listaTrabajadores.length; j++) {
            const element = listaTrabajadores[j];
            if (element.id == ListaObjetos[i].trabajadorSolicitante) {
                option.textContent = element.nombre;
            }
        }

        destino.appendChild(option);
    }
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

function verSeleccionados(caja) {
    let selected = [];
    for (let i = 0; i < caja.options.length; i++) {
        if (caja.options[i].selected) {
            selected.push(caja.options[i].value);
        }
    }

    return selected;

}

function CrearDevolucion() {

    // Obtener la fecha actual
    var fechaActual = new Date();
    var dia = fechaActual.getDate();
    var mes = fechaActual.getMonth() + 1; // Los meses comienzan en 0
    var anio = fechaActual.getFullYear();
    var fechaFormateada = dia + '/' + mes + '/' + anio;

    var prestamo;

    for (let i = 0; i < listaPrestamos.length; i++) {
        const element = listaPrestamos[i];
        if (element.id == verSeleccionados(cajaPrestamos)) {
            prestamo = element
        }
    }
    const estadoEquipo = {};
    if (prestamo) {
        prestamo.equipoPrestado.forEach(equipo => {
            const selectElement = document.getElementById(`estadoEquipo-${equipo.id}`);
            estadoEquipo[equipo.id] = selectElement.value;
        });
    }

    InputObservaciones = document.getElementById('InputObservaciones').value;
if (estadoEquipo && InputObservaciones && prestamo) {
    let devolucion = new Devolucion(
         1,
         fechaFormateada,
         estadoEquipo,
         InputObservaciones,
         prestamo.id
     );

     let estadoEquipoJson = JSON.stringify(estadoEquipo);

        $.ajax({
            data: {
                fechaDevolucion: devolucion.fechaDevolucion,
                estadoEquipo: estadoEquipoJson,
                observaciones: devolucion.observaciones,
                prestamoDevuelto: devolucion.prestamoDevuelto
            },
            url: "php/insertDevolucion.php",
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
    
    console.log(devolucion);
} else {
    alert("Rellene Todo los campos");
}

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

function ListaPrestamos(lista, listaEquipos) {
    return new Promise((resolve, reject) => {
        var params = {
            "postulado": "selectedOption"
        }

        $.ajax({
            data: params,
            url: "php/listaPrestamos.php",
            type: "GET",
            dataType: "json",
            success: function (data) {
                console.log(data);
                let prestamosMap = new Map();

                // Agrupar los préstamos por idPrestamo
                data.forEach(item => {
                    if (!prestamosMap.has(item.idPrestamo)) {
                        prestamosMap.set(item.idPrestamo, {
                            id: item.idPrestamo,
                            fechaPrestamo: item.fechaPrestamo,
                            trabajadorSolicitante: item.idTrabajador,
                            fechainputTrabajadortimada: item.fechaDevolucionEstimada,
                            equipoPrestado: []
                        });
                    }
                    prestamosMap.get(item.idPrestamo).equipoPrestado.push(item.idEquipo);
                });

                // Crear las instancias de Prestamo y asociar los equipos
                prestamosMap.forEach((value, key) => {
                    let prestamo = new Prestamo(
                        value.id,
                        value.fechaPrestamo,
                        value.trabajadorSolicitante,
                        value.fechainputTrabajadortimada,
                        value.equipoPrestado.map(id => listaEquipos.find(e => e.id === id)).filter(e => e)
                    );
                    lista.push(prestamo);
                });
                resolve();  // Resolver la promesa
            },
            error: function (jqXHR, status, error) {
                console.log("Error: " + error);
                reject(error);  // Rechazar la promesa en caso de error
            }
        });
    });
}