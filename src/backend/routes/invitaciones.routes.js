const express = require('express');
const router = express.Router();
const invitacionesController = require ('../controllers/invitaciones.controller.js');
const authenticateToken = require('../middlewares/autenticacion/autenticacion.controller.js');
const { pagina, symbols } = require('../../constants.js');

router.get(`${symbols.barra}${pagina.pagina_invitaciones}${symbols.barra}userid${symbols.barra}:userId`,authenticateToken, invitacionesController.getInvitacionsbyUser);

router.get(`${symbols.barra}${pagina.pagina_invitaciones}${symbols.barra}keyid${symbols.barra}:keyId`,authenticateToken, invitacionesController.getInvitacionsbyKeyId);

router.post(`${symbols.barra}${pagina.pagina_invitaciones}${symbols.barra}:userId`,authenticateToken, invitacionesController.createinvitacion);

router.delete(`${symbols.barra}${pagina.pagina_invitaciones}${symbols.barra}:id`,authenticateToken, invitacionesController.deleteinvitacion);

router.put(`${symbols.barra}${pagina.pagina_invitaciones}${symbols.barra}aprobar${symbols.barra}:id`,authenticateToken, invitacionesController.aprobarinvitacion);

router.put(`${symbols.barra}${pagina.pagina_invitaciones}${symbols.barra}rechazar${symbols.barra}:id`,authenticateToken, invitacionesController.rechazarinvitacion);

module.exports = router;