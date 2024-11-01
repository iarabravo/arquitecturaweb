async function getHabitaciones(){
    const res = await fetch("http://localhost:4000/habitaciones");
    const resJson = await res.json();
    return resJson;
}

async function getHabitaciones(fechaInicio, fechaFin, cantidadPersonas) {
    // Construir la URL con los parámetros necesarios
    const url = new URL("http://localhost:4000/habitaciones");
    
    // Añadir los parámetros a la URL
    if (fechaInicio) url.searchParams.append("fechaInicio", fechaInicio);
    if (fechaFin) url.searchParams.append("fechaFin", fechaFin);
    if (cantidadPersonas) url.searchParams.append("cantidadPersonas", cantidadPersonas);
    
    try {
        const res = await fetch(url);
        
        // Verificar si la respuesta fue exitosa
        if (!res.ok) {
            throw new Error(`Error en la petición: ${res.status}`);
        }

        const resJson = await res.json();
        return resJson; // Retornar el JSON de la respuesta
    } catch (error) {
        console.error("Error al obtener las habitaciones:", error);
        throw error; // Propagar el error
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