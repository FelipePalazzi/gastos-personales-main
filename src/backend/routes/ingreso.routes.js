const express = require('express');
const router = express.Router();
const ingresoController = require('../controllers/ingreso.controller.js');
const authenticateToken = require('../middlewares/autenticacion/autenticacion.controller.js');
const verifyKeyId = require('../middlewares/verificacion/verifyKeyId.js');
const { pagina, symbols } = require('../../constants.js');

router.get(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:keyId`, verifyKeyId, authenticateToken, ingresoController.getIngresos);

router.get(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:keyId${symbols.barra}:id`, verifyKeyId, authenticateToken, ingresoController.getIngresobyID);

router.post(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:keyId`, verifyKeyId, authenticateToken, ingresoController.createIngreso);

router.put(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:keyId${symbols.barra}:id`, verifyKeyId, authenticateToken, ingresoController.updateIngreso);

router.delete(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:keyId${symbols.barra}:id`, verifyKeyId, authenticateToken, ingresoController.deleteIngreso);

module.exports = router;