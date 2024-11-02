async function getReservas(){
    const res = await fetch("http://localhost:4000/reservas");
    const resJson = await res.json();
    return resJson;
}

async function eliminarReserva(id) {
    try {
        const res = await fetch(`http://localhost:4000/reservas/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
        }

        // Mensaje de confirmación
        alert('Reserva eliminada exitosamente'); 

        // Recargar la página
        location.reload(); // Recarga la página
    } catch (error) {
        console.error('Error al eliminar la reserva:', error);
        alert('No se pudo eliminar la reserva'); // Manejo de errores
    }
}