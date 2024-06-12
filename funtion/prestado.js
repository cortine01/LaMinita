
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
crearTrabajadoresEjemplo(listaTrabajadores);

let idTrabajadorSeleccionado;

let listaEquipos = [];
crearEquiposEjemplo(listaEquipos);

document.addEventListener('DOMContentLoaded', (event) => {
    agregarContenidoTrabajadores(listaTrabajadores, cajaTrabajador);
    agregarContenidoEquiposDisponibles(listaEquipos, cajaBuscador);
    console.log(listaEquipos);
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
var fechaFormateada = dia + '/' + mes + '/' + anio;

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

    for (let i = 0; i < listaCajaPrestar.length; i++) {
        const element = listaCajaPrestar[i];
        alert(`nombre: ${element.nombre} Ubicación: ${element.ubicacionBodega}`);   
    }

    for (let i = 0; i < prestamo.equipoPrestado.length; i++) {
        console.log(prestamo.equipoPrestado[i].id);   
    }

    console.log(prestamo);
} else {
    // Lanzar un alert si alguno de los valores es nulo
    alert("Por favor, complete todos los campos antes de proceder.");
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

// Función para crear equipos de ejemplo y agregarlos a la lista
function crearEquiposEjemplo(lista) {
    const nombres = ["Impresora", "Scanner", "Laptop", "Monitor", "Teclado", "Mouse", "Router", "Switch", "Servidor", "Proyector"];
    const descripciones = [
        "Impresora láser color", "Scanner de alta resolución", "Laptop de 15 pulgadas", "Monitor 4K", "Teclado mecánico",
        "Mouse inalámbrico", "Router de alta velocidad", "Switch de 24 puertos", "Servidor dedicado", "Proyector HD"
    ];
    const caracteristicasTecnicas = [
        "Impresión rápida, dúplex", "Resolución 4800 dpi", "Intel i7, 16GB RAM, 512GB SSD", "3840x2160, HDR", "Cherry MX Blue switches",
        "Sensor óptico, 16000 DPI", "802.11ac, doble banda", "Gigabit Ethernet", "Xeon, 32GB RAM, 2TB HDD", "1080p, 3000 lúmenes"
    ];
    const ubicaciones = ["Bodega A", "Bodega B", "Bodega C", "Bodega D", "Bodega E", "Bodega F", "Bodega G", "Bodega H", "Bodega I", "Bodega J"];
    const estados = ["Disponible", "En uso", "En reparación", "Mantenimiento", "Fuera de servicio"];

    for (let i = 0; i < 10; i++) {
        let equipo = new Equipo(
            i + 1, // id
            nombres[i], // nombre
            descripciones[i], // descripcion
            caracteristicasTecnicas[i], // caracteristicasTecnicas
            ubicaciones[i], // ubicacionBodega
            estados[i % (estados.length-2)] // estado (cíclico para tener variedad)
        );
        lista.push(equipo);
    }
}