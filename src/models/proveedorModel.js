const db = require('../config/dbConfig')


class proveedor{

    getProveedores(callback){
        const sql = `SELECT id_proveedor, nit, razon_social, telefono, correo, ciudad FROM proveedores
            ORDER BY id_proveedor`;
        db.query(sql, callback);
    }


    getProveedorById(id, callback){
        const sql = `SELECT id_proveedor, nit, razon_social, telefono, correo, ciudad FROM proveedores
            WHERE id_proveedor = ?`;
        db.query(sql, [id], callback);
    }


    postProveedor(datos, callback){
        const sql = 'INSERT INTO proveedores (nit, razon_social, telefono, correo, ciudad) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [datos.nit, datos.razon_social, datos.telefono, datos.correo, datos.ciudad], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }


    putProveedor(id, datos, callback){
        const sql = 'UPDATE proveedores SET nit = ?, razon_social = ?, telefono = ?, correo = ?, ciudad = ? WHERE id_proveedor = ?';
        db.query(sql, [datos.nit, datos.razon_social, datos.telefono, datos.correo, datos.ciudad, id], callback);
    }


    deleteProveedor(id, callback){
        const sql = 'DELETE FROM proveedores WHERE id_proveedor = ?';
        db.query(sql, [id], callback);
    }
}


module.exports = new proveedor();
