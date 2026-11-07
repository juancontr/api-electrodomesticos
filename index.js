const express = require('express');
const bodyParser = require('body-parser');

const categoriaRoutes = require('./src/routes/categoriaRoutes');
const marcaRoutes = require('./src/routes/marcaRoutes');
const proveedorRoutes = require('./src/routes/proveedorRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const clienteRoutes = require('./src/routes/clienteRoutes');
const ventaRoutes = require('./src/routes/ventaRoutes');
const detalleVentaRoutes = require('./src/routes/detalleVentaRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(204);
    }
    next();
});

app.get('/', (req, res)=>{
    res.status(200).json({
        message: 'API REST - Tienda de Electrodomésticos',
        recursos: [
            '/api/categorias',
            '/api/marcas',
            '/api/proveedores',
            '/api/productos',
            '/api/clientes',
            '/api/ventas',
            '/api/detalle-ventas'
        ]
    });
});

app.use('/api/categorias', categoriaRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/detalle-ventas', detalleVentaRoutes);

app.use((req, res)=>{
    res.status(404).json({error: 'Ruta no encontrada'});
});

app.use((err, req, res, next)=>{
    if(err.type === 'entity.parse.failed'){
        return res.status(400).json({error: 'El body no es un JSON válido'});
    }
    res.status(500).json({error: 'Error en el servidor', detalle: err.message});
});


app.listen(port, ()=>{
    console.log("Servidor iniciado en http://localhost:" + port);
});
