import { Router } from "express";
import resumenController from '../controllers/resumen.controller'
import {pagina,symbols } from '../constants'
const router = Router();

router.get(`${symbols.barra}${pagina.pagina_resumen}${symbols.barra}1`, resumenController.getResumen1);


export default router;