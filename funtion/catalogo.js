btnCrearEquipo = document.getElementById("btnCrearEquipo");
query = document.getElementById("query");
const tableBody = document.querySelector("#equipmentTable tbody");

listaEquipos = [];

crearEquiposEjemplo(listaEquipos).then(() => {


    listaEquipos.forEach(equipo => {
        const row = document.createElement("tr");
        row.setAttribute("id", `equipo`);
        row.innerHTML = `
        <td>${equipo.id}</td>
        <td>${equipo.nombre}</td>
        <td>${equipo.estado}</td>
        <td>${equipo.ubicacionBodega}</td>
        `;

        tableBody.appendChild(row);
        
        row.addEventListener('click', function () {
            window.location.href = `Equipo.html?id=${equipo.id}`;
        });
    });
});



btnCrearEquipo.addEventListener('click', function () {
    window.location.href = 'CrearEquipo.html';
});

query.addEventListener("keyup", () => buscadorEquiposDisponibles(query, tableBody));





function buscadorEquiposDisponibles(buscador, tabla) {
    const filter = buscador.value.toUpperCase();
    const rows = tabla.querySelectorAll("tr");

    rows.forEach(row => {
        const cells = row.getElementsByTagName("td");
        let found = false;
        for (let i = 0; i < cells.length; i++) {
            const cellValue = cells[i].textContent || cells[i].innerText;
            if (cellValue.toUpperCase().indexOf(filter) > -1) {
                found = true;
                break;
            }
        }
        if (found) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}



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

