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


///Prueba de prestamos

// Creando objetos de equipo
const equipo1 = new Equipo(1, 'Laptop', 'Laptop Dell', 'Intel i7, 16GB RAM, 512GB SSD', 'Bodega A', 'Disponible');
const equipo2 = new Equipo(2, 'Proyector', 'Proyector Epson', 'Full HD, 3000 Lumens', 'Bodega B', 'Disponible');
const equipo3 = new Equipo(3, 'Tablet', 'Tablet Samsung', '10.1 pulgadas, 64GB', 'Bodega A', 'Disponible');
const equipo4 = new Equipo(4, 'Impresora', 'Impresora HP', 'Laser, Multifuncional', 'Bodega C', 'Disponible');

// Creando objetos de préstamo
const prestamo1 = new Prestamo(1, '2023-06-01', '1', '2023-06-15', [equipo1, equipo2]);
const prestamo2 = new Prestamo(2, '2023-06-03', '1', '2023-06-17', [equipo3]);
const prestamo3 = new Prestamo(3, '2023-06-05', '6', '2023-06-19', [equipo4, equipo1]);




//Rellenar lista de trabajadores
let listaTrabajadores = [];
crearTrabajadoresEjemplo(listaTrabajadores);

//Rellenar lista de Prestamos
let listaPrestamos = [prestamo1, prestamo2, prestamo3];



inputTrabajador = document.getElementById("inputTrabajador");
cajaTrabajador = document.getElementById("cajaTrabajador");

inputPrestamo = document.getElementById("inputPrestamo");
cajaPrestamos = document.getElementById("cajaPrestamos");

ContenidoTabla = document.getElementById('ContenidoTabla');

document.addEventListener('DOMContentLoaded', (event) => {
    agregarContenidoPrestamos(listaPrestamos, cajaPrestamos);
});
document.getElementById("inputPrestamo").addEventListener("keyup", () => buscadorEquiposDisponibles(inputPrestamo, cajaPrestamos));

document.getElementById("cajaPrestamos").addEventListener("click", () => {
    for (let i = 0; i < listaPrestamos.length; i++) {
        if (listaPrestamos[i].id == verSeleccionados(cajaPrestamos)) {
            console.log(listaPrestamos[i].id);
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
    
    console.log(devolucion);
} else {
    alert("Rellene Todo los campos");
}

}

// Función para crear trabajadores de ejemplo y agregarlos a la lista
function crearTrabajadoresEjemplo(lista) {
    const nombres = ["Juan", "Maria", "Pedro", "Ana", "Luis", "Carlos", "Laura", "Fernando", "Jose", "Marta", "Lucia", "Sofia", "Miguel", "Ana", "Juan"];
    const apellidos = ["Perez", "Garcia", "Lopez", "Martinez", "Gonzalez", "Hernandez", "Ramirez", "Fernandez", "Sanchez", "Torres", "Dominguez", "Vargas", "Castro", "Diaz", "Morales"];
    const cargos = ["Gerente", "Supervisor", "Analista", "Desarrollador", "Diseñador", "Tester", "Administrador", "Consultor", "Ingeniero", "Especialista", "Operador", "Coordinador", "Lider de equipo", "Asistente", "Arquitecto"];
    const departamentos = ["Ventas", "Recursos Humanos", "TI", "Marketing", "Finanzas", "Legal", "Operaciones", "Logística", "Atención al Cliente", "Calidad", "Investigación", "Producción", "Soporte", "Proyectos", "Compras"];

    for (let i = 0; i < nombres.length; i++) {
        let trabajador = new Trabajador(
            i + 1, // id
            nombres[i], // nombre
            apellidos[i], // apellido
            cargos[i], // cargo
            departamentos[i] // departamento
        );
        lista.push(trabajador);
    }

    return lista;
}