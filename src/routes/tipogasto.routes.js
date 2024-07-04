const express = require('express');
const router = express.Router();
const tipogastoController = require ('../controllers/tipogasto.controller.js');
const { pagina, symbols } = require('../constants.js');

router.get(`${symbols.barra}${pagina.pagina_tipo_gasto}`, tipogastoController.gettipoGastos);

router.get(`${symbols.barra}${pagina.pagina_tipo_gasto}${symbols.barra}:id`, tipogastoController.gettipoGastobyID);

router.post(`${symbols.barra}${pagina.pagina_tipo_gasto}`, tipogastoController.createtipoGasto);

router.put(`${symbols.barra}${pagina.pagina_tipo_gasto}${symbols.barra}:id`, tipogastoController.updatetipoGasto);

router.delete(`${symbols.barra}${pagina.pagina_tipo_gasto}${symbols.barra}:id`, tipogastoController.deletetipoGasto);

module.exports = router;