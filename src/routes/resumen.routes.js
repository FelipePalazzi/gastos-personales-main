const express = require('express');
const router = express.Router();
const resumenController = require ('../controllers/resumen.controller.js');
const { pagina, symbols } = require('../constants.js');

router.get(`${symbols.barra}${pagina.pagina_resumen}${symbols.barra}1`, resumenController.getResumen1);

router.get(`${symbols.barra}${pagina.pagina_resumen}${symbols.barra}2`, resumenController.getResumen2);

router.get(`${symbols.barra}${pagina.pagina_resumen}${symbols.barra}3`, resumenController.getResumen3);

module.exports = router;