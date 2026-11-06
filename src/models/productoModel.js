const db = require('../config/dbConfig')
// se llama a la configuracion de la bd


class producto{

    getProductos(callback){
        const sql = `SELECT p.id_producto, p.codigo_sku, p.nombre, p.precio, p.stock, p.garantia_meses,
                   p.id_categoria, c.nombre AS categoria,
                   p.id_marca, m.nombre AS marca,
                   p.id_proveedor, pr.razon_social AS proveedor
            FROM productos p
            JOIN categorias c ON c.id_categoria = p.id_categoria
            JOIN marcas m ON m.id_marca = p.id_marca
            LEFT JOIN proveedores pr ON pr.id_proveedor = p.id_proveedor
            ORDER BY p.id_producto`;
        db.query(sql, callback);
    }


    getProductoById(id, callback){
        const sql = `SELECT p.id_producto, p.codigo_sku, p.nombre, p.precio, p.stock, p.garantia_meses,
                   p.id_categoria, c.nombre AS categoria,
                   p.id_marca, m.nombre AS marca,
                   p.id_proveedor, pr.razon_social AS proveedor
            FROM productos p
            JOIN categorias c ON c.id_categoria = p.id_categoria
            JOIN marcas m ON m.id_marca = p.id_marca
            LEFT JOIN proveedores pr ON pr.id_proveedor = p.id_proveedor
            WHERE p.id_producto = ?`;
        db.query(sql, [id], callback);
    }


    postProducto(datos, callback){
        const sql = 'INSERT INTO productos (codigo_sku, nombre, precio, stock, garantia_meses, id_categoria, id_marca, id_proveedor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [datos.codigo_sku, datos.nombre, datos.precio, datos.stock, datos.garantia_meses, datos.id_categoria, datos.id_marca, datos.id_proveedor], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }


    putProducto(id, datos, callback){
        const sql = 'UPDATE productos SET codigo_sku = ?, nombre = ?, precio = ?, stock = ?, garantia_meses = ?, id_categoria = ?, id_marca = ?, id_proveedor = ? WHERE id_producto = ?';
        db.query(sql, [datos.codigo_sku, datos.nombre, datos.precio, datos.stock, datos.garantia_meses, datos.id_categoria, datos.id_marca, datos.id_proveedor, id], callback);
    }


    deleteProducto(id, callback){
        const sql = 'DELETE FROM productos WHERE id_producto = ?';
        db.query(sql, [id], callback);
    }
}


module.exports = new producto();
