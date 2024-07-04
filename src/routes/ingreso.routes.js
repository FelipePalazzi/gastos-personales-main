const express = require('express');
const router = express.Router();
const ingresoController = require ('../controllers/ingreso.controller.js');
const { pagina, symbols } = require('../constants.js');

router.get(`${symbols.barra}${pagina.pagina_ingreso}`, ingresoController.getIngreso);

router.get(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:id`, ingresoController.getIngresobyID);

router.post(`${symbols.barra}${pagina.pagina_ingreso}`, ingresoController.createIngreso);

router.put(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:id`, ingresoController.updateIngreso);

router.delete(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:id`, ingresoController.deleteIngreso);

module.exports = router;