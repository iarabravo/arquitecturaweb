const express = require ("express");
const morgan = require ("morgan");
const database = require ("./database");
const cors = require ("cors");

//Configuration inicial
const app = express();
app.set("port", 4000);
app.listen(app.get("port"));
console.log("Escuchando comunicaciones al puerto "+app.get("port"));

//Middlewares
app.use(cors({
    origin: ["http://127.0.0.1:5501", "http://127.0.0.1:5500"]
}));

app.use(morgan("dev"));
app.use(express.json());

//Rutas
app.get('/', function(request, response) {
    response.send("server funcionando!!");
});

app.get("/habitaciones", async (req, res) => {
    console.log("Ruta /habitaciones llamada");
    const connection = await database.getConnection();
    console.log("Conexión a la base de datos establecida");
    
    const tipo = req.query.tipo;
    const id = req.query.id;
    const disponible = req.query.disponible;
    const cantidadPersonas = req.query.cantidadPersonas;
    const fechaInicio = req.query.fechaInicio;
    const fechaFin = req.query.fechaFin;
    
    console.log("Tipo de habitación recibido: ", tipo);
    console.log("ID de habitación recibido: ", id);
    console.log("Disponibilidad recibida: ", disponible);
    console.log("Cantidad de personas recibida: ", cantidadPersonas);
    console.log("Fecha de inicio recibida: ", fechaInicio);
    console.log("Fecha de fin recibida: ", fechaFin);

    // Construcción de la consulta
    let query = `
        SELECT h.*, 
        CASE 
            WHEN r.habitacionId IS NOT NULL THEN 0 
            ELSE 1 
        END AS disponible 
        FROM HABITACION h 
        LEFT JOIN reserva r ON h.id = r.habitacionId 
        AND (
            (r.fechaInicio < ? AND r.fechaFin > ?) -- Reservas que cruzan las fechas solicitadas
        )
    `;
    const params = [fechaFin,fechaInicio]; // Fechas por defecto si no se reciben
    const conditions = [];

    // Agregar condición para la cantidad de personas
    if (cantidadPersonas) {
        if (isNaN(cantidadPersonas)) {
            return res.status(400).json({ error: "La cantidad de personas debe ser un número." });
        }
        conditions.push("h.capacidad >= ?");
        params.push(cantidadPersonas);
    }

    // Verificar si se proporciona un ID o tipo
    if (id) {
        conditions.push("h.id = ?");
        params.push(id);
        console.log("Condición de ID añadida a la consulta");
    }
    if (tipo) {
        conditions.push("h.tipo = ?");
        params.push(tipo);
        console.log("Condición de tipo añadida a la consulta");
    }
    
    // Validar el parámetro de disponibilidad solo si está definido
    if (disponible !== undefined) {
        if (disponible != 0 && disponible != 1) {
            return res.status(400).json({ error: "El valor de 'disponible' debe ser 0 o 1." });
        } else {
            if (disponible == 1) {
                conditions.push("disponible = 1");
            } else {
                conditions.push("disponible = 0");
            }
            console.log("Condición de disponibilidad añadida a la consulta");
        }
    }

    // Si hay condiciones, las añadimos a la consulta
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }
    
    try {
        console.log("Query: ", query);
        console.log("Params: ", params);

        const result = await connection.query(query, params);

        // Verificar si se encontraron resultados
        if (result.length === 0) {
            return res.status(404).json({ error: "No se encontró ninguna habitación disponible." });
        }
        res.set('Cache-Control', 'no-store');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    }
});

app.post("/habitaciones", async (req, res) => {
    console.log("Ruta /habitaciones (POST) llamada");
    connection = await database.getConnection();

    try {
        console.log("Conexión a la base de datos establecida");

        // Obtener los datos del cuerpo de la solicitud
        const { tipo, precio, capacidad } = req.body;
        console.log("Datos recibidos:", { tipo, precio, capacidad });

        // Verifica si todos los campos necesarios están presentes
        if (!tipo || !precio || !capacidad) {
            return res.status(400).json({ error: "Faltan datos requeridos: tipo, precio y capacidad son obligatorios." });
        }
        const disponible = 1;

        // Construir la consulta SQL
        const query = "INSERT INTO HABITACION (tipo, precio, disponible, capacidad) VALUES (?, ?, ?, ?)";
        const params = [tipo, parseFloat(precio), disponible, capacidad];
        console.log("Query: ", query);
        console.log("Params: ", params);

        // Ejecuta la consulta
        const result = await connection.query(query, params);
        res.status(201).json({ message: "Habitación creada exitosamente", id: result.insertId });
    } catch (error) {
        console.error("Error en la consulta a la base de datos:", error);
        res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    }
});

