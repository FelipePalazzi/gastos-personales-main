const express = require('express');
const router = express.Router();
const resumenController = require ('../controllers/resumen.controller.js');
const authenticateToken = require('../controllers/autenticacion/autenticacion.controller.js');
const { pagina, symbols } = require('../constants.js');

router.get(`${symbols.barra}${pagina.pagina_resumen}${symbols.barra}:keyId${symbols.barra}1`,authenticateToken, resumenController.getResumen1);

router.get(`${symbols.barra}${pagina.pagina_resumen}${symbols.barra}:keyId${symbols.barra}2`,authenticateToken, resumenController.getResumen2);

router.get(`${symbols.barra}${pagina.pagina_resumen}${symbols.barra}:keyId${symbols.barra}3`,authenticateToken, resumenController.getResumen3);

router.get(`${symbols.barra}${pagina.pagina_resumen}${symbols.barra}:keyId${symbols.barra}4`,authenticateToken, resumenController.getResumen4);

router.get(`${symbols.barra}${pagina.pagina_resumen}${symbols.barra}:keyId${symbols.barra}5${symbols.barra}:id`,authenticateToken, resumenController.getResumen5);

module.exports = router;