
/* ------------------------------------------------------------------------------ */
/* ---------------------------------- VARIABLES --------------------------------- */
/* ------------------------------------------------------------------------------ */

let intentos = 3; // Número de intentos permitidos para el inicio de sesión
let tarjetas = []; // Array para almacenar las tarjetas
let cantidadTarjetas = tarjetas.length; // Cantidad de tarjetas almacenadas

// Contar las tarjetas por estado
let pendientes = 0;
let ejecucion = 0;
let finalizado = 0;

/* ------------------------------------------------------------------------------ */
/* ------------------------------------ LOGIN ----------------------------------- */
/* ------------------------------------------------------------------------------ */





/* ---------------------- ALERTAS SWEET ALERT ---------------------- */

async function mostrarAlert(estado, mensaje) {
    if (estado === 'fallo') { // fallo de login
        await Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${mensaje}`,
            confirmButtonText: 'OK',
            allowOutsideClick: false, // Evita que se cierre al hacer clic fuera del alerta
            allowEscapeKey: false // Evita que se cierre al presionar la tecla Escape
        });
    } else if (estado === 'exito') { // login exitoso
        await Swal.fire({
            icon: "success",
            title: "Bienvenido a AdminTask!",
            text: "Autenticación correcta!",
            confirmButtonText: 'OK',
            allowOutsideClick: false, // Evita que se cierre al hacer clic fuera del alerta
            allowEscapeKey: false // Evita que se cierre al presionar la tecla Escape
        });
    } else if (estado === 'modificar') { //modificar tarjeta
        return Swal.fire({  // pedido de confirmacion para modificar tarjeta
            title: "¿Estás seguro?",
            text: "¡Estás modificando el contenido de la tarjeta!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, modificar!",
            cancelButtonText: "Cancelar"
        });
    } else if (estado === 'borrar') { // eliminar tarjeta/s
        let texto;
        if (mensaje === 'tarjeta') {
            texto = "¡Estás eliminando la tarjeta!";
        } else {
            texto = "¡Estás eliminando todas las tarjetas!";
        }
        return Swal.fire({ // pedido de confirmacion para eliminar tarjeta/s
            title: "¿Estás seguro?",
            text: texto,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar!",
            cancelButtonText: "Cancelar"
        });
    }
}


/* ---------------------- VALIDACION DE LOGIN ---------------------- */
async function validarLogin(u, p) {
    let resultado = false;
    return new Promise((resolve, reject) => {

        /* fetch a URL - DATOS DE USUARIOS DE PRUEBA CARGADOS EN MOCKAPI  */
        fetch('https://664beb2d35bbda10987e6d95.mockapi.io/appAdminTask/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Respuesta: ' + response.statusText);
                }
                return response.json();
            })
            .then(users => {
                users.forEach(user => {
                    if (u == user.user && p == user.pass) {
                        console.log(u); //debug user
                        console.log(p); //debug pass
                        resultado = true;
                    }
                });

                if (resultado === true) {
                    mostrarAlert('exito', 'Autenticación correcta!'); // alert acceso exitoso
                    localStorage.setItem('usuario', u);
                    resolve("Exito");
                    window.location.href = '../index.html';
                } else {
                    intentos--;
                    if (intentos > 0) {
                        mostrarAlert('fallo', `Usuario o contraseña incorrectos. Intentos restantes: ${intentos}`);
                    } else {
                        mostrarAlert('fallo', 'Has alcanzado el límite de intentos. Por favor, inténtalo más tarde.');
                        reject("Fallo");
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                reject("Error");
            });
    });
}


/* ------------------------------------------------------------------------------ */
/* --------------------- LISTENER - CARGA DE DOCUMENTO -------------------------- */
/* ------------------------------------------------------------------------------ */


document.addEventListener('DOMContentLoaded', async () => {

    const enviarLogin = document.getElementById('login_form');
    if (enviarLogin) {
        enviarLogin.addEventListener('submit', async function (event) {
            event.preventDefault();
            if (intentos > 0) {
                const user = document.getElementById('username').value;
                const pass = document.getElementById('password').value;
                try {
                    await validarLogin(user, pass); // envia datos de user y pass ingresados en form login a validar
                    window.location.href = './pages/home.html';
                } catch (error) {
                    console.warn(error);
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


    graficarTarjetas(); // grafica mediante chart.js la cantidad de tajetas por estado
});


/* ------------------------------------------------------------------------------ */
/* ---------------------------------- FUNCIONES --------------------------------- */
/* ------------------------------------------------------------------------------ */


async function cerrarSesion() {
    localStorage.setItem('usuario', ""); // limpia usuario logueado
    window.location.href = '../index.html'; // redirecciona a index
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
            // Definimos un objeto llamado 'opciones' que contiene las opciones de formato para la fecha.
            // 'day: '2-digit'' formatea el día con dos dígitos 
            // 'month: '2-digit'' formatea el mes con dos dígitos 
            // 'year: 'numeric'' formatea el año con cuatro dígitos 
            const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
            // Formateamos la fecha actual según el formato definido y el idioma 'es-ES' (español de España).
            // Guardamos esta cadena en el array 'tarjeta' en la posición indicada por 'index'.
            tarjeta[index] = new Date().toLocaleDateString('es-ES', opciones);

            const fechaInicio = document.createElement('p'); // crea elemento p donde ira la fecha de creacion de la tarjeta
            fechaInicio.textContent = `FECHA CREACION: ${new Date().toLocaleDateString('es-ES', opciones)}`;
            card.appendChild(fechaInicio);

        } else {
            const elementP = document.createElement('p');
            if (tarjeta[index]) {
                elementP.textContent = `${dato}: ${tarjeta[index].toUpperCase()}`;
            } else {
                elementP.textContent = `${dato}: `;
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
                    elementP.textContent = `${dato}: ${tarjeta[index].toUpperCase()}`;
                } else {
                    elementP.textContent = `${dato}: `;
                }
                card.appendChild(elementP);
            }
        });

        // Crear checkboxes de estado
        const estados = ['pendiente', 'ejecutando', 'finalizado'];
        card.classList.add(`estado-${tarjeta[5].toLowerCase().replace(/\s/g, '-')}`);

        estados.forEach(function (estado) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = estado;
            checkbox.checked = tarjeta[5] === estado;

            // Asignar un identificador único al checkbox basado en la posición de la tarjeta en el array
            checkbox.id = `checkbox - ${index}`;

            // Asignar listener de evento change
            checkbox.addEventListener('change', function () {
                // Desmarcar los otros checkboxes de la misma tarjeta
                estados.forEach(function (otroEstado) {
                    if (otroEstado !== estado) {
                        const otroCheckbox = document.getElementById(`checkbox - ${index}`);
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
        // Asignar listener de evento click
        btnEliminar.addEventListener('click', function () {
            eliminarTarjeta(index);
            mostrarTarjetas();                 // Volver a mostrar las tarjetas para reflejar el cambio
        });
        card.appendChild(btnEliminar);

        const btnModificar = document.createElement('button');
        btnModificar.textContent = 'Modificar';
        btnModificar.classList.add('boton-eliminar');
        // Asignar listener de evento click
        btnModificar.addEventListener('click', function () {
            modificarTarjeta(tarjeta);
            mostrarTarjetas();                // Volver a mostrar las tarjetas para reflejar el cambio
        });
        card.appendChild(btnModificar); // Agrega el botón 'btnModificar' como hijo del elemento 'card'.

        contenedorTarjetas.appendChild(card); // Agrega la tarjeta 'card' al contenedor de tarjetas 'contenedorTarjetas'.
    });
}

async function eliminarTarjetas() { // Función para eliminar todas las tarjetas almacenadas
    const result = await mostrarAlert('borrar', 'tarjetas'); // mostrar alerta para confirmar eliminacion de tarjetas
    if (result.isConfirmed) { // elimina las tarjetas almacenadas
        localStorage.removeItem('tarjetas');
        localStorage.removeItem('cantidadTarjetas');

        const contenedorTarjetas = document.getElementById('container-mostrar-tarjeta');
        contenedorTarjetas.innerHTML = ''; // Limpiar el contenedor 
        Swal.fire({ // mustra la confirmacion de eliminacion de tarjetas
            title: "Eliminadas!",
            text: "Las tarjetas se eliminaron con éxito.",
            icon: "success"
        });
        mostrarTarjetas(); // Volver a mostrar las tarjetas para reflejar el cambio
    }
}

async function eliminarTarjeta(index) { // Función para eliminar una tarjeta específica
    const result = await mostrarAlert('borrar', 'tarjeta'); // mostrar alerta para confirmar eliminacion de la tarjeta
    if (result.isConfirmed) {
        Swal.fire({ // mustra la confirmacion de eliminacion de la tarjeta
            title: "Eliminada!",
            text: "La tarjeta se elimino con éxito.",
            icon: "success"
        });
        const tarjetasString = localStorage.getItem('tarjetas');
        let tarjetasStorage = JSON.parse(tarjetasString);
        tarjetasStorage.splice(index, 1); // Elimina la tarjeta del array
        localStorage.setItem('tarjetas', JSON.stringify(tarjetasStorage)); // Actualiza el localStorage
        mostrarTarjetas(); // Volver a mostrar las tarjetas para reflejar el cambio

    }
}

async function modificarTarjeta(tarjeta) {
    const tarjetasString = localStorage.getItem('tarjetas'); // Obtenemos la cadena de texto almacenada en localStorage 'tarjetas'
    let tarjetasStorage = JSON.parse(tarjetasString); //  convierte la cadena JSON en un array de JavaScript.

    // Buscamos el índice de una tarjeta específica en el array 'tarjetasStorage'.
    // Usamos el método 'findIndex' que devuelve el índice del primer elemento que cumpla con la función de prueba proporcionada.
    const index = tarjetasStorage.findIndex(t =>
        t[0] === tarjeta[0] && // Comparamos el primer elemento de 't' con el primer elemento de 'tarjeta'
        t[1] === tarjeta[1] && // Comparamos el segundo elemento de 't' con el segundo elemento de 'tarjeta'
        t[2] === tarjeta[2] && // Comparamos el tercer elemento de 't' con el tercer elemento de 'tarjeta'
        t[3] === tarjeta[3] && // Comparamos el cuarto elemento de 't' con el cuarto elemento de 'tarjeta'
        t[4] === tarjeta[4] && // Comparamos el quinto elemento de 't' con el quinto elemento de 'tarjeta'
        t[5] === tarjeta[5] && // Comparamos el sexto elemento de 't' con el sexto elemento de 'tarjeta'
        t[6] === tarjeta[6]    // Comparamos el séptimo elemento de 't' con el séptimo elemento de 'tarjeta'
    );

    // formulario para modificar tarjeta
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

    const result = await mostrarAlert('modificar', 'tarjeta'); // solicita confirmacion para modificar tarjeta
    if (result.isConfirmed) {

        formModificar.addEventListener('submit', async function (event) {
            event.preventDefault();

            const result = await mostrarAlert('modificar', 'tarjeta');
            if (result.isConfirmed) {

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

                Swal.fire({ // confirmacion de tarjeta modificada
                    title: "Modificada!",
                    text: "La tarjeta se modificó con éxito.",
                    icon: "success"
                });

                // Mostrar las tarjetas actualizadas
                mostrarTarjetas();
                contenedorFormulario.style.display = 'none'; // oculta el formulario
            }
            contenedorFormulario.style.display = 'none';
        });

        const contenedorFormulario = document.getElementById('formulario-modificar');
        if (contenedorFormulario) {
            contenedorFormulario.style.display = 'flex';
            contenedorFormulario.innerHTML = '';
            contenedorFormulario.appendChild(formModificar);
        } else {
            console.error('El contenedor del formulario no se encontró.');
        }
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
                    const index = tarjetasStorage.findIndex(t =>
                        t[0] === tarjeta[0] &&
                        t[1] === tarjeta[1] &&
                        t[2] === tarjeta[2] &&
                        t[3] === tarjeta[3] &&
                        t[4] === tarjeta[4] &&
                        t[5] === tarjeta[5] &&
                        t[6] === tarjeta[6]);

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
                mostrarTarjetas(); // Volver a mostrar las tarjetas para reflejar el cambio
            });
            card.appendChild(btnEliminar); // Agrega el botón de eliminar a la tarjeta

            // Crea un botón de modificar para la tarjeta
            const btnModificar = document.createElement('button');
            btnModificar.textContent = 'Modificar';
            btnModificar.classList.add('boton-eliminar');
            btnModificar.addEventListener('click', function () {
                modificarTarjeta(tarjeta);
                mostrarTarjetas(); // Volver a mostrar las tarjetas para reflejar el cambio
            });
            card.appendChild(btnModificar); // Agrega el botón de modificar a la tarjeta

            contenedorTarjetas.appendChild(card); // Agrega la tarjeta al contenedor
        }
    });
}

async function contarTarjetas() { // cuenta las tarjetas que existen en cada estado
    const tarjetasString = localStorage.getItem('tarjetas');
    const tarjetas = JSON.parse(tarjetasString);

    let pendientes = 0;
    let ejecucion = 0;
    let finalizado = 0;

    tarjetas.forEach(tarjeta => { // itera las tarjetas almacenadas e incrementa 1 si coincide el estado
        switch (tarjeta[5]) {
            case 'pendiente':
                pendientes++;
                break;
            case 'ejecutando':
                ejecucion++;
                break;
            case 'finalizado':
                finalizado++;
                break;
            default:
                break;
        }
    });

    return { pendientes, ejecucion, finalizado }; // retorna la cantidad de tarjetas por estado
}

async function graficarTarjetas() { // grafica con chart.js las tarjetas por estado
    const { pendientes, ejecucion, finalizado } = await contarTarjetas();
    const ctx = document.getElementById('myChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Ejecución', 'Finalizado', 'Pendiente'],
                datasets: [{
                    label: 'Cantidad de tarjetas por estado',
                    data: [ejecucion, finalizado, pendientes],
                    backgroundColor: [
                        'rgb(255, 255, 204)',
                        'rgb(204, 255, 204)',
                        'rgb(255, 204, 204)'

                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Cantidad de tarjetas por estado'
                    }
                }
            }
        });
    }
}



