
/* ------------------------------------------------------------------------------ */
/* ---------------------------------- VARIABLES --------------------------------- */
/* ------------------------------------------------------------------------------ */

let intentos = 3; // Número de intentos permitidos para el inicio de sesión
let tarjetas = []; // Array para almacenar las tarjetas
let cantidadTarjetas = tarjetas.length; // Cantidad de tarjetas almacenadas



/* ------------------------------------------------------------------------------ */
/* ------------------------------------ LOGIN ----------------------------------- */
/* ------------------------------------------------------------------------------ */



async function mostrarError(mensaje) {
    const errorLogin = document.getElementById('error'); // obtiene el elemento del DOM con ID error
    errorLogin.style.display = 'block'; // muestra el elemento que por defecto estana con display none
    const errorDiv = document.createElement("div");
    const errorText = document.createElement("p");
    errorText.textContent = mensaje;
    errorDiv.appendChild(errorText);
    const formContainer = document.getElementById("login_form");
    formContainer.appendChild(errorDiv);
}

async function validarLogin(u, p) {
    return new Promise((resolve, reject) => {
        if (u === '606060' && p === 'Clave12345') {
            localStorage.setItem('usuario', u);
            resolve("Exito");
        } else {
            intentos--;
            if (intentos > 0) {
                mostrarError(`Usuario o contraseña incorrectos. Intentos restantes: ${intentos}`);
            } else {
                mostrarError('Has alcanzado el límite de intentos. Por favor, inténtalo más tarde.');
                reject("Fallo");
            }
        }
    });
}

/* ------------------------------------------------------------------------------ */
/* --------------------- LISTENER - CARGA DE DOCUMENTO -------------------------- */
/* ------------------------------------------------------------------------------ */


document.addEventListener('DOMContentLoaded', function () {

    const enviarLogin = document.getElementById('login_form');
    if (enviarLogin) {
        enviarLogin.addEventListener('submit', async function (event) {
            event.preventDefault();
            if (intentos > 0) {
                const user = document.getElementById('username').value;
                const pass = document.getElementById('password').value;
                try {
                    await validarLogin(user, pass);
                    window.location.href = './pages/home.html';
                } catch (error) {

                }
            }
        });
    }

    const usuarioLogin = localStorage.getItem('usuario'); // obtiene el usuario almacenado en localStorage
    if (usuarioLogin) { // comprueba si hay un usuario almacenado
        console.log('Usuario logueado:', usuarioLogin); // debug - muestra usuario logueado en la consola
        document.getElementById('usuario').textContent = 'usuario: ' + usuarioLogin; // muestra usuario logueado en la página. lo añade al contenido del elemento con id usuario
    }

    const tarjetasString = localStorage.getItem('tarjetas'); // obtiene las tarjetas almacenadas en localStorage
    if (tarjetasString) { // comprueba si hay tarjetas almacenadas
        const tarjetas = JSON.parse(tarjetasString); // convierte las tarjetas de formato JSON a un array de JavaScript
        console.log('Tarjetas almacenadas:', tarjetas); // debug - muestra las tarjetas almacenadas en la consola
    }

    const mostrarTarjetasBtn = document.getElementById('mostrar-tarjetas'); // Botón para mostrar las tarjetas
    if (mostrarTarjetasBtn) { // comprueba si el botón existe
        mostrarTarjetasBtn.addEventListener('click', mostrarTarjetas); // Agrega listener para el evento click del botón 
    }

    const eliminarTarjetasBtn = document.getElementById('eliminar-tarjetas'); // Botón para eliminar las tarjetas
    if (eliminarTarjetasBtn) { // comprueba si el botón existe
        eliminarTarjetasBtn.addEventListener('click', eliminarTarjetas); // Agregar listener para el evento click del botón
    }

    const filtrarTarjetasBtn = document.getElementById('btn-filtrar'); // Botón para filtrar las tarjetas
    if (filtrarTarjetasBtn) { // comprueba si el botón existe
        filtrarTarjetasBtn.addEventListener('click', filtrarTarjetas); // Agrega listener para el evento click del botón
    }

    const cerrarSesionBtn = document.getElementById('link_sesion'); // Botón para cerrar sesion
    if (cerrarSesionBtn) { // comprueba si el botón existe
        cerrarSesionBtn.addEventListener('click', cerrarSesion); // Agrega listener para el evento click del botón
    }




    // comprobar si hay tarjetas almacenadas en localStorage y cargarlas en la variable tarjetas
    if (localStorage.getItem('tarjetas')) {
        tarjetas = JSON.parse(localStorage.getItem('tarjetas'));
    }

    const crear = document.getElementById('form_crear'); // Formulario para crear tarjetas
    if (crear) { // Comprueba si el formulario existe
        crear.addEventListener('submit', function (event) { // Agrega listener para el evento submit del formulario
            event.preventDefault(); // Prevenir el envío del formulario


            // Obtener los valores de los campos del formulario
            let nombre = document.getElementById('nombre').value;
            let dir = document.getElementById('dir').value;
            let doc = document.getElementById('dni').value;
            let falla = document.getElementById('falla').value;
            let tec = document.getElementById('tecnico').value;
            let fecha = document.getElementById('fecha-inicio').value;
            let comentario = document.getElementById('coment').value;

            let tarjeta = [nombre, dir, doc, falla, tec, 'pendiente', fecha, comentario]; // Crea una nueva tarjeta con los valores obtenidos + estado inicial pendiente
            tarjetas.push(tarjeta); // Agrega tarjeta al array tarjetas
            crearTarjeta(tarjeta);// Llama a la función crearTarjeta enviando como argumento la tarjeta


            // Guardar tarjetas y tamaño en el localStorage
            localStorage.setItem('tarjetas', JSON.stringify(tarjetas));
            localStorage.setItem('cantidadTarjetas', tarjetas.length);

            cantidadTarjetas = tarjetas.length; // Actualiza la cantidad de tarjetas
        });
    }
});


