const express = require('express');
const router = express.Router();
const categoriagastoController = require ('../controllers/categoriagasto.controller.js');
const { pagina, symbols } = require('../constants.js');

router.get(`${symbols.barra}${pagina.pagina_categoria_gasto}`, categoriagastoController.getcategoriaGastos);

router.get(`${symbols.barra}${pagina.pagina_categoria_gasto}${symbols.barra}:id`, categoriagastoController.getcategoriaGastobyID);

router.post(`${symbols.barra}${pagina.pagina_categoria_gasto}`, categoriagastoController.createcategoriaGasto);

router.put(`${symbols.barra}${pagina.pagina_categoria_gasto}${symbols.barra}:id`, categoriagastoController.updatecategoriaGasto);

router.delete(`${symbols.barra}${pagina.pagina_categoria_gasto}${symbols.barra}:id`, categoriagastoController.deletecategoriaGasto);

module.exports = router;