const express = require('express');
const router = express.Router();
const categoriagastoController = require ('../controllers/categoriagasto.controller.js');
const authenticateToken = require('../controllers/autenticacion/autenticacion.controller.js');
const { pagina, symbols } = require('../constants.js');

router.get(`${symbols.barra}${pagina.pagina_categoria_gasto}${symbols.barra}:keyId`,authenticateToken, categoriagastoController.getcategoriaGastos);

router.get(`${symbols.barra}${pagina.pagina_categoria_gasto}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, categoriagastoController.getcategoriaGastobyID);

router.post(`${symbols.barra}${pagina.pagina_categoria_gasto}${symbols.barra}:keyId`,authenticateToken, categoriagastoController.createcategoriaGasto);

router.put(`${symbols.barra}${pagina.pagina_categoria_gasto}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, categoriagastoController.updatecategoriaGasto);

router.delete(`${symbols.barra}${pagina.pagina_categoria_gasto}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, categoriagastoController.deletecategoriaGasto);

module.exports = router;