/* ------------------------------------------------------------------------------ */
/* ---------------------------------- FUNCIONES --------------------------------- */
/* ------------------------------------------------------------------------------ */


async function cerrarSesion() {
    localStorage.setItem('usuario', "");
    window.location.href = '../index.html';
}

async function crearTarjeta(tarjeta) {
    const card = document.createElement('div');
    card.classList.add('form-container-tarjetas');

    const datos_tarjeta = ['Nombre', 'Direccion', 'DNI', 'Falla', 'Tecnico', 'Estado', 'Fecha de creacion', 'Comentario'];

    datos_tarjeta.forEach(function (dato, index) {
        if (dato === 'Comentario') {
            const elementText = document.createElement('textarea');
            if (tarjeta[index]) {
                elementText.value = tarjeta[index].toUpperCase();
            } else {
                elementText.value = '';
            }
            elementText.classList.add('coment', 'textarea-scroll');
            card.appendChild(elementText);

        } else if (dato === 'Fecha de creacion') {
            const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
            tarjeta[index] = new Date().toLocaleDateString('es-ES', opciones);



            const fechaInicio = document.createElement('p');
            fechaInicio.textContent = `FECHA CREACION: ${new Date().toLocaleDateString('es-ES', opciones)}`;
            card.appendChild(fechaInicio);

        } else {
            const elementP = document.createElement('p');
            if (tarjeta[index]) {
                elementP.textContent = `${dato}:     ${tarjeta[index].toUpperCase()}`;
            } else {
                elementP.textContent = `${dato}:     `;
            }
            card.appendChild(elementP);
        }
    });

    const container = document.getElementById('container-tarjeta');
    container.appendChild(card);
}



