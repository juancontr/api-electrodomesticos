const db = require('../config/dbConfig')
// se llama a la configuracion de la bd


class cliente{

    getClientes(callback){
        const sql = `SELECT id_cliente, documento, nombres, apellidos, correo, telefono, direccion, ciudad, fecha_registro FROM clientes
            ORDER BY id_cliente`;
        db.query(sql, callback);
    }


    getClienteById(id, callback){
        const sql = `SELECT id_cliente, documento, nombres, apellidos, correo, telefono, direccion, ciudad, fecha_registro FROM clientes
            WHERE id_cliente = ?`;
        db.query(sql, [id], callback);
    }


    postCliente(datos, callback){
        const sql = 'INSERT INTO clientes (documento, nombres, apellidos, correo, telefono, direccion, ciudad, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [datos.documento, datos.nombres, datos.apellidos, datos.correo, datos.telefono, datos.direccion, datos.ciudad, datos.fecha_registro], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }


    putCliente(id, datos, callback){
        const sql = 'UPDATE clientes SET documento = ?, nombres = ?, apellidos = ?, correo = ?, telefono = ?, direccion = ?, ciudad = ?, fecha_registro = ? WHERE id_cliente = ?';
        db.query(sql, [datos.documento, datos.nombres, datos.apellidos, datos.correo, datos.telefono, datos.direccion, datos.ciudad, datos.fecha_registro, id], callback);
    }


    deleteCliente(id, callback){
        const sql = 'DELETE FROM clientes WHERE id_cliente = ?';
        db.query(sql, [id], callback);
    }
}


module.exports = new cliente();
