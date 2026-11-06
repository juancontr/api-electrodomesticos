const express = require('express')
const router = express.Router();


const detalleVentaController = require('../controllers/detalleVentaController');



router.get('/', detalleVentaController.getDetalleVentas);
router.get('/:id', detalleVentaController.getDetalleVentaById);
router.post('/', detalleVentaController.postDetalleVenta);
router.put('/:id', detalleVentaController.putDetalleVenta);
router.delete('/:id', detalleVentaController.deleteDetalleVenta);


module.exports = router;
