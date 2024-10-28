async function getClientes(){
    const res = await fetch("http://localhost:4000/clientes");
    const resJson = await res.json();
    return resJson;
}

async function eliminarClientes(id) {
    try {
        const res = await fetch(`http://localhost:4000/clientes/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
        }

        // Mensaje de confirmación
        alert('Cliente eliminado exitosamente'); 

        // Recargar la página
        location.reload(); // Recarga la página
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        alert('No se pudo eliminar el cliente'); // Manejo de errores
    }
}