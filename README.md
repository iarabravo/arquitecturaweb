# Sistema de Gestión Hotelera

## Descripción
Este proyecto es una API diseñada para gestionar las operaciones diarias de un hotel. Permite realizar tareas como:

* **Reservas:** Crear, modificar y cancelar reservas de habitaciones.
* **Habitaciones:** Gestionar la disponibilidad de habitaciones, sus características y precios.
* **Clientes:** Registrar y administrar la información de los clientes.
* **Facturas:** Generar facturas por las estancias de los clientes.

## Modelado de Datos (DER)
* El modelo de datos incluye las siguientes entidades:

* Clientes: Información del cliente (ID, nombre, apellido, dirección, etc.)
* Habitaciones: Detalles de las habitaciones (ID, tipo, precio, estado de disponibilidad, etc.)
* Reservas: Información sobre las reservas (ID, ID del cliente, ID de la habitación, fechas de check-in y check-out, estado, etc.)
* Facturas: Detalles de las facturas generadas (ID, ID de la reserva, monto total, fecha de emisión, etc.)

## Estructura de Clases (OOP)
* Clases Principales
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