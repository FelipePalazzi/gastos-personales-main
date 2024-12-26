const express = require('express');
const router = express.Router();
const getkeysController = require ('../../controllers/login/getkeys.controller.js');
const { symbols } = require('../../constants.js');
const authenticateToken = require('../../controllers/autenticacion/autenticacion.controller.js');

router.get(`${symbols.barra}conseguirllaves${symbols.barra}:userId`, authenticateToken, getkeysController.conseguirllaves );

module.exports = router;