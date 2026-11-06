const db = require('../config/dbConfig')
// se llama a la configuracion de la bd


class detalleVenta{

    getDetalleVentas(callback){
        const sql = `SELECT d.id_detalle, d.id_venta, v.numero_factura,
                   d.id_producto, p.nombre AS producto,
                   d.cantidad, d.precio_unitario,
                   (d.cantidad * d.precio_unitario) AS subtotal
            FROM detalle_ventas d
            JOIN ventas v ON v.id_venta = d.id_venta
            JOIN productos p ON p.id_producto = d.id_producto
            ORDER BY d.id_detalle`;
        db.query(sql, callback);
    }


    getDetalleVentaById(id, callback){
        const sql = `SELECT d.id_detalle, d.id_venta, v.numero_factura,
                   d.id_producto, p.nombre AS producto,
                   d.cantidad, d.precio_unitario,
                   (d.cantidad * d.precio_unitario) AS subtotal
            FROM detalle_ventas d
            JOIN ventas v ON v.id_venta = d.id_venta
            JOIN productos p ON p.id_producto = d.id_producto
            WHERE d.id_detalle = ?`;
        db.query(sql, [id], callback);
    }


    postDetalleVenta(datos, callback){
        const sql = 'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)';
        db.query(sql, [datos.id_venta, datos.id_producto, datos.cantidad, datos.precio_unitario], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }


    putDetalleVenta(id, datos, callback){
        const sql = 'UPDATE detalle_ventas SET id_venta = ?, id_producto = ?, cantidad = ?, precio_unitario = ? WHERE id_detalle = ?';
        db.query(sql, [datos.id_venta, datos.id_producto, datos.cantidad, datos.precio_unitario, id], callback);
    }


    deleteDetalleVenta(id, callback){
        const sql = 'DELETE FROM detalle_ventas WHERE id_detalle = ?';
        db.query(sql, [id], callback);
    }
}


module.exports = new detalleVenta();
