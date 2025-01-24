const express = require('express');
const router = express.Router();
const subcategoriaController = require('../controllers/subcategoria.controller.js');
const authenticateToken = require('../middlewares/autenticacion/autenticacion.controller.js');
const verifyKeyId = require('../middlewares/verificacion/verifyKeyId.js');
const { pagina, symbols } = require('../../constants.js');

router.get(`${symbols.barra}${pagina.pagina_subcategoria}${symbols.barra}:keyId`, verifyKeyId, authenticateToken, subcategoriaController.getsubcategoria);

router.get(`${symbols.barra}${pagina.pagina_subcategoria}${symbols.barra}:keyId${symbols.barra}:id`, verifyKeyId, authenticateToken, subcategoriaController.getsubcategoriabyID);

router.post(`${symbols.barra}${pagina.pagina_subcategoria}${symbols.barra}:keyId`, verifyKeyId, authenticateToken, subcategoriaController.createsubcategoria);

router.put(`${symbols.barra}${pagina.pagina_subcategoria}${symbols.barra}:keyId${symbols.barra}:id`, verifyKeyId, authenticateToken, subcategoriaController.updatesubcategoria);

router.delete(`${symbols.barra}${pagina.pagina_subcategoria}${symbols.barra}:keyId${symbols.barra}:id`, verifyKeyId, authenticateToken, subcategoriaController.deletesubcategoria);

module.exports = router;