equiposDisponibles = document.getElementById("equiposDisponibles");
cajaBuscador = document.getElementById("cajaBuscador");

trabajadorPrestar = document.getElementById("trabajadorPrestar");
cajaPrestar = document.getElementById("cajaPrestar");

cajaTrabajador = document.getElementById("cajaTrabajador"); 

document.getElementById("equiposDisponibles").addEventListener("keyup",() => buscadorEquiposDisponibles(equiposDisponibles, cajaBuscador));
document.getElementById("trabajadorPrestar").addEventListener("keyup",() => buscadorEquiposDisponibles(trabajadorPrestar, cajaTrabajador));

document.getElementById("btnRegistrarDisponble").addEventListener("click",() => agregarSeleccionados(verAndEliminarSeleccionados(cajaBuscador), cajaPrestar));
document.getElementById("btnBorrarDisponble").addEventListener("click",() => agregarSeleccionados(verAndEliminarSeleccionados(cajaPrestar), cajaBuscador));

document.getElementById("cajaTrabajador").addEventListener("click",() => {
    
    document.querySelector('#tablaPrestarTrabajador tbody td:first-child').textContent = verSeleccionados(cajaTrabajador);
    

});


function buscadorEquiposDisponibles(buscador, caja) {
    filter = buscador.value.toUpperCase();
    option = caja.getElementsByTagName("option");
    
    for (let i = 0; i < option.length; i++) {
        const textValue = option[i].textContent;

        if (textValue.toUpperCase().indexOf(filter) > -1) {
            option[i].style.display = "";
        }else {
            option[i].style.display = "none";
        }
    }
}

function verAndEliminarSeleccionados(caja) {
    let selected = [];
    for(let i = 0; i < caja.options.length; i++) {
        if (caja.options[i].selected) {
            selected.push(caja.options[i].value);
        }
    }
    
    for(let i = caja.options.length - 1; i >= 0; i--) {
        if (caja.options[i].selected) {
            caja.removeChild(caja.options[i]);
        }
    }

    console.log(selected);
    
    return selected;
    
}

function verSeleccionados(caja) {
    let selected = [];
    for(let i = 0; i < caja.options.length; i++) {
        if (caja.options[i].selected) {
            selected.push(caja.options[i].value);
        }
    }
    console.log(selected);
    
    return selected;
    
}

function agregarSeleccionados(seleccionados, destino) {
    for(let i = 0; i < seleccionados.length; i++) {
        var option = document.createElement('option');
        console.log
        option.value = seleccionados[i];
        option.textContent = seleccionados[i];
        destino.appendChild(option);
    }
}