app.delete("/habitaciones/:id", async (req, res) => {
    console.log("Ruta /habitaciones (DELETE) llamada");
    connection = await database.getConnection();
    console.log("Conexión a la base de datos establecida");

    try {
        // Obtener el id de la habitación de los parámetros de la URL
        const { id } = req.params;
        console.log("ID de habitación recibido para borrar:", id);

        // Verificar si el id está presente
        if (!id) {
            return res.status(400).json({ error: "Falta el ID de la habitación" });
        }

        // Construir la consulta SQL para eliminar la habitación por su id
        const query = "DELETE FROM HABITACION WHERE id = ? AND disponible = 1";
        console.log("Query:", query);

        // Ejecutar la consulta
        const result = await connection.query(query, [id]);

        // Verificar si alguna fila fue afectada (si la habitación existía)
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Habitación no encontrada" });
        }

        res.status(200).json({ message: "Habitación eliminada exitosamente" });
    } catch (error) {
        console.error("Error en la consulta a la base de datos:", error);
        res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    }
});

app.get("/clientes",async(req,res)=>
    {
        console.log("Ruta /clientes llamada"); // Verificar llamada a la ruta
        const connection = await database.getConnection();
        console.log("Conexión a la base de datos establecida"); // Verificar conexión
        const dni = req.query.dni; // Parámetro para dni del cliente
        const nombre = req.query.nombre; // Parámetro para nombre del cliente
        const apellido = req.query.apellido; // Parámetro para apellido del cliente
        console.log("Dni del cliente recibido: ", dni); // Verificar dni recibido
        console.log("Nombre del cliente recibido: ", nombre); // Verificar nombre recibido
        console.log("Apellido del cliente recibido: ", apellido); // Verificar apellido recibido
        let query = "SELECT * FROM CLIENTE";
        const params = [];
        // Verificar si se proporciona un ID o dni
        if (nombre && apellido || apellido && nombre) {
            query += " WHERE nombre = ? AND apellido = ?";
            params.push(nombre,apellido);
            console.log("Condición de nombre y apellido añadida a la consulta"); // Verificar condición
        }
        else if (nombre) {
            query += " WHERE nombre = ?";
            params.push(nombre);
            console.log("Condición de nombre añadida a la consulta"); // Verificar condición
        }  
        else if (dni) {
            query += " WHERE dni = ?";
            params.push(dni);
            console.log("Condición de dni añadida a la consulta"); // Verificar condición
        } else if (apellido) {
            query += " WHERE apellido = ?";
            params.push(apellido);
            console.log("Condición de dni añadida a la consulta"); // Verificar condición
        }
        try {
            console.log("Query: ", query); // Ver la consulta SQL
            console.log("Params: ", params); // Ver parámetros
    
            const result = await connection.query(query, params);
            if (result.length === 0) {
                // Si no se encuentra, devolver mensaje de "no registrado"
                return res.status(404).json({ message: "Clientes no registrado" });
            }
            res.set('Cache-Control', 'no-store');
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        } 
});

