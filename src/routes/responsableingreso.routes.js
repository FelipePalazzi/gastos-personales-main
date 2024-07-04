const express = require('express');
const router = express.Router();
const responsableingresoController = require ('../controllers/responsableingreso.controller.js');
const { pagina, symbols } = require('../constants.js');

router.get(`${symbols.barra}${pagina.pagina_responsable}`, responsableingresoController.getresponsableIngreso);

router.get(`${symbols.barra}${pagina.pagina_responsable}${symbols.barra}:id`, responsableingresoController.getresponsableIngresobyID);

router.post(`${symbols.barra}${pagina.pagina_responsable}`, responsableingresoController.createresponsableIngreso);

router.put(`${symbols.barra}${pagina.pagina_responsable}${symbols.barra}:id`, responsableingresoController.updateresponsableIngreso);

router.delete(`${symbols.barra}${pagina.pagina_responsable}${symbols.barra}:id`, responsableingresoController.deleteresponsableIngreso);

module.exports = router;