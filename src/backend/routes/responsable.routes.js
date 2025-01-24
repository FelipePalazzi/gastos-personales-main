const express = require('express');
const router = express.Router();
const responsableController = require('../controllers/responsable.controller.js');
const authenticateToken = require('../middlewares/autenticacion/autenticacion.controller.js');
const verifyKeyId = require('../middlewares/verificacion/verifyKeyId.js');
const { pagina, symbols } = require('../../constants.js');

router.get(`${symbols.barra}${pagina.pagina_responsable}${symbols.barra}:keyId`, verifyKeyId, authenticateToken, responsableController.getresponsable);

router.get(`${symbols.barra}${pagina.pagina_responsable}${symbols.barra}:keyId${symbols.barra}:id`, verifyKeyId, authenticateToken, responsableController.getresponsablebyID);

router.post(`${symbols.barra}${pagina.pagina_responsable}${symbols.barra}:keyId`, verifyKeyId, authenticateToken, responsableController.createresponsable);

router.put(`${symbols.barra}${pagina.pagina_responsable}${symbols.barra}:keyId${symbols.barra}:id`, verifyKeyId, authenticateToken, responsableController.updateresponsable);

router.delete(`${symbols.barra}${pagina.pagina_responsable}${symbols.barra}:keyId${symbols.barra}:id`, verifyKeyId, authenticateToken, responsableController.deleteresponsable);

module.exports = router;