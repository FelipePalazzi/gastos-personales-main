const express = require('express');
const router = express.Router();
const categoriaController = require ('../controllers/categoria.controller.js');
const authenticateToken = require('../middlewares/autenticacion/autenticacion.controller.js');
const { pagina, symbols } = require('../../constants.js');

router.get(`${symbols.barra}${pagina.pagina_categoria}${symbols.barra}:keyId`,authenticateToken, categoriaController.getcategoria);

router.get(`${symbols.barra}${pagina.pagina_categoria}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, categoriaController.getcategoriabyID);

router.post(`${symbols.barra}${pagina.pagina_categoria}${symbols.barra}:keyId`,authenticateToken, categoriaController.createcategoria);

router.put(`${symbols.barra}${pagina.pagina_categoria}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, categoriaController.updatecategoria);

router.delete(`${symbols.barra}${pagina.pagina_categoria}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, categoriaController.deletecategoria);

module.exports = router;