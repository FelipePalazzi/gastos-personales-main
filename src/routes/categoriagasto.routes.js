import { Router } from "express";
import categoriagastoController from'../controllers/categoriagasto.controller.js'
import {pagina,symbols } from '../constants.js'

const router = Router();

router.get(`${symbols.barra}${pagina.pagina_categoria_gasto}`, categoriagastoController.getcategoriaGastos);

router.get(`${symbols.barra}${pagina.pagina_categoria_gasto}${symbols.barra}:id`, categoriagastoController.getcategoriaGastobyID);

router.post(`${symbols.barra}${pagina.pagina_categoria_gasto}`, categoriagastoController.createcategoriaGasto);

router.put(`${symbols.barra}${pagina.pagina_categoria_gasto}${symbols.barra}:id`, categoriagastoController.updatecategoriaGasto);

router.delete(`${symbols.barra}${pagina.pagina_categoria_gasto}${symbols.barra}:id`, categoriagastoController.deletecategoriaGasto);

export default router;