async function mostrarTarjetas() {
    const tarjetasString = localStorage.getItem('tarjetas');
    const tarjetasStorage = JSON.parse(tarjetasString);

    const contenedorTarjetas = document.getElementById('container-mostrar-tarjeta');
    contenedorTarjetas.innerHTML = ''; // Limpiar el contenedor antes de agregar las tarjetas

    tarjetasStorage.forEach(function (tarjeta, index) {
        const card = document.createElement('div');
        card.classList.add('form-container-tarjetas');

        const datosTarjeta = ['Nombre', 'Direccion', 'DNI', 'Falla', 'Tecnico', 'Estado', 'Fecha de creacion', 'Comentario'];


        datosTarjeta.forEach(function (dato, index) {
            if (dato === 'Comentario') {
                const elementText = document.createElement('textarea');
                if (tarjeta[index]) {
                    elementText.value = tarjeta[index].toUpperCase();
                } else {
                    elementText.value = '';
                }
                elementText.classList.add('coment', 'textarea-scroll');
                card.appendChild(elementText);

            } else if (dato === 'Fecha de creacion') {
                const fechaInicio = document.createElement('p');
                fechaInicio.textContent = `FECHA CREACION: ${tarjeta[index]}`;
                card.appendChild(fechaInicio);

            } else {
                const elementP = document.createElement('p');
                if (tarjeta[index]) {
                    elementP.textContent = `${dato}:     ${tarjeta[index].toUpperCase()}`;
                } else {
                    elementP.textContent = `${dato}:     `;
                }
                card.appendChild(elementP);
            }
        });

        // Crear checkboxes de estado
        const estados = ['pendiente', 'ejecutando', 'finalizado'];
        card.classList.add(`estado-${tarjeta[5].toLowerCase().replace(/\s/g, '-')}`);

        // Dentro de la función mostrarTarjetas()

        estados.forEach(function (estado) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = estado;
            checkbox.checked = tarjeta[5] === estado;

            // Asignar un identificador único al checkbox basado en la posición de la tarjeta en el array
            checkbox.id = `checkbox-${index}`;

            // Asignar listener de evento change
            checkbox.addEventListener('change', function () {
                // Desmarcar los otros checkboxes de la misma tarjeta
                estados.forEach(function (otroEstado) {
                    if (otroEstado !== estado) {
                        const otroCheckbox = document.getElementById(`checkbox-${index}`);
                        otroCheckbox.checked = false;
                    }
                });

                // Actualizar el estado de la tarjeta en el array
                tarjetasStorage[index][5] = estado;
                localStorage.setItem('tarjetas', JSON.stringify(tarjetasStorage));

                // Volver a mostrar las tarjetas para reflejar el cambio
                mostrarTarjetas();
            });

            const label = document.createElement('label');
            label.textContent = estado;
            label.appendChild(checkbox);
            card.appendChild(label);
        });


        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.classList.add('boton-eliminar');
        btnEliminar.addEventListener('click', function () {
            eliminarTarjeta(index);
            mostrarTarjetas();
        });
        card.appendChild(btnEliminar);

        const btnModificar = document.createElement('button');
        btnModificar.textContent = 'Modificar';
        btnModificar.classList.add('boton-eliminar');
        btnModificar.addEventListener('click', function () {
            modificarTarjeta(tarjeta);
            mostrarTarjetas();
        });
        card.appendChild(btnModificar);

        contenedorTarjetas.appendChild(card);
    });
}


async function eliminarTarjetas() { // Función para eliminar todas las tarjetas almacenadas
    localStorage.removeItem('tarjetas');
    localStorage.removeItem('cantidadTarjetas');
    const contenedorTarjetas = document.getElementById('container-mostrar-tarjeta');
    contenedorTarjetas.innerHTML = ''; // Limpiar el contenedor 
}


async function eliminarTarjeta(index) { // Función para eliminar una tarjeta específica
    const tarjetasString = localStorage.getItem('tarjetas');
    let tarjetasStorage = JSON.parse(tarjetasString);
    tarjetasStorage.splice(index, 1); // Elimina la tarjeta del array
    localStorage.setItem('tarjetas', JSON.stringify(tarjetasStorage)); // Actualiza el localStorage
}



