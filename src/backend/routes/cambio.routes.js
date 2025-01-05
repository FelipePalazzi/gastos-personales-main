const express = require('express');
const router = express.Router();
const cambioController = require ('../controllers/cambio.controller.js');
const { symbols, pagina} = require('../../constants.js');
const authenticateToken = require('../middlewares/autenticacion/autenticacion.controller.js');

router.get(`${symbols.barra}${pagina.pagina_cambio}`,authenticateToken, cambioController.getCambioFecha);

module.exports = router;