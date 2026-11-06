const proveedorModel = require('../models/proveedorModel')
// se realiza llamado al modelo


// Reglas de validacion de los datos que llegan en el body
const reglas = [
    { campo: 'nit', tipo: 'texto', max: 15, requerido: true },
    { campo: 'razon_social', tipo: 'texto', max: 120, requerido: true },
    { campo: 'telefono', tipo: 'texto', max: 20, requerido: true },
    { campo: 'correo', tipo: 'correo', max: 120, requerido: true },
    { campo: 'ciudad', tipo: 'texto', max: 60, requerido: true }
];


// Revisa los datos recibidos y devuelve la lista de errores encontrados
function validar(datos){
    const errores = [];

    reglas.forEach((regla)=>{
        const valor = datos[regla.campo];
        const vacio = valor === undefined || valor === null || String(valor).trim() === '';

        if(vacio){
            if(regla.requerido){
                errores.push(`El campo ${regla.campo} es obligatorio`);
            }
            return;
        }

        const numero = Number(valor);

        switch(regla.tipo){
            case 'texto':
                if(typeof valor !== 'string' || valor.trim().length > regla.max){
                    errores.push(`El campo ${regla.campo} debe ser texto de máximo ${regla.max} caracteres`);
                }
                break;
            case 'correo':
                if(typeof valor !== 'string' || valor.length > regla.max || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())){
                    errores.push(`El campo ${regla.campo} debe ser un correo válido`);
                }
                break;
            case 'entero':
                if(typeof valor === 'boolean' || !Number.isInteger(numero) || numero < regla.min){
                    errores.push(`El campo ${regla.campo} debe ser un número entero mayor o igual a ${regla.min}`);
                }
                break;
            case 'numero':
                if(typeof valor === 'boolean' || !Number.isFinite(numero) || numero <= 0){
                    errores.push(`El campo ${regla.campo} debe ser un número mayor que 0`);
                }
                break;
            case 'fecha':
                if(!/^\d{4}-\d{2}-\d{2}$/.test(valor) || isNaN(Date.parse(valor))){
                    errores.push(`El campo ${regla.campo} debe tener el formato AAAA-MM-DD`);
                }
                break;
            case 'fechahora':
                if(!/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(valor) || isNaN(Date.parse(valor.replace(' ', 'T')))){
                    errores.push(`El campo ${regla.campo} debe tener el formato AAAA-MM-DD HH:MM:SS`);
                }
                break;
            case 'opcion':
                if(!regla.opciones.includes(valor)){
                    errores.push(`El campo ${regla.campo} debe ser uno de: ${regla.opciones.join(', ')}`);
                }
                break;
        }
    });

    return errores;
}


// Toma solo los campos de la tabla y los deja limpios para guardarlos
function obtenerDatos(body){
    const datos = {};

    reglas.forEach((regla)=>{
        const valor = body[regla.campo];
        const vacio = valor === undefined || valor === null || String(valor).trim() === '';

        if(vacio){
            datos[regla.campo] = regla.porDefecto !== undefined ? regla.porDefecto : null;
        } else if(regla.tipo === 'entero' || regla.tipo === 'numero'){
            datos[regla.campo] = Number(valor);
        } else {
            datos[regla.campo] = String(valor).trim();
        }
    });

    return datos;
}


// El id de la URL debe ser un entero positivo
function idValido(id){
    return /^\d+$/.test(id) && Number(id) > 0;
}


// Traduce los errores de MySQL a respuestas JSON con el codigo HTTP adecuado
function manejarErrorBD(err, res){
    if(err.code === 'ER_DUP_ENTRY'){
        return res.status(409).json({error: 'Ya existe un registro con ese valor (restricción UNIQUE)', detalle: err.sqlMessage});
    }
    if(err.code === 'ER_NO_REFERENCED_ROW_2'){
        return res.status(409).json({error: 'Uno de los id relacionados no existe (llave foránea)', detalle: err.sqlMessage});
    }
    if(err.code === 'ER_ROW_IS_REFERENCED_2'){
        return res.status(409).json({error: 'No se puede eliminar porque otros registros dependen de este (llave foránea)', detalle: err.sqlMessage});
    }
    if(err.code === 'ER_CHECK_CONSTRAINT_VIOLATED' || err.code === 'ER_TRUNCATED_WRONG_VALUE' || err.code === 'ER_DATA_TOO_LONG'){
        return res.status(400).json({error: 'Los datos no cumplen las restricciones de la tabla', detalle: err.sqlMessage});
    }
    return res.status(500).json({error: 'Error en el servidor', detalle: err.message});
}


module.exports = {

    getProveedores: (req, res)=>{
        proveedorModel.getProveedores((err, result)=>{
            if(err){
                return manejarErrorBD(err, res);
            }

            res.status(200).json({data: result});
        });
    },


    getProveedorById: (req, res)=>{
        const {id} = req.params;

        if(!idValido(id)){
            return res.status(400).json({error: 'El id debe ser un número entero positivo'});
        }

        proveedorModel.getProveedorById(id, (err, result)=>{
            if(err){
                return manejarErrorBD(err, res);
            }

            if(result.length === 0){
                return res.status(404).json({error: 'Proveedor no encontrado'});
            }

            res.status(200).json({data: result[0]});
        });
    },


    postProveedor: (req, res)=>{
        const body = req.body || {};
        const errores = validar(body);

        if(errores.length > 0){
            return res.status(400).json({error: 'Datos inválidos', detalles: errores});
        }

        const datos = obtenerDatos(body);

        proveedorModel.postProveedor(datos, (err, result)=>{
            if(err){
                return manejarErrorBD(err, res);
            }

            res.status(201).json({message: 'Proveedor creado correctamente', data: {idInsertado: result}});
        });
    },


    putProveedor: (req, res)=>{
        const {id} = req.params;
        const body = req.body || {};

        if(!idValido(id)){
            return res.status(400).json({error: 'El id debe ser un número entero positivo'});
        }

        const errores = validar(body);

        if(errores.length > 0){
            return res.status(400).json({error: 'Datos inválidos', detalles: errores});
        }

        const datos = obtenerDatos(body);

        proveedorModel.putProveedor(id, datos, (err, result)=>{
            if(err){
                return manejarErrorBD(err, res);
            }

            if(result.affectedRows === 0){
                return res.status(404).json({error: 'Proveedor no encontrado'});
            }

            res.status(200).json({message: 'Proveedor actualizado correctamente'});
        });
    },


    deleteProveedor: (req, res)=>{
        const {id} = req.params;

        if(!idValido(id)){
            return res.status(400).json({error: 'El id debe ser un número entero positivo'});
        }

        proveedorModel.deleteProveedor(id, (err, result)=>{
            if(err){
                return manejarErrorBD(err, res);
            }

            if(result.affectedRows === 0){
                return res.status(404).json({error: 'Proveedor no encontrado'});
            }

            res.status(200).json({message: 'Proveedor eliminado correctamente'});
        });
    }
}