async function modificarTarjeta(tarjeta) {
    const tarjetasString = localStorage.getItem('tarjetas');
    let tarjetasStorage = JSON.parse(tarjetasString);

    const index = tarjetasStorage.findIndex(t => t[0] === tarjeta[0] && t[1] === tarjeta[1] && t[2] === tarjeta[2] && t[3] === tarjeta[3] && t[4] === tarjeta[4] && t[5] === tarjeta[5] && t[6] === tarjeta[6]);

    const formModificar = document.createElement('form');
    formModificar.classList.add('form-container');
    formModificar.innerHTML = `
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" value="${tarjeta[0]}"><br><br>
        <label for="direccion">Dirección:</label>
        <input type="text" id="direccion" name="direccion" value="${tarjeta[1]}"><br><br>
        <label for="dni">DNI:</label>
        <input type="text" id="dni" name="dni" value="${tarjeta[2]}"><br><br>
        <label for="falla">Falla:</label>
        <input type="text" id="falla" name="falla" value="${tarjeta[3]}"><br><br>
        <label for="tecnico">Técnico:</label>
        <input type="text" id="tecnico" name="tecnico" value="${tarjeta[4]}"><br><br>
        <label for="comentario">Comentario:</label>
        <textarea id="comentario" name="comentario">${tarjeta[7]}</textarea><br><br>
        <button type="submit" class="boton-mostrar">Guardar cambios</button>
    `;

    formModificar.addEventListener('submit', function (event) {
        event.preventDefault();

        // Obtener los nuevos valores del formulario
        const nuevoNombre = document.getElementById('nombre').value;
        const nuevaDireccion = document.getElementById('direccion').value;
        const nuevoDNI = document.getElementById('dni').value;
        const nuevaFalla = document.getElementById('falla').value;
        const nuevoTecnico = document.getElementById('tecnico').value;
        const nuevoComentario = document.getElementById('comentario').value;

        // Actualizar la tarjeta en el array con los nuevos valores
        tarjetasStorage[index] = [nuevoNombre, nuevaDireccion, nuevoDNI, nuevaFalla, nuevoTecnico, tarjeta[5], tarjeta[6], nuevoComentario];

        // Actualizar el localStorage con la tarjeta modificada
        localStorage.setItem('tarjetas', JSON.stringify(tarjetasStorage));

        // Mostrar las tarjetas actualizadas
        mostrarTarjetas();
        contenedorFormulario.style.display = 'none';
    });

    const contenedorFormulario = document.getElementById('formulario-modificar');
    contenedorFormulario.style.display = 'block';
    if (contenedorFormulario) {
        contenedorFormulario.innerHTML = '';
        contenedorFormulario.appendChild(formModificar);
    } else {
        console.error('El contenedor del formulario no se encontró.');
    }
}



async function obtenerValorEnMayusculas(id) {
    const elemento = document.getElementById(id);
    if (elemento) {
        return elemento.value.toUpperCase();
    } else {
        return '';
    }
}


