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