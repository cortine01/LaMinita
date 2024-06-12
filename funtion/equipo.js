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

nombre = document.getElementById("Nombre");
DescripcionEquipos = document.getElementById("Descripcion");
Ubicacion = document.getElementById("Ubicacion");
estado = document.getElementById("Estado");

listaEquipos = [];
const urlParams = new URLSearchParams(window.location.search);
const equipoId = urlParams.get('id');

crearEquiposEjemplo(listaEquipos).then(() => {

    for (let i = 0; i < listaEquipos.length; i++) {
        const element = listaEquipos[i];
        if (element.id == equipoId) {
            nombre.textContent = element.nombre;
            DescripcionEquipos.innerHTML = element.descripcion + "<br>" + element.caracteristicasTecnicas;
            Ubicacion.textContent = element.ubicacionBodega;
            estado.textContent = element.estado;
        }
    }

});

document.getElementById('btnRegresar').addEventListener('click', function () {
    history.back(); // Regresar a la página anterior en el historial del navegador
});


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