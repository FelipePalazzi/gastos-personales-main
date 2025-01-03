const express = require('express');
const router = express.Router();
const metodopagoController = require ('../controllers/metodopago.controller.js');
const { symbols, pagina} = require('../../constants.js');
const authenticateToken = require('../middlewares/autenticacion/autenticacion.controller.js');

router.get(`${symbols.barra}${pagina.pagina_metodopago}`,authenticateToken, metodopagoController.getMetodopago);

module.exports = router;