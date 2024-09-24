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
}))
app.use(morgan("dev"));
app.use(express.json());

//Rutas

app.get("/habitaciones",async(req,res)=>
{
    console.log("Ruta /habitaciones llamada"); // Verificar llamada a la ruta
    const connection = await database.getConnection();
    console.log("Conexión a la base de datos establecida"); // Verificar conexión
    const tipo = req.query.tipo; // Parámetro para tipo de habitación
    const id = req.query.id; // Parámetro para ID de habitación
    console.log("Tipo de habitación recibido: ", tipo); // Verificar tipo recibido
    console.log("ID de habitación recibido: ", id); // Verificar ID recibido
    let query = "SELECT * FROM HABITACION";
    const params = [];
    // Verificar si se proporciona un ID o tipo
    if (id) {
        query += " WHERE id = ?";
        params.push(id);
        console.log("Condición de ID añadida a la consulta"); // Verificar condición
    } else if (tipo) {
        query += " WHERE tipo = ?";
        params.push(tipo);
        console.log("Condición de tipo añadida a la consulta"); // Verificar condición
    }
    try {
        console.log("Query: ", query); // Ver la consulta SQL
        console.log("Params: ", params); // Ver parámetros

        const result = await connection.query(query, params);
        res.set('Cache-Control', 'no-store');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    } 

})

app.get('/', function(request, response) {

    response.send("server funcionando!!");

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
        if (nombre) {
            query += " WHERE nombre = ?";
            params.push(id);
            console.log("Condición de nombre añadida a la consulta"); // Verificar condición
        } else if (dni) {
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
            res.set('Cache-Control', 'no-store');
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        } 
    
    })

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
    




