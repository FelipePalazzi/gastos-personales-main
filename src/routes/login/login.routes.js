const express = require('express');
const router = express.Router();
const loginController = require ('../../controllers/login/login.controller.js');
const { symbols } = require('../../constants.js');

router.post(`${symbols.barra}register`, loginController.register );

router.post(`${symbols.barra}login`, loginController.login);

router.post(`${symbols.barra}otorgaracceso`,loginController.otorgarAcceso);

router.post(`${symbols.barra}eliminaracceso`,loginController.eliminarAcceso);

router.post(`${symbols.barra}otorgaradmin`,loginController.otorgarAdmin);

router.post(`${symbols.barra}eliminaradmin`,loginController.eliminarAdmin);

module.exports = router;