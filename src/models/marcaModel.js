const db = require('../config/dbConfig')


class marca{

    getMarcas(callback){
        const sql = `SELECT id_marca, nombre, pais_origen FROM marcas
            ORDER BY id_marca`;
        db.query(sql, callback);
    }


    getMarcaById(id, callback){
        const sql = `SELECT id_marca, nombre, pais_origen FROM marcas
            WHERE id_marca = ?`;
        db.query(sql, [id], callback);
    }


    postMarca(datos, callback){
        const sql = 'INSERT INTO marcas (nombre, pais_origen) VALUES (?, ?)';
        db.query(sql, [datos.nombre, datos.pais_origen], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }


    putMarca(id, datos, callback){
        const sql = 'UPDATE marcas SET nombre = ?, pais_origen = ? WHERE id_marca = ?';
        db.query(sql, [datos.nombre, datos.pais_origen, id], callback);
    }


    deleteMarca(id, callback){
        const sql = 'DELETE FROM marcas WHERE id_marca = ?';
        db.query(sql, [id], callback);
    }
}


module.exports = new marca();
