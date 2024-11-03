async function getHabitaciones_total() { 
    const res = await fetch("http://localhost:4000/habitaciones");
    const resJson = await res.json();
    console.log("Datos recibidos de la API:", resJson); // Verificar datos recibidos
    return resJson;
}

async function getHabitaciones(fechaInicio, fechaFin, cantidadPersonas, cantidadHabitaciones) {
    // Construir la URL con los parámetros necesarios
    const url = new URL("http://localhost:4000/habitaciones/disponibilidad");
    
    // Añadir los parámetros a la URL
    if (fechaInicio) url.searchParams.append("fechaInicio", fechaInicio);
    if (fechaFin) url.searchParams.append("fechaFin", fechaFin);
    if (cantidadPersonas) url.searchParams.append("cantidadPersonas", cantidadPersonas);
    if (cantidadHabitaciones) url.searchParams.append("cantidadHabitaciones", cantidadHabitaciones); // Añade este parámetro

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

let idHabitacionActual; // Asegúrate de que esta variable sea accesible globalmente

async function editarHabitaciones(id) {
    idHabitacionActual = id; // Almacena el ID de la habitación que se está editando
    try {
        const res = await fetch(`http://localhost:4000/habitaciones?id=${id}`);
        if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
        }
        const habitacion = await res.json();
        
        if (habitacion.length === 0) {
            alert('No se encontró la habitación con el ID especificado.');
            return;
        }

        const data = habitacion[0];
        document.getElementById('disponible-editar').value = data.disponible;

        // Mostrar el popup
        document.getElementById('popup-editar-habitacion').style.display = 'block';
    } catch (error) {
        console.error('Error al obtener los datos de la habitación:', error);
    }
}

async function guardarCambiosHabitacion() {
    const disponible = document.getElementById('disponible-editar').value;

    // Verificar que todos los campos estén llenos
    if (disponible === undefined) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const habitacionEditada = {
        disponible: parseInt(disponible, 10), // Asegúrate de convertir a número
    };

    try {
        // Asegúrate de usar el ID correcto
        const res = await fetch(`http://localhost:4000/habitaciones/${idHabitacionActual}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(habitacionEditada),
        });

        if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
        }

        alert("Habitación editada exitosamente");
        cerrarPopupEditar(); // Cerrar el popup
        location.reload(); // Recargar la página para ver los cambios
    } catch (error) {
        console.error('Error al guardar los cambios de la habitación:', error);
        alert("No se pudo guardar los cambios.");
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