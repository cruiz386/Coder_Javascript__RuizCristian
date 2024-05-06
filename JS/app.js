
/* ------------------------------------------------------------------------------ */
/* ---------------------------------- VARIABLES --------------------------------- */
/* ------------------------------------------------------------------------------ */

let intentos = 3; // Número de intentos permitidos para el inicio de sesión
let tarjetas = []; // Array para almacenar las tarjetas
let cantidadTarjetas = tarjetas.length; // Cantidad de tarjetas almacenadas


/* ------------------------------------------------------------------------------ */
/* ------------------------------------ LOGIN ----------------------------------- */
/* ------------------------------------------------------------------------------ */


let validarLogin = function (u, p) { // Función para validar el inicio de sesión

    if (u === '606060' && p === 'Clave12345') { // Comprobación de credenciales de ejemplo 
        localStorage.setItem('usuario', u); // Guarda usuario en el localStorage
        window.location.href = './pages/home.html';// Redirecciona a la página de inicio luego de acceso exitoso
    } else {  // Bloque de código para manejar errores en el inicio de sesión
        const error = document.getElementById('error'); // obtiene el elemento del DOM con ID error
        error.style.display = 'block'; // muestra el elemento que por defecto estana con display none
        intentos--; // resta 1 a intentos

        if (intentos > 0) { //verifica si aun quedan intentos de login disponibles y crea un mensaje de error con los intentos restantes
            let errorDiv = document.createElement("div");
            let errorText = document.createElement("p");
            errorText.textContent = "Usuario o contraseña incorrectos. Intentos restantes:" + intentos;
            errorDiv.appendChild(errorText);

            let formContainer = document.getElementById("login_form");
            formContainer.appendChild(errorDiv); // agrega el mje de error al elemento con ID login_form
        } else { //no quedan intentos de login disponibles, crea un mensaje de error por limite de intentos superado
            let errorDiv = document.createElement("div");
            let errorText = document.createElement("p");
            errorText.textContent = 'Has alcanzado el límite de intentos. Por favor, inténtalo más tarde.';
            errorDiv.appendChild(errorText);

            let formContainer = document.getElementById("login_form");
            formContainer.appendChild(errorDiv);// agrega el mje de error al elemento con ID login_form
        }
        return
    }
};


/* ------------------------------------------------------------------------------ */
/* --------------------- LISTENER - CARGA DE DOCUMENTO -------------------------- */
/* ------------------------------------------------------------------------------ */


