import { Router } from "express";
import monedaingresoController from '../controllers/monedaingreso.controller'
import {pagina,symbols } from '../constants'
const router = Router();

router.get(`${symbols.barra}${pagina.pagina_moneda_ingreso}`, monedaingresoController.getmonedaIngreso);

router.get(`${symbols.barra}${pagina.pagina_moneda_ingreso}${symbols.barra}:id`, monedaingresoController.getmonedaIngresobyID);

router.post(`${symbols.barra}${pagina.pagina_moneda_ingreso}`, monedaingresoController.createmonedaIngreso);

router.put(`${symbols.barra}${pagina.pagina_moneda_ingreso}${symbols.barra}:id`, monedaingresoController.updatemonedaIngreso);

router.delete(`${symbols.barra}${pagina.pagina_moneda_ingreso}${symbols.barra}:id`, monedaingresoController.deletemonedaIngreso);

export default router;