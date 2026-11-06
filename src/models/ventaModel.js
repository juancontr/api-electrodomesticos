const db = require('../config/dbConfig')
// se llama a la configuracion de la bd


class venta{

    getVentas(callback){
        const sql = `SELECT v.id_venta, v.numero_factura, v.id_cliente,
                   cl.nombres AS cliente_nombres, cl.apellidos AS cliente_apellidos,
                   v.fecha_venta, v.metodo_pago, v.estado,
                   (SELECT COALESCE(SUM(d.cantidad * d.precio_unitario), 0)
                      FROM detalle_ventas d WHERE d.id_venta = v.id_venta) AS total
            FROM ventas v
            JOIN clientes cl ON cl.id_cliente = v.id_cliente
            ORDER BY v.id_venta`;
        db.query(sql, callback);
    }


    getVentaById(id, callback){
        const sql = `SELECT v.id_venta, v.numero_factura, v.id_cliente,
                   cl.nombres AS cliente_nombres, cl.apellidos AS cliente_apellidos,
                   v.fecha_venta, v.metodo_pago, v.estado,
                   (SELECT COALESCE(SUM(d.cantidad * d.precio_unitario), 0)
                      FROM detalle_ventas d WHERE d.id_venta = v.id_venta) AS total
            FROM ventas v
            JOIN clientes cl ON cl.id_cliente = v.id_cliente
            WHERE v.id_venta = ?`;
        db.query(sql, [id], callback);
    }


    postVenta(datos, callback){
        const sql = 'INSERT INTO ventas (numero_factura, id_cliente, fecha_venta, metodo_pago, estado) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [datos.numero_factura, datos.id_cliente, datos.fecha_venta, datos.metodo_pago, datos.estado], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }


    putVenta(id, datos, callback){
        const sql = 'UPDATE ventas SET numero_factura = ?, id_cliente = ?, fecha_venta = ?, metodo_pago = ?, estado = ? WHERE id_venta = ?';
        db.query(sql, [datos.numero_factura, datos.id_cliente, datos.fecha_venta, datos.metodo_pago, datos.estado, id], callback);
    }


    deleteVenta(id, callback){
        const sql = 'DELETE FROM ventas WHERE id_venta = ?';
        db.query(sql, [id], callback);
    }
}


module.exports = new venta();
