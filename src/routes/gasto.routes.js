const express = require('express');
const router = express.Router();
const gastoController = require ('../controllers/gasto.controller.js');
const { pagina, symbols } = require('../constants.js');

router.get(`${symbols.barra}${pagina.pagina_gasto}`, gastoController.getGastos);

router.get(`${symbols.barra}${pagina.pagina_gasto}${symbols.barra}:id`, gastoController.getGastobyID);

router.post(`${symbols.barra}${pagina.pagina_gasto}`, gastoController.createGasto);

router.put(`${symbols.barra}${pagina.pagina_gasto}${symbols.barra}:id`, gastoController.updateGasto);

router.delete(`${symbols.barra}${pagina.pagina_gasto}${symbols.barra}:id`, gastoController.deleteGasto);

module.exports = router;