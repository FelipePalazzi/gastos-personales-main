const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller.js');
const authenticateToken = require('../middlewares/autenticacion/autenticacion.controller.js');
const verifyKeyId = require('../middlewares/verificacion/verifyKeyId.js');
const { pagina, symbols } = require('../../constants.js');

router.get(`${symbols.barra}${pagina.pagina_categoria}${symbols.barra}:keyId`, verifyKeyId, authenticateToken, categoriaController.getcategoria);

router.get(`${symbols.barra}${pagina.pagina_categoria}${symbols.barra}:keyId${symbols.barra}:id`, verifyKeyId, authenticateToken, categoriaController.getcategoriabyID);

router.post(`${symbols.barra}${pagina.pagina_categoria}${symbols.barra}:keyId`, authenticateToken, verifyKeyId, categoriaController.createcategoria);

router.put(`${symbols.barra}${pagina.pagina_categoria}${symbols.barra}:keyId${symbols.barra}:id`, verifyKeyId, authenticateToken, categoriaController.updatecategoria);

router.delete(`${symbols.barra}${pagina.pagina_categoria}${symbols.barra}:keyId${symbols.barra}:id`, verifyKeyId, authenticateToken, categoriaController.deletecategoria);

module.exports = router;