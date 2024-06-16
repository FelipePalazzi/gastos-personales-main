import { Router } from "express";
import tipogastoController from '../controllers/tipogasto.controller.js'
import {pagina,symbols } from '../constants.js'

const router = Router();

router.get(`${symbols.barra}${pagina.pagina_tipo_gasto}`, tipogastoController.gettipoGastos);

router.get(`${symbols.barra}${pagina.pagina_tipo_gasto}${symbols.barra}:id`, tipogastoController.gettipoGastobyID);

router.post(`${symbols.barra}${pagina.pagina_tipo_gasto}`, tipogastoController.createtipoGasto);

router.put(`${symbols.barra}${pagina.pagina_tipo_gasto}${symbols.barra}:id`, tipogastoController.updatetipoGasto);

router.delete(`${symbols.barra}${pagina.pagina_tipo_gasto}${symbols.barra}:id`, tipogastoController.deletetipoGasto);

export default router;