const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    connectionLimit: 4,
    dateStrings: true
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