app.post("/clientes", async (req, res) => {
        console.log("Ruta /clientes (POST) llamada");
        connection = await database.getConnection();

        try {
            console.log("Conexión a la base de datos establecida");
    
            // Obtener los datos del cuerpo de la solicitud
            const { nombre, apellido, dni, email, telefono, direccion } = req.body;
            console.log("Datos recibidos:", { nombre, apellido, dni, email, telefono, direccion });
    
            // Verifica si todos los campos necesarios están presentes
            if (!nombre || !apellido || !dni) {
                return res.status(400).json({ error: "Faltan datos requeridos: nombre, apellido y dni son obligatorios." });
            }
    
            // Construir la consulta SQL
            const query = "INSERT INTO CLIENTE (nombre, apellido, dni, email, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)";
            const params = [nombre, apellido, dni, email, telefono, direccion];
            console.log("Query: ", query);
            console.log("Params: ", params);
    
            // Ejecuta la consulta
            const result = await connection.query(query, params);
            res.status(201).json({ message: "Cliente creado exitosamente", id: result.insertId });
        } catch (error) {
            console.error("Error en la consulta a la base de datos:", error);
            res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        } 
});

app.delete("/clientes", async (req, res) => {
    console.log("Ruta /clientes (DELETE) llamada");
    connection = await database.getConnection();
    console.log("Conexión a la base de datos establecida");
    try {
        // Obtener los datos de la solicitud (pueden ser enviados en los parámetros de consulta o en el cuerpo)
        const { dni, nombre, apellido, id } = req.query;
        console.log("Datos recibidos:", { dni, nombre, apellido, id });

        // Verificar si al menos uno de los campos necesarios está presente
        if (!dni && !(nombre && apellido) && !id) {
            return res.status(400).json({ error: "Se requiere dni, nombre y apellido, o id para eliminar un cliente" });
        }

        // Construir la consulta SQL de forma dinámica
        let query = "DELETE FROM CLIENTE WHERE";
        const params = [];

        // Eliminar por `id`
        if (id) {
            query += " id = ?";
            params.push(id);
        }
        // Eliminar por `dni`
        else if (dni) {
            query += " dni = ?";
            params.push(dni);
        }
        // Eliminar por `nombre y apellido`
        else if (nombre && apellido) {
            query += " nombre = ? AND apellido = ?";
            params.push(nombre, apellido);
        }

        console.log("Query:", query);
        console.log("Params:", params);

        // Ejecutar la consulta
        const result = await connection.query(query, params);

        // Verificar si alguna fila fue afectada (si el cliente existía)
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }
        res.status(200).json({ message: "Cliente eliminado exitosamente" });
    } catch (error) {
        console.error("Error en la consulta a la base de datos:", error);
        res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    }
});

app.get("/reservas", async (req, res) => {
    console.log("Ruta /reservas llamada"); // Verificar llamada a la ruta
    const connection = await database.getConnection();
    console.log("Conexión a la base de datos establecida"); // Verificar conexión
    const id = req.query.id; // Parámetro para ID de reserva
    const clienteId = req.query.clienteId; // Parámetro para clienteId
    const habitacionId = req.query.habitacionId; // Parámetro para habitacionId
    console.log("ID de reserva recibido: ", id); // Verificar ID recibido
    console.log("ClienteID recibido: ", clienteId); // Verificar clienteId recibido
    console.log("HabitacionID recibido: ", habitacionId); // Verificar habitacionId recibido
    
    let query = `
        SELECT reserva.id, cliente.nombre, cliente.apellido, habitacion.tipo,reserva.fechaInicio,reserva.fechaFin
        FROM reserva
        JOIN cliente ON reserva.clienteId = cliente.id
        JOIN habitacion ON reserva.habitacionId = habitacion.id
    `;
    const params = [];
    const conditions = []; // Array para condiciones de filtrado

    // Verificar si se proporciona un ID de reserva
    if (id) {
        conditions.push("id = ?");
        params.push(id);
        console.log("Condición de ID añadida a la consulta"); // Verificar condición
    }

    // Verificar si se proporciona un clienteId
    if (clienteId) {
        conditions.push("clienteId = ?");
        params.push(clienteId);
        console.log("Condición de clienteId añadida a la consulta"); // Verificar condición
    }

    // Verificar si se proporciona un habitacionId
    if (habitacionId) {
        conditions.push("habitacionId = ?");
        params.push(habitacionId);
        console.log("Condición de habitacionId añadida a la consulta"); // Verificar condición
    }

    // Si hay condiciones, las añadimos a la consulta
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    try {
        console.log("Query: ", query); // Ver la consulta SQL
        console.log("Params: ", params); // Ver parámetros

        const result = await connection.query(query, params);

        // Verificar si se encontraron resultados
        if (result.length === 0) {
            return res.status(404).json({ error: "No se encontraron reservas." });
        }

        res.set('Cache-Control', 'no-store');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    } 
});

