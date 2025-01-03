const express = require('express');
const router = express.Router();
const monedasPosiblesController = require ('../controllers/monedasposibles.controller.js');
const { symbols, pagina} = require('../../constants.js');
const authenticateToken = require('../middlewares/autenticacion/autenticacion.controller.js');

router.get(`${symbols.barra}${pagina.pagina_monedas_posibles}`,authenticateToken, monedasPosiblesController.getMonedasPosibles);

module.exports = router;