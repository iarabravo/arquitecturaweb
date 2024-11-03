async function getClientes(){
    const res = await fetch("http://localhost:4000/clientes");
    const resJson = await res.json();
    return resJson;
}

// Función para crear un nuevo cliente
async function crearCliente(data) {
    const response = await fetch("http://localhost:4000/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error al crear el cliente: ${response.status}`);
    }

    const cliente = await response.json();
    return cliente; // Retorna el cliente creado
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