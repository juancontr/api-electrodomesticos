const mysql = require('mysql2');

// Los datos de conexion se leen de las variables de entorno:
// en local desde el archivo .env y en Render desde el panel "Environment".
// Se usa un pool de conexiones para que la API no se caiga si la nube cierra una conexion inactiva.
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    connectionLimit: 4,     // el plan gratis de Clever Cloud permite pocas conexiones simultaneas
    dateStrings: true       // las fechas llegan como texto: "2026-08-01 10:15:00"
});

db.getConnection((err, connection)=>{
    if(err){
        console.log("Error al conectar con MySQL: " + err.message);
        return;
    }
    console.log("Conexion MYSQL exitosa");
    connection.release();
});

module.exports = db;
