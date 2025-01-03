const express = require('express');
const router = express.Router();
const monedaController = require ('../controllers/moneda.controller.js');
const authenticateToken = require('../middlewares/autenticacion/autenticacion.controller.js');
const { pagina, symbols } = require('../../constants.js');

router.get(`${symbols.barra}${pagina.pagina_moneda}${symbols.barra}todas${symbols.barra}:keyId`,authenticateToken, monedaController.getMoneda);

router.get(`${symbols.barra}${pagina.pagina_moneda}${symbols.barra}faltantes${symbols.barra}:keyId`,authenticateToken, monedaController.getMonedaFaltante);

router.get(`${symbols.barra}${pagina.pagina_moneda}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, monedaController.getMonedabyID);

router.post(`${symbols.barra}${pagina.pagina_moneda}${symbols.barra}:keyId`,authenticateToken, monedaController.createMoneda);

router.put(`${symbols.barra}${pagina.pagina_moneda}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, monedaController.updateMoneda);

router.delete(`${symbols.barra}${pagina.pagina_moneda}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, monedaController.deleteMoneda);

module.exports = router;