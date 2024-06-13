import { Router } from "express";
import gastoController from '../controllers/gasto.controller'
import {pagina,symbols } from '../constants'
const router = Router();

router.get(`${symbols.barra}${pagina.pagina_gasto}`, gastoController.getGastos);

router.get(`${symbols.barra}${pagina.pagina_gasto}${symbols.barra}:id`, gastoController.getGastobyID);

router.post(`${symbols.barra}${pagina.pagina_gasto}`, gastoController.createGasto);

router.put(`${symbols.barra}${pagina.pagina_gasto}${symbols.barra}:id`, gastoController.updateGasto);

router.delete(`${symbols.barra}${pagina.pagina_gasto}${symbols.barra}:id`, gastoController.deleteGasto);

export default router;