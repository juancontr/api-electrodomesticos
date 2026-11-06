const express = require('express')
const router = express.Router();


const ventaController = require('../controllers/ventaController');



router.get('/', ventaController.getVentas);
router.get('/:id', ventaController.getVentaById);
router.post('/', ventaController.postVenta);
router.put('/:id', ventaController.putVenta);
router.delete('/:id', ventaController.deleteVenta);


module.exports = router;
