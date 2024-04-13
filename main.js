const consultarId = () => {
    let usuarioId = parseInt(prompt("Ingrese su numero de usuario"));
    return usuarioId
}

const consultarClave = () => {
    let usuarioClave = prompt("Ingrese su clave");
    return usuarioClave
}


let validarUsuario = (id, name) => {
    let estado = false;
    if (id === 606060 && name === 'Clave12345') {
        estado = true;
    }
    return estado;
}




let saludarInicio = (id) => {
    let usuario = "Usuario Ejemplo"
    if (id === 606060) {
        alert(`Bienvenido usuario: ${id} - ${usuario}`)
    }
}

let saludarFin = (id) => {
    let usuario = "Usuario Ejemplo"
    if (id === 606060) {
        alert(`Hasta luego usuario: ${id} - ${usuario}`)
    }
}


function consultarAccion() {
    let eleccion = prompt("Ingrese que desea realizar: \n A: Crear tarea \n B: Modificar tarea\n C: Eliminar tarea\n D: Mostrar tareas creadas\n Cancelar o ESC para SALIR");
    return eleccion
}

function crearTarea(tareas) {
    alert("La opcion seleccionada es CREAR TAREA")
    let tarea = prompt("Ingrese tarea")
    tareas.push(tarea)
}


function modificarTarea(tareas) {

    let opc = prompt("INGRESE EL NUMERO DE LA TAREA A MODIFICAR");

    if (opc === null) {
        alert("Operación cancelada.");
        return; // Salir de la función
    }

    let indice = parseInt(opc) - 1;

    while (isNaN(indice) || indice < 0 || indice >= tareas.length) {
        alert(`El número de tarea ingresado no existe. Las tareas existentes son ${tareas.length}`);
        opc = prompt("INGRESE EL NUMERO DE LA TAREA A MODIFICAR");

        if (opc === null) {
            alert("Operación cancelada.");
            return; // Salir de la función
        }

        indice = parseInt(opc) - 1;
    }

    let contenido = prompt("INGRESE LA NUEVA TAREA")
    tareas.splice(indice, 1, contenido)
    mostrarTareas(tareas)

}


function eliminarTarea(tareas) {
    let opc = prompt("INGRESE EL NUMERO DE LA TAREA A ELIMINAR");

    if (opc === null) {
        alert("Operación cancelada.");
        return; // Salir de la función
    }

    let indice = parseInt(opc) - 1;

    while (isNaN(indice) || indice < 0 || indice >= tareas.length) {
        alert(`El número de tarea ingresado no existe. Las tareas existentes son ${tareas.length}`);
        opc = prompt("INGRESE EL NUMERO DE LA TAREA A ELIMINAR");

        if (opc === null) {
            alert("Operación cancelada.");
            return; // Salir de la función
        }

        indice = parseInt(opc) - 1;
    }

    tareas.splice(indice, 1);
    mostrarTareas(tareas);
}


function mostrarTareas(tareas) {
    let mensaje = "LAS TAREAS CARGADAS SON:\n";

    for (let i = 0; i < tareas.length; i++) {
        mensaje += (i + 1) + " - " + tareas[i] + "\n";
    }
    alert(mensaje);

    for (let i = 0; i < tareas.length; i++) {
        console.log(tareas[i]);
    }
}



function validarAccion(opcion, arrayTareas) {
    if (opcion == "A" || opcion == "a") {
        crearTarea(arrayTareas)

    } else if (opcion == "B" || opcion == "b") {
        modificarTarea(arrayTareas)

    } else if (opcion == "C" || opcion == "c") {
        eliminarTarea(arrayTareas)

    } else if (opcion == "D" || opcion == "d") {
        mostrarTareas(arrayTareas)
    } else if (opcion === null) {
        alert("Has cancelado la operación.");
    } else {
        alert("La opcion seleccionada no es valida");
    }
}


function loop(tareas) {

    while (otraAccion) {
        let opcion = consultarAccion()
        if (opcion === null) {
            alert("FIN de gestion de tareas")
            otraAccion = false
            break
        }
        validarAccion(opcion, tareas)
        let continuar = confirm("¿Desea realizar otra accion?")
        if (continuar == false) {
            alert("FIN de gestion de tareas")
            otraAccion = false
            break
        } else {
            otraAccion = true
        }
    }
}




let tareas = [];
let otraAccion = true;
let maxIntentos = 3;
let usuario;

do {
    const id = consultarId();
    const clave = consultarClave();
    usuario = validarUsuario(id, clave);
    if (usuario) {
        saludarInicio(id);
        loop(tareas);
        saludarFin(id);
    } else {
        alert("El usuario y/o contraseña son incorrectos");
        maxIntentos--;
    }
} while (maxIntentos > 0 && !usuario);

if (maxIntentos === 0) {
    alert("Supero el máximo de 3 intentos - usuario y/o contraseña incorrectos");
}
















