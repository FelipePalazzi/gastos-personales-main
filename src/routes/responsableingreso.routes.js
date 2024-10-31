const express = require('express');
const router = express.Router();
const responsableingresoController = require ('../controllers/responsableingreso.controller.js');
const authenticateToken = require('../controllers/autenticacion/autenticacion.controller.js');
const { pagina, symbols } = require('../constants.js');

router.get(`${symbols.barra}${pagina.pagina_responsable}${symbols.barra}:keyId`,authenticateToken, responsableingresoController.getresponsableIngreso);

router.get(`${symbols.barra}${pagina.pagina_responsable}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, responsableingresoController.getresponsableIngresobyID);

router.post(`${symbols.barra}${pagina.pagina_responsable}${symbols.barra}:keyId`,authenticateToken, responsableingresoController.createresponsableIngreso);

router.put(`${symbols.barra}${pagina.pagina_responsable}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, responsableingresoController.updateresponsableIngreso);

router.delete(`${symbols.barra}${pagina.pagina_responsable}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, responsableingresoController.deleteresponsableIngreso);

module.exports = router;