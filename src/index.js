const express = require ("express");
const morgan = require ("morgan");

//Configuration
const app = express();
app.set("port", 4000);
app.use(morgan("dev"));
app.listen(app.get("port"));
console.log("Escuchando comunicaciones al puerto "+app.get("port"));

//Middlewares
app.get("/productos",(req,res)=>
{
    res.send("Mensaje recibido")
})