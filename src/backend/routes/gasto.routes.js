const express = require('express');
const router = express.Router();
const gastoController = require('../controllers/gasto.controller.js');
const authenticateToken = require('../middlewares/autenticacion/autenticacion.controller.js');
const verifyKeyId = require('../middlewares/verificacion/verifyKeyId.js');
const { pagina, symbols } = require('../../constants.js');

router.get(`${symbols.barra}${pagina.pagina_gasto}${symbols.barra}:keyId`, verifyKeyId, authenticateToken, gastoController.getGastos);

router.get(`${symbols.barra}${pagina.pagina_gasto}${symbols.barra}:keyId${symbols.barra}:id`, verifyKeyId, authenticateToken, gastoController.getGastobyID);

router.post(`${symbols.barra}${pagina.pagina_gasto}${symbols.barra}:keyId`, verifyKeyId, authenticateToken, gastoController.createGasto);

router.put(`${symbols.barra}${pagina.pagina_gasto}${symbols.barra}:keyId${symbols.barra}:id`, verifyKeyId, authenticateToken, gastoController.updateGasto);

router.delete(`${symbols.barra}${pagina.pagina_gasto}${symbols.barra}:keyId${symbols.barra}:id`, verifyKeyId, authenticateToken, gastoController.deleteGasto);

module.exports = router;