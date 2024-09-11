# __Sistema de Gestión Hotelera__
![hotel](https://rockonrr.com/wp-content/uploads/2021/02/Booking-Appointment.png)

## _Descripción_
Este proyecto es una API diseñada para gestionar las operaciones diarias de un hotel. Permite realizar tareas como:

1. **Reservas:** Crear, modificar y cancelar reservas de habitaciones.
2. **Habitaciones:** Gestionar la disponibilidad de habitaciones, sus características y precios.
3. **Clientes:** Registrar y administrar la información de los clientes.
4. **Facturas:** Generar facturas por las estancias de los clientes.

## _Modelado de Datos (DER)_
El modelo de datos incluye las siguientes entidades:

* Clientes: Información del cliente (ID, nombre, apellido, dirección, etc.)
* Habitaciones: Detalles de las habitaciones (ID, tipo, precio, estado de disponibilidad, etc.)
* Reservas: Información sobre las reservas (ID, ID del cliente, ID de la habitación, fechas de check-in y check-out, estado, etc.)
* Facturas: Detalles de las facturas generadas (ID, ID de la reserva, monto total, fecha de emisión, etc.)

## _Estructura de Clases (OOP)_
Clases Principales
* Cliente:
    * Atributos: id, nombre, apellido, email, telefono, direccion
    * Métodos: registrar(), actualizar(), eliminar()
* Habitacion:
    * Atributos: id, tipo, precio, disponible
    * Métodos: actualizarDisponibilidad(), actualizarPrecio()
* Reserva:
    * Atributos: id, clienteId, habitacionId, fechaInicio, fechaFin, estado
    * Métodos: crear(), modificar(), cancelar()
* Factura:
    * Atributos: id, reservaId, montoTotal, fechaEmision
    * Métodos: generar(), actualizar()

## _Endpoints de la API_
Clientes
* Registrar cliente
    * URL: /api/clientes
    * Método: POST
    * Descripción: Crea un nuevo cliente.
    * Body:
        `{
        "nombre": "Juan",
        "apellido": "Pérez",
        "email": "juan.perez@example.com",
        "telefono": "123456789",
        "direccion": "Calle Falsa 123"
        }`
    * Respuesta exitosa:
        * Codigo: 201 Created
        * Body:   
            `{
            "id": 1,
            "nombre": "Juan",
            "apellido": "Pérez",
            "email": "juan.perez@example.com",
            "telefono": "123456789",
            "direccion": "Calle Falsa 123"
            }`

* Obtener todos los clientes
    * URL: /api/clientes
    * Método: GET
    * Descripción: Devuelve una lista de todos los clientes.
    * Respuesta exitosa:
        * Codigo: 200 OK
        * Body: 
            `{
                "id": 1,
                "nombre": "Juan",
                "apellido": "Pérez",
                "email": "juan.perez@example.com",
                "telefono": "123456789",
                "direccion": "Calle Falsa 123"
            }`




        
