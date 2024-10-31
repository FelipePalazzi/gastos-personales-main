const express = require('express');
const router = express.Router();
const tipogastoController = require ('../controllers/tipogasto.controller.js');
const authenticateToken = require('../controllers/autenticacion/autenticacion.controller.js');
const { pagina, symbols } = require('../constants.js');

router.get(`${symbols.barra}${pagina.pagina_tipo_gasto}${symbols.barra}:keyId`,authenticateToken, tipogastoController.gettipoGastos);

router.get(`${symbols.barra}${pagina.pagina_tipo_gasto}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, tipogastoController.gettipoGastobyID);

router.post(`${symbols.barra}${pagina.pagina_tipo_gasto}${symbols.barra}:keyId`,authenticateToken, tipogastoController.createtipoGasto);

router.put(`${symbols.barra}${pagina.pagina_tipo_gasto}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, tipogastoController.updatetipoGasto);

router.delete(`${symbols.barra}${pagina.pagina_tipo_gasto}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, tipogastoController.deletetipoGasto);

module.exports = router;