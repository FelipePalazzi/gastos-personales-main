const express = require('express');
const router = express.Router();
const loginController = require ('../controllers/login.controller.js');
const authenticateToken = require('../middlewares/autenticacion/autenticacion.controller.js');
const { symbols } = require('../../constants.js');

router.post(`${symbols.barra}register`, loginController.register );

router.post(`${symbols.barra}login`, loginController.login);

router.post(`${symbols.barra}validarPin`, authenticateToken, loginController.validatePin);

router.post(`${symbols.barra}refresh`, loginController.refreshToken);

router.post(`${symbols.barra}refreshTokens`, loginController.refreshTokenJSON);

router.post(`${symbols.barra}otorgaracceso`, authenticateToken, loginController.otorgarAcceso);

router.post(`${symbols.barra}eliminaracceso`, authenticateToken, loginController.eliminarAcceso);

router.post(`${symbols.barra}otorgaradmin`, authenticateToken, loginController.otorgarAdmin);

router.post(`${symbols.barra}eliminaradmin`, authenticateToken, loginController.eliminarAdmin);

module.exports = router;