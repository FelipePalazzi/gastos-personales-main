const express = require('express');
const router = express.Router();
const keysController = require ('../../controllers/login/keys.controller.js');
const { symbols } = require('../../constants.js');
const authenticateToken = require('../../controllers/autenticacion/autenticacion.controller.js');

router.get(`${symbols.barra}${pagina.pagina_key}${symbols.barra}getkeys${symbols.barra}:userId`, authenticateToken, keysController.getkeys );

router.post(`${symbols.barra}${pagina.pagina_key}`,authenticateToken, keysController.createkey);

module.exports = router;