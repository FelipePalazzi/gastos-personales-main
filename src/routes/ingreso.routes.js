const express = require('express');
const router = express.Router();
const ingresoController = require ('../controllers/ingreso.controller.js');
const authenticateToken = require('../controllers/autenticacion/autenticacion.controller.js');
const { pagina, symbols } = require('../constants.js');

router.get(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:keyId`,authenticateToken, ingresoController.getIngreso);

router.get(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, ingresoController.getIngresobyID);

router.post(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:keyId`,authenticateToken, ingresoController.createIngreso);

router.put(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, ingresoController.updateIngreso);

router.delete(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, ingresoController.deleteIngreso);

module.exports = router;