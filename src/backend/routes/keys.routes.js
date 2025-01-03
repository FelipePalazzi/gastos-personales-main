const express = require('express');
const router = express.Router();
const keysController = require ('../controllers/keys.controller.js');
const { symbols, pagina} = require('../../constants.js');
const authenticateToken = require('../middlewares/autenticacion/autenticacion.controller.js');

router.get(`${symbols.barra}${pagina.pagina_key}${symbols.barra}userid${symbols.barra}:userId`,authenticateToken, keysController.getKeysbyUserId);

router.get(`${symbols.barra}${pagina.pagina_key}${symbols.barra}keyid${symbols.barra}:keyId`,authenticateToken, keysController.getUsersByKeyId);

router.post(`${symbols.barra}${pagina.pagina_key}${symbols.barra}`,authenticateToken, keysController.createkey);

router.put(`${symbols.barra}${pagina.pagina_key}${symbols.barra}:keyId`,authenticateToken, keysController.updatekey);

router.delete(`${symbols.barra}${pagina.pagina_key}${symbols.barra}:keyId`,authenticateToken, keysController.deletekey);

module.exports = router;