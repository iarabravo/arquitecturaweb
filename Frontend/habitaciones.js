// Función para obtener los parámetros de la URL
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  let roomCount = parseInt(params.get("rooms"), 10); // Obtener el número de habitaciones
  let peopleCount = parseInt(params.get("people"), 10); // Obtener el número de pasajeros
  
  // Validar que roomCount y peopleCount sean números positivos
  roomCount = isNaN(roomCount) || roomCount <= 0 ? 0 : roomCount;
  peopleCount = isNaN(peopleCount) || peopleCount <= 0 ? 0 : peopleCount;

  // Devuelve todos los parámetros necesarios
  return {
    checkIn: params.get("check-in"),
    checkOut: params.get("check-out"),
    roomCount,
    peopleCount
  };
}

async function loadRooms() {
const params = getQueryParams(); // Obtener los parámetros de la URL
const { checkIn, checkOut, roomCount, peopleCount } = params;

// Llamar a la función para obtener las habitaciones
const habitaciones = await getHabitaciones(checkIn, checkOut, peopleCount, roomCount);

// Mostrar los resultados en la página
const roomResultsContainer = document.getElementById("room-results");
roomResultsContainer.innerHTML = ""; // Limpiar resultados anteriores

if (habitaciones.length === 0) {
  roomResultsContainer.innerHTML = "<p>No hay habitaciones disponibles para estas fechas.</p>";
} else {
  habitaciones.forEach(habitacion => {
    const roomDiv = document.createElement("div");
    roomDiv.classList.add("room"); // Añadir una clase para estilos
    roomDiv.innerHTML = `
      <h3>Habitación ${habitacion.tipo}</h3>
      <p>ID: ${habitacion.id}</p>
      <p>Capacidad: ${habitacion.capacidad} persona/s</p>
      <p>Precio por noche: $${habitacion.precio}</p>
    `;
    roomResultsContainer.appendChild(roomDiv);
  });
}
}

window.onload = loadRooms;
document.getElementById("reservation-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevenir el envío normal del formulario

    // Capturar datos del formulario
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const dni = document.getElementById("dni").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    // Obtener los parámetros de la URL (por ejemplo, las habitaciones)
    const params = getQueryParams(); // Asumiendo que tienes esta función definida
    const { roomCount } = params; // Asumiendo que este es el número de habitaciones

    // Registrar al cliente
    const clienteResponse = await fetch("http://localhost:4000/clientes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nombre: firstName,
            apellido: lastName,
            email: email,
            dni: dni,
            telefono: phone,
            direccion: address
        })
    });

    if (!clienteResponse.ok) {
        const error = await clienteResponse.json();
        document.getElementById("reservation-result").innerText = "Error al registrar el cliente: " + error.message;
        return;
    }

    const clienteData = await clienteResponse.json(); // Obtener los datos del cliente registrado
    const clienteId = clienteData.id; // Suponiendo que el backend retorna el id del cliente

    // Registrar cada habitación
    const habitaciones = document.querySelectorAll(".room"); // Seleccionar las habitaciones mostradas
    for (let i = 0; i < roomCount; i++) {
        const habitacionId = habitaciones[i].querySelector("p").innerText.split(": ")[1]; // Obtener ID de la habitación

        const reservaResponse = await fetch("http://localhost:4000/reservas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                clienteId: clienteId,
                habitacionId: habitacionId,
                fechaInicio: params.checkIn,
                fechaFin: params.checkOut
            })
        });

        if (!reservaResponse.ok) {
            const error = await reservaResponse.json();
            document.getElementById("reservation-result").innerText += "Error al reservar la habitación " + habitacionId + ": " + error.message + "\n";
        } else {
            document.getElementById("reservation-result").innerText += "Reserva exitosa para la habitación " + habitacionId + ".\n";
        }
    }

    // Después de procesar todas las reservas, verificar si hay reservas exitosas y redirigir
    document.getElementById("reservation-result").innerText += "Redirigiendo a la página principal...";

    // Redirigir después de 2 segundos
    setTimeout(() => {
        window.location.href = "index.html"; 
    }, 2000); // Espera 2000 ms (2 segundos)
});
