const express = require('express')
const router = express.Router();


const proveedorController = require('../controllers/proveedorController');



router.get('/', proveedorController.getProveedores);
router.get('/:id', proveedorController.getProveedorById);
router.post('/', proveedorController.postProveedor);
router.put('/:id', proveedorController.putProveedor);
router.delete('/:id', proveedorController.deleteProveedor);


module.exports = router;
