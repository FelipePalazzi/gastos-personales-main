const express = require('express');
const router = express.Router();
const submetodopagoController = require ('../controllers/submetodopago.controller.js');
const authenticateToken = require('../middlewares/autenticacion/autenticacion.controller.js');
const { pagina, symbols } = require('../../constants.js');

router.get(`${symbols.barra}${pagina.pagina_submetodopago}${symbols.barra}:keyId`,authenticateToken, submetodopagoController.getsubmetodopago);

router.get(`${symbols.barra}${pagina.pagina_submetodopago}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, submetodopagoController.getsubmetodopagobyID);

router.post(`${symbols.barra}${pagina.pagina_submetodopago}${symbols.barra}:keyId`,authenticateToken, submetodopagoController.createsubmetodopago);

router.put(`${symbols.barra}${pagina.pagina_submetodopago}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, submetodopagoController.updatesubmetodopago);

router.delete(`${symbols.barra}${pagina.pagina_submetodopago}${symbols.barra}:keyId${symbols.barra}:id`,authenticateToken, submetodopagoController.deletesubmetodopago);

module.exports = router;