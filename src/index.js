const express = require ("express");
const morgan = require ("morgan");

//Configuration inicial
const app = express();
app.set("port", 4000);
app.listen(app.get("port"));
console.log("Escuchando comunicaciones al puerto "+app.get("port"));

//Middlewares

app.use(morgan("dev"));

//Rutas
app.get("/productos",(req,res)=>
{
    res.send("Mensaje recibido")
})