app.post("/reservas", async (req, res) => {
    console.log("Ruta /reservas (POST) llamada");
    const connection = await database.getConnection();

    try {
        console.log("Conexión a la base de datos establecida");

        // Obtener los datos del cuerpo de la solicitud
        const { clienteId, tipoHabitacion, fechaInicio, fechaFin } = req.body;
        console.log("Datos recibidos:", { clienteId, tipoHabitacion, fechaInicio, fechaFin });

        // Verifica si todos los campos necesarios están presentes
        if (!clienteId || !tipoHabitacion || !fechaInicio || !fechaFin) {
            return res.status(400).json({ error: "Faltan datos requeridos: clienteId, tipoHabitacion, fechaInicio y fechaFin son obligatorios." });
        }

        // Verificar habitaciones disponibles por tipo en el rango de fechas
        const availableRoomsQuery = `
            SELECT id FROM HABITACION 
            WHERE tipo = ? 
            AND disponible = 1 
            AND id NOT IN (
                SELECT habitacionId FROM reserva 
                WHERE 
                (fechaInicio <= ? AND fechaFin >= ?) OR 
                (fechaInicio <= ? AND fechaFin >= ?)
            )
            LIMIT 1
        `;
        const availableRoomsParams = [tipoHabitacion, fechaFin, fechaInicio, fechaInicio, fechaInicio];
        const availableRooms = await connection.query(availableRoomsQuery, availableRoomsParams);

        if (availableRooms.length === 0) {
            return res.status(400).json({ error: "No hay habitaciones disponibles del tipo seleccionado en las fechas elegidas." });
        }

        // Tomar el primer ID de habitación disponible
        const selectedRoomId = availableRooms[0].id;

        // Si hay habitaciones disponibles, proceder a la creación de la reserva
        const insertQuery = "INSERT INTO reserva (clienteId, habitacionId, fechaInicio, fechaFin) VALUES (?, ?, ?, ?)";
        const insertParams = [clienteId, selectedRoomId, fechaInicio, fechaFin];
        const result = await connection.query(insertQuery, insertParams);

        // Cambiar el estado de la habitación a no disponible
        const updateQuery = "UPDATE HABITACION SET disponible = 0 WHERE id = ?";
        await connection.query(updateQuery, [selectedRoomId]);

        res.status(201).json({ message: "Reserva creada exitosamente", id: result.insertId });
    } catch (error) {
        console.error("Error en la consulta a la base de datos:", error);
        res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    } 
});

app.delete("/reservas/:id", async (req, res) => {
    console.log("Ruta /reservas (DELETE) llamada");
    const connection = await database.getConnection();
    console.log("Conexión a la base de datos establecida");
    try {
        // Obtener el id de la reserva de los parámetros de la URL
        const { id } = req.params;
        console.log("ID de reserva recibido para borrar:", id);

        // Verificar si el id está presente
        if (!id) {
            return res.status(400).json({ error: "Falta el ID de la reserva" });
        }

        // Comprobar si la reserva existe
        const checkQuery = "SELECT * FROM reserva WHERE id = ?";
        const existingReservation = await connection.query(checkQuery, [id]);

        if (existingReservation.length === 0) {
            return res.status(404).json({ error: "Reserva no encontrada" });
        }

        // Eliminar la reserva
        const deleteQuery = "DELETE FROM reserva WHERE id = ?";
        const result = await connection.query(deleteQuery, [id]);

        // Cambiar el estado de la habitación a disponible
        const habitacionId = existingReservation[0].habitacionId;
        const updateQuery = "UPDATE HABITACION SET disponible = 1 WHERE id = ?";
        await connection.query(updateQuery, [habitacionId]);

        res.status(200).json({ message: "Reserva eliminada exitosamente" });
    } catch (error) {
        console.error("Error en la consulta a la base de datos:", error);
        res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    }
});
