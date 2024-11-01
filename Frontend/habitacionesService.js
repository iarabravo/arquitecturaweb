// Función para obtener los parámetros de la URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const guestCounts = []; // Para almacenar la cantidad de pasajeros por habitación
    let roomCount = parseInt(params.get("rooms"), 10); // Obtener el número de habitaciones y convertir a número
  
    // Validar que roomCount sea un número positivo
    if (isNaN(roomCount) || roomCount <= 0) {
        roomCount = 0;
    }
  
    // Recoger la cantidad de pasajeros para cada habitación
    for (let i = 1; i <= roomCount; i++) {
        // Cambiar a `people-room${i}` para que coincida con los parámetros de la URL
        const guestCount = parseInt(params.get(`people-room${i}`), 10);
          
        // Agregar solo valores válidos
        guestCounts.push(isNaN(guestCount) ? 0 : guestCount); 
    }
  
    // Mostrar roomCount y guestCounts en la página
    document.getElementById("room-count-display").textContent = `Número de habitaciones: ${roomCount}`;
    document.getElementById("guest-counts-display").textContent = `Pasajeros por habitación: ${guestCounts.join(", ")}`;
  
    // Devuelve todos los parámetros necesarios
    return {
        checkIn: params.get("check-in"),
        checkOut: params.get("check-out"),
        roomCount,
        guestCounts
    };
}
// Llamar a la función para obtener y mostrar los parámetros
getQueryParams();

async function getHabitaciones(){
    const res = await fetch("http://localhost:4000/habitaciones");
    const resJson = await res.json();
    return resJson;
}

async function getHabitaciones(fechaInicio, fechaFin, cantidadPersonas) {
    const url = `http://localhost:4000/habitaciones?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&cantidadPersonas=${cantidadPersonas}`;
    try {
        const res = await fetch(url);
        
        console.log("Response status:", res.status); // Agrega esta línea para depurar
        console.log("Response URL:", res.url); // Agrega esta línea para ver la URL solicitada

        if (!res.ok) {
            throw new Error(`Error en la solicitud: ${res.status} ${res.statusText}`);
        }

        const resJson = await res.json();
        return resJson; // Devuelve el resultado de la consulta
    } catch (error) {
        console.error("Error al obtener habitaciones:", error);
        throw error; // Lanza el error para que se maneje en el lugar donde se llama la función
    }
}

async function eliminarHabitaciones(id) {
    try {
        const res = await fetch(`http://localhost:4000/habitaciones/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
        }

        // Mensaje de confirmación
        alert('Habitacion eliminada exitosamente'); 

        // Recargar la página
        location.reload(); // Recarga la página
    } catch (error) {
        console.error('Error al eliminar la habitacion:', error);
        alert('No se pudo eliminar la habitacion'); // Manejo de errores
    }
}

async function agregarHabitacion() {
    const tipo = document.getElementById('tipo').value;
    const precio = precios[tipo];
    const capacidad = capacidades[tipo];

    if (!tipo) {
        alert("Por favor, selecciona un tipo de habitación.");
        return;
    }

    try {
        const res = await fetch("http://localhost:4000/habitaciones", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tipo, precio, capacidad })
        });

        if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
        }

        alert('Habitación agregada exitosamente');
        cerrarPopup();
        location.reload();
        // Aquí puedes agregar una función para recargar las habitaciones si es necesario
    } catch (error) {
        console.error('Error al agregar la habitación:', error);
        alert('No se pudo agregar la habitación');
    }
}