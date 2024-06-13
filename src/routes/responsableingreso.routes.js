import { Router } from "express";
import responsableingresoController from '../controllers/responsableingreso.controller'
import {pagina,symbols } from '../constants'
const router = Router();

router.get(`${symbols.barra}${pagina.pagina_responsable}`, responsableingresoController.getresponsableIngreso);

router.get(`${symbols.barra}${pagina.pagina_responsable}${symbols.barra}:id`, responsableingresoController.getresponsableIngresobyID);

router.post(`${symbols.barra}${pagina.pagina_responsable}`, responsableingresoController.createresponsableIngreso);

router.put(`${symbols.barra}${pagina.pagina_responsable}${symbols.barra}:id`, responsableingresoController.updateresponsableIngreso);

router.delete(`${symbols.barra}${pagina.pagina_responsable}${symbols.barra}:id`, responsableingresoController.deleteresponsableIngreso);

export default router;