const contenedorHabitaciones = document.getElementById("habitaciones-container");
const searchBtn = document.querySelector('.content nav form .form-input button');
const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
const searchForm = document.querySelector('.content nav form');
const menuBar = document.querySelector('.content nav .bx.bx-menu');
const sideBar = document.querySelector('.sidebar');
const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');
const toggler = document.getElementById('theme-toggle');
const logoutBtn = document.getElementById('logout-btn');
const contenedorClientes = document.getElementById("clientes-container");
const contenedorReservas = document.getElementById("reservas-container");

// Verifica si el usuario está logueado
if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'login.html'; // Redirige a la página de login
}

sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', () => {
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});

menuBar.addEventListener('click', () => {
    sideBar.classList.toggle('close');
});

searchBtn.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault;
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchBtnIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchBtnIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        sideBar.classList.add('close');
    } else {
        sideBar.classList.remove('close');
    }
    if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
});

toggler.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

logoutBtn.addEventListener('click', () => {
    // Elimina el estado de sesión
    localStorage.removeItem('isLoggedIn');
    // Redirige a la página de login
    window.location.href = 'login.html';
});

// Función para mostrar una sección y ocultar las demás
function showSection(sectionId, element) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
    });
    // Mostrar la sección seleccionada
    const activeSection = document.getElementById(sectionId);
        activeSection.classList.add('active');
        activeSection.style.display = 'block';
    // Eliminar la clase active de todos los elementos del menú
    const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => item.classList.remove('active'));
    // Agregar la clase active al elemento seleccionado
        element.parentElement.classList.add('active');
}

// Mostrar por defecto la sección Dashboard al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    showSection('dashboard');
});

// Evento de clic para cerrar sesión
document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('isLoggedIn'); // Elimina la sesión del usuario
        window.location.href = 'index.html'; // Redirige a la página de login
});

// Mostrar por defecto la sección Dashboard al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    showSection('dashboard');
});

// Verifica si el usuario está logueado
if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'login.html'; // Redirige si no está logueado
} else {
    document.getElementById('loading').style.display = 'none'; // Oculta el mensaje de carga
    document.querySelector('.sidebar').style.display = 'block'; // Muestra la barra lateral
    document.querySelector('.content').style.display = 'block'; // Muestra el contenido
}

//Listar habitaciones
function crearTarjetaHabitacionesInicio(habitaciones) {
    habitaciones.forEach(habitacion => {
        const nuevaHabitacion = document.createElement("div");
        
        // Determinamos el texto y la clase de la tarjeta según la disponibilidad
        const disponibilidadTexto = habitacion.disponible === 1 ? "Disponible" : "No disponible";
        const claseDisponibilidad = habitacion.disponible === 1 ? "disponible" : "no-disponible";

        nuevaHabitacion.classList.add("tarjeta-habitacion", claseDisponibilidad); // Añadimos ambas clases
        nuevaHabitacion.innerHTML = `
            <h3>Habitación: ${habitacion.id}</h3>
            <p>Tipo: ${habitacion.tipo}</p>
            <p>${disponibilidadTexto}</p>
            <td><button onclick="eliminarHabitaciones(${habitacion.id})">Eliminar</button></td>
        `;
        contenedorHabitaciones.appendChild(nuevaHabitacion);
    });
}
getHabitaciones().then(habitaciones=>{
    crearTarjetaHabitacionesInicio(habitaciones);
})

//Listar Clientes
function crearClientes(clientes) {
    const contenedorClientes = document.getElementById("clientes-container");

    // Crear la estructura de la tabla
    const tabla = document.createElement("table");

    // Crear el encabezado de la tabla
    tabla.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Apellido</th>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Direccion</th>
                <th></th>
            </tr>
        </thead>
        <tbody id="tabla-clientes-body">
            <!-- Aquí se insertarán las filas dinámicamente -->
        </tbody>
    `;

    // Agregar la tabla al contenedor
    contenedorClientes.appendChild(tabla);

    // Obtener el cuerpo de la tabla para insertar las filas
    const cuerpoTabla = document.getElementById("tabla-clientes-body");

    // Crear las filas de la tabla con los datos de los clientes
    clientes.forEach(cliente => {
        const nuevaFila = document.createElement("tr");

        nuevaFila.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.apellido}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.dni}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.direccion}</td>
            <td><button onclick="eliminarCliente(${cliente.id})">Eliminar</button></td>
        `;

        // Agregar la nueva fila al cuerpo de la tabla
        cuerpoTabla.appendChild(nuevaFila);
    });
}

getClientes().then(clientes => {
    crearClientes(clientes);
});

//Listar Reservas
function crearReservas(reservas) {
    const contenedorReservas = document.getElementById("reservas-container");

    // Crear la estructura de la tabla
    const tablaReserva = document.createElement("table");

    // Crear el encabezado de la tabla
    tablaReserva.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre Cliente</th>
                <th>Apellido Cliente</th>
                <th>Tipo de Habitación</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th></th>
            </tr>
        </thead>
        <tbody id="tabla-reservas-body">
            <!-- Aquí se insertarán las filas dinámicamente -->
        </tbody>
    `;

    // Agregar la tabla al contenedor
    contenedorReservas.appendChild(tablaReserva);

    // Obtener el cuerpo de la tabla para insertar las filas
    const cuerpoTabla = document.getElementById("tabla-reservas-body");
    cuerpoTabla.innerHTML = ''; // Limpiar filas previas

    // Crear las filas de la tabla con los datos de los clientes
    reservas.forEach(reserva => {
        const nuevaFila = document.createElement("tr");

        nuevaFila.innerHTML = `
            <td>${reserva.id}</td>
            <td>${reserva.nombre}</td>
            <td>${reserva.apellido}</td>
            <td>${reserva.tipo}</td>
            <td>${reserva.fechaInicio}</td>
            <td>${reserva.fechaFin}</td>
            <td><button onclick="eliminarReserva(${reserva.id})">Eliminar</button></td>
        `;
        // Agregar la nueva fila al cuerpo de la tabla
        cuerpoTabla.appendChild(nuevaFila);
    });
}

// Llamada para obtener los clientes y crear la tabla
getReservas().then(reservas => {
    crearReservas(reservas);
});

//Agregar habitacion
const precios = {
    individual: 70000,
    doble: 110000,
    familiar: 180000,
    suite: 250000
};

const capacidades = {
    individual: 1,
    doble: 2,
    familiar: 4,
    suite: 4
};

// Mostrar popup para agregar habitación
document.getElementById('agregar-habitacion').onclick = function() {
    document.getElementById('popup-agregar-habitacion').style.display = 'block';
};

// Cambiar precio y capacidad según el tipo de habitación seleccionado
document.getElementById('tipo').onchange = function() {
    const tipo = this.value;
    if (tipo) {
        document.getElementById('precio').querySelector('span').textContent = precios[tipo];
        document.getElementById('capacidad').querySelector('span').textContent = capacidades[tipo];
    } else {
        document.getElementById('precio').querySelector('span').textContent = '';
        document.getElementById('capacidad').querySelector('span').textContent = '';
    }
};

// Cerrar popup
function cerrarPopup() {
    document.getElementById('popup-agregar-habitacion').style.display = 'none';
}

