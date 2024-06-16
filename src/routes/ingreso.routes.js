import { Router } from "express";
import ingresoController from '../controllers/ingreso.controller.js'
import {pagina,symbols } from '../constants.js'
const router = Router();

router.get(`${symbols.barra}${pagina.pagina_ingreso}`, ingresoController.getIngreso);

router.get(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:id`, ingresoController.getIngresobyID);

router.post(`${symbols.barra}${pagina.pagina_ingreso}`, ingresoController.createIngreso);

router.put(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:id`, ingresoController.updateIngreso);

router.delete(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:id`, ingresoController.deleteIngreso);

export default router;