async function filtrarTarjetas() { // Función para filtrar y mostrar las tarjetas según los criterios de búsqueda
    const tarjetasString = localStorage.getItem('tarjetas'); // Obtiene las tarjetas almacenadas en localStorage
    const tarjetas = JSON.parse(tarjetasString); // Convierte las tarjetas de formato JSON a un array de JavaScript



    const filtroNombre = await obtenerValorEnMayusculas('filtro-nombre');
    const filtroDireccion = await obtenerValorEnMayusculas('filtro-direccion');
    const filtroDNI = await obtenerValorEnMayusculas('filtro-dni');
    const filtroFalla = await obtenerValorEnMayusculas('filtro-falla');
    const filtroTecnico = await obtenerValorEnMayusculas('filtro-tecnico');
    const filtroEstado = await obtenerValorEnMayusculas('filtro-estado');
    const filtroFecha = document.getElementById('filtro-fecha').value;




    const contenedorTarjetas = document.getElementById('container-mostrar-tarjeta'); // obtiene el contenedor donde se mostrarán las tarjetas
    contenedorTarjetas.innerHTML = ''; // Limpia el contenedor antes de agregar las tarjetas


    // Iterar sobre cada tarjeta para comprobar si cumple con los criterios de búsqueda
    tarjetas.forEach(function (tarjeta) {


        const cumpleFiltros =
            (!filtroNombre || tarjeta[0].toUpperCase().includes(filtroNombre)) &&
            (!filtroDireccion || tarjeta[1].toUpperCase().includes(filtroDireccion)) &&
            (!filtroDNI || tarjeta[2].toUpperCase().includes(filtroDNI)) &&
            (!filtroFalla || tarjeta[3].toUpperCase().includes(filtroFalla)) &&
            (!filtroTecnico || tarjeta[4].toUpperCase().includes(filtroTecnico)) &&
            (!filtroEstado || tarjeta[5].toUpperCase().includes(filtroEstado)) &&
            (!filtroFecha || (tarjeta[6] && tarjeta[6].toUpperCase().includes(filtroFecha)));

        if (cumpleFiltros) {

            // Crear un elemento div para representar la tarjeta
            const card = document.createElement('div');
            card.classList.add('form-container-tarjetas'); // Agrega clase form-container-tarjetas al div de la tarjeta

            const datosTarjeta = ['Nombre', 'Direccion', 'DNI', 'Falla', 'Tecnico', 'Estado', 'Fecha de creacion', 'Comentario'];

            // Para cada dato de la tarjeta, crea un elemento p y lo agrega al div de la tarjeta
            datosTarjeta.forEach(function (dato, index) {
                if (dato === 'Comentario') {
                    const elementText = document.createElement('textarea');
                    if (tarjeta[index]) {
                        elementText.value = tarjeta[index].toUpperCase();
                    } else {
                        elementText.value = '';
                    }
                    elementText.classList.add('coment', 'textarea-scroll');
                    card.appendChild(elementText);

                } else if (dato === 'Fecha de creacion') {
                    const fechaInicio = document.createElement('p');
                    fechaInicio.textContent = `FECHA CREACION: ${new Date().toLocaleDateString()}`;
                    card.appendChild(fechaInicio);
                } else {
                    const elementP = document.createElement('p');
                    if (tarjeta[index]) {
                        elementP.textContent = `${dato}:     ${tarjeta[index].toUpperCase()}`;
                    } else {
                        elementP.textContent = `${dato}:     `;
                    }
                    card.appendChild(elementP);
                }
            });

            const estados = ['pendiente', 'ejecutando', 'finalizado'];
            card.classList.add(`estado-${tarjeta[5].toLowerCase().replace(/\s/g, '-')}`);

            estados.forEach(function (estado) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = estado;
                checkbox.checked = tarjeta[5] === estado; // Marca el checkbox si el estado de la tarjeta coincide

                checkbox.addEventListener('change', function () {
                    // Desmarca los otros checkboxes
                    estados.forEach(function (otroEstado) {
                        if (otroEstado !== estado) {
                            const otroCheckbox = card.querySelector(`input[value="${otroEstado}"]`);
                            otroCheckbox.checked = false;
                        }
                    });

                    const tarjetasString = localStorage.getItem('tarjetas');
                    let tarjetasStorage = JSON.parse(tarjetasString);
                    const index = tarjetasStorage.findIndex(t => t[0] === tarjeta[0] && t[1] === tarjeta[1] && t[2] === tarjeta[2] && t[3] === tarjeta[3] && t[4] === tarjeta[4] && t[5] === tarjeta[5] && t[6] === tarjeta[6]);

                    // Actualiza el estado de la tarjeta en el array
                    tarjetasStorage[index][5] = estado;

                    // Actualiza el estado de la tarjeta en el localStorage
                    localStorage.setItem('tarjetas', JSON.stringify(tarjetasStorage));
                    mostrarTarjetas();
                });

                const label = document.createElement('label');
                label.textContent = estado;
                label.appendChild(checkbox);
                card.appendChild(label);

            });

            // Crea un botón de eliminar para la tarjeta
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.classList.add('boton-eliminar');
            btnEliminar.addEventListener('click', function () {
                eliminarTarjeta(tarjeta);
                mostrarTarjetas();
            });
            card.appendChild(btnEliminar); // Agrega el botón de eliminar a la tarjeta

            // Crea un botón de modificar para la tarjeta
            const btnModificar = document.createElement('button');
            btnModificar.textContent = 'Modificar';
            btnModificar.classList.add('boton-eliminar');
            btnModificar.addEventListener('click', function () {
                modificarTarjeta(tarjeta);
                mostrarTarjetas();
            });
            card.appendChild(btnModificar); // Agrega el botón de modificar a la tarjeta

            contenedorTarjetas.appendChild(card); // Agrega la tarjeta al contenedor
        }
    });
}