document.addEventListener('DOMContentLoaded', function () { // Listener para cuando el documento esté cargado
    const enviarLogin = document.getElementById('login_form'); // Elemento del formulario de inicio de sesión

    if (enviarLogin) { // comprueba si el formulario existe
        enviarLogin.addEventListener('submit', function (event) { // agrega listener para el evento submit del formulario
            event.preventDefault(); // previene el envío del formulario

            if (intentos > 0) { // Comprueba si quedan intentos de inicio de sesión
                let user = document.getElementById('username').value; // Obtiene el valor del campo de usuario
                let pass = document.getElementById('password').value; // Obtiene el valor del campo de contraseña

                // debug - Muetra usuario y contraseña en la consola
                console.log(user);
                console.log(pass);

                validarLogin(user, pass); // Llama a la función validarLogin con usuario y contraseña como argumentos
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
            let comentario = document.getElementById('coment').value;

            let tarjeta = [nombre, dir, doc, falla, tec, comentario]; // Crea una nueva tarjeta con los valores obtenidos
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


function crearTarjeta(tarjeta) { // Función para crear una tarjeta y agregarla al contenedor
    const card = document.createElement('div'); // crea un div
    card.classList.add('form-container-tarjetas'); // al div card le agrega class form-container-tarjetas

    const datos_tarjeta = ['Nombre', 'Direccion', 'DNI', 'Falla', 'Tecnico', 'Comentario'];

    datos_tarjeta.forEach(function (dato, index) {
        const element = document.createElement('p'); // Crea el elemento p
        element.textContent = `${dato}:     ${tarjeta[index].toUpperCase()}`;
        card.appendChild(element); // Agrega el elemento p creado con dato: valor a card (div)
    });

    const container = document.getElementById('container-tarjeta');
    container.appendChild(card); // Agrega la tarjeta al contenedor container-tarjeta
}



function mostrarTarjetas() { // Función para mostrar todas las tarjetas almacenadas
    const tarjetasString = localStorage.getItem('tarjetas');
    const tarjetasStorage = JSON.parse(tarjetasString);

    const contenedorTarjetas = document.getElementById('container-mostrar-tarjeta');
    contenedorTarjetas.innerHTML = ''; // Limpiar el contenedor antes de agregar las tarjetas

    tarjetasStorage.forEach(function (tarjeta, index) {
        const card = document.createElement('div'); // crea un div
        card.classList.add('form-container-tarjetas'); // al div card le agrega class form-container-tarjetas

        const datosTarjeta = ['Nombre', 'Direccion', 'DNI', 'Falla', 'Tecnico', 'Comentario'];

        datosTarjeta.forEach(function (dato, index) {
            const element = document.createElement('p'); // Crea el elemento p
            element.textContent = `${dato}:     ${tarjeta[index].toUpperCase()}`;
            card.appendChild(element); // Agrega el elemento p creado con dato: valor a card (div)
        });

        const btnEliminar = document.createElement('button'); // Crea el botón eliminar

        btnEliminar.textContent = 'Eliminar'; // Texto del botón
        btnEliminar.classList.add('boton-eliminar');
        btnEliminar.addEventListener('click', function () {
            eliminarTarjeta(index); // Llama a la función eliminarTarjeta con el índice de la tarjeta a eliminar
            mostrarTarjetas(); // Vuelve a mostrar las tarjetas actualizadas
        });

        card.appendChild(btnEliminar); // Agrega el botón eliminar a la tarjeta

        contenedorTarjetas.appendChild(card); // Agrega la tarjeta al contenedor
    });
}

function eliminarTarjetas() { // Función para eliminar todas las tarjetas almacenadas
    localStorage.removeItem('tarjetas');
    localStorage.removeItem('cantidadTarjetas');
    const contenedorTarjetas = document.getElementById('container-mostrar-tarjeta');
    contenedorTarjetas.innerHTML = ''; // Limpiar el contenedor 
}


function eliminarTarjeta(index) { // Función para eliminar una tarjeta específica
    const tarjetasString = localStorage.getItem('tarjetas');
    let tarjetasStorage = JSON.parse(tarjetasString);
    tarjetasStorage.splice(index, 1); // Elimina la tarjeta del array
    localStorage.setItem('tarjetas', JSON.stringify(tarjetasStorage)); // Actualiza el localStorage
}




function filtrarTarjetas() { // Función para filtrar y mostrar las tarjetas según los criterios de búsqueda
    const tarjetasString = localStorage.getItem('tarjetas'); // Obtiene las tarjetas almacenadas en localStorage
    const tarjetas = JSON.parse(tarjetasString); // Convierte las tarjetas de formato JSON a un array de JavaScript


    // obtiene los valores de los filtros y los convierte a mayúsculas para hacer la búsqueda insensible a mayúsculas y minúsculas
    const filtroNombre = document.getElementById('filtro-nombre').value.toUpperCase();
    const filtroDireccion = document.getElementById('filtro-direccion').value.toUpperCase();
    const filtroDNI = document.getElementById('filtro-dni').value.toUpperCase();
    const filtroFalla = document.getElementById('filtro-falla').value.toUpperCase();
    const filtroTecnico = document.getElementById('filtro-tecnico').value.toUpperCase();

    const contenedorTarjetas = document.getElementById('container-mostrar-tarjeta'); // obtiene el contenedor donde se mostrarán las tarjetas
    contenedorTarjetas.innerHTML = ''; // Limpia el contenedor antes de agregar las tarjetas


    // Iterar sobre cada tarjeta para comprobar si cumple con los criterios de búsqueda
    tarjetas.forEach(function (tarjeta) {
        if (tarjeta[0].toUpperCase().includes(filtroNombre)
            && tarjeta[1].toUpperCase().includes(filtroDireccion)
            && tarjeta[2].toUpperCase().includes(filtroDNI)
            && tarjeta[3].toUpperCase().includes(filtroFalla)
            && tarjeta[4].toUpperCase().includes(filtroTecnico)) {

            // Crear un elemento div para representar la tarjeta
            const card = document.createElement('div');
            card.classList.add('form-container-tarjetas'); // Agrega clase form-container-tarjetas al div de la tarjeta

            const datosTarjeta = ['Nombre', 'Dirección', 'DNI', 'Falla', 'Técnico', 'Comentario'];

            // Para cada dato de la tarjeta, crea un elemento p y lo agrega al div de la tarjeta
            datosTarjeta.forEach(function (dato, index) {
                const element = document.createElement('p');
                element.textContent = `${dato}: ${tarjeta[index].toUpperCase()}`;
                card.appendChild(element);
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

            contenedorTarjetas.appendChild(card); // Agrega la tarjeta al contenedor
        }
    });
}







