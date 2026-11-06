const db = require('../config/dbConfig')
// se llama a la configuracion de la bd


class categoria{

    getCategorias(callback){
        const sql = `SELECT id_categoria, nombre, descripcion FROM categorias
            ORDER BY id_categoria`;
        db.query(sql, callback);
    }


    getCategoriaById(id, callback){
        const sql = `SELECT id_categoria, nombre, descripcion FROM categorias
            WHERE id_categoria = ?`;
        db.query(sql, [id], callback);
    }


    postCategoria(datos, callback){
        const sql = 'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)';
        db.query(sql, [datos.nombre, datos.descripcion], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }


    putCategoria(id, datos, callback){
        const sql = 'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?';
        db.query(sql, [datos.nombre, datos.descripcion, id], callback);
    }


    deleteCategoria(id, callback){
        const sql = 'DELETE FROM categorias WHERE id_categoria = ?';
        db.query(sql, [id], callback);
    }
}


module.exports = new categoria();
