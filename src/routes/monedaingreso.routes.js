const express = require('express');
const router = express.Router();
const monedaingresoController = require ('../controllers/monedaingreso.controller.js');
const { pagina, symbols } = require('../constants.js');

router.get(`${symbols.barra}${pagina.pagina_moneda_ingreso}`, monedaingresoController.getmonedaIngreso);

router.get(`${symbols.barra}${pagina.pagina_moneda_ingreso}${symbols.barra}:id`, monedaingresoController.getmonedaIngresobyID);

router.post(`${symbols.barra}${pagina.pagina_moneda_ingreso}`, monedaingresoController.createmonedaIngreso);

router.put(`${symbols.barra}${pagina.pagina_moneda_ingreso}${symbols.barra}:id`, monedaingresoController.updatemonedaIngreso);

router.delete(`${symbols.barra}${pagina.pagina_moneda_ingreso}${symbols.barra}:id`, monedaingresoController.deletemonedaIngreso);

module.exports = router;