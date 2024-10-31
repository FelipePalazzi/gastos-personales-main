const express = require('express');
const router = express.Router();
const monedaingresoController = require ('../controllers/monedaingreso.controller.js');
const authenticateToken = require('../controllers/autenticacion/autenticacion.controller.js');
const { pagina, symbols } = require('../constants.js');

router.get(`${symbols.barra}${pagina.pagina_moneda_ingreso}${symbols.barra}:keyId`,authenticateToken, monedaingresoController.getmonedaIngreso);

router.get(`${symbols.barra}${pagina.pagina_moneda_ingreso}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, monedaingresoController.getmonedaIngresobyID);

router.post(`${symbols.barra}${pagina.pagina_moneda_ingreso}${symbols.barra}:keyId`,authenticateToken, monedaingresoController.createmonedaIngreso);

router.put(`${symbols.barra}${pagina.pagina_moneda_ingreso}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, monedaingresoController.updatemonedaIngreso);

router.delete(`${symbols.barra}${pagina.pagina_moneda_ingreso}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, monedaingresoController.deletemonedaIngreso);

module.exports = router;