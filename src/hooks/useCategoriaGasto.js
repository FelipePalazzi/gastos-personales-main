import { useState, useEffect, useCallback } from "react";
import {pagina,symbols ,alerts } from '../constants'
import {PAGINA_URL} from '@env'
const useCategoriaGasto = () => {
  const [categoriaGastos, setCategoriaGastos] = useState([]);

  const fetchCategoriaGastos = useCallback(async () => {
    try {
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_categoria_gasto}`);
      const json = await response.json();
      setCategoriaGastos(json);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_categoria_gasto}`, error);
    }
  }, []);

  useEffect(() => {
    fetchCategoriaGastos();
  }, [fetchCategoriaGastos]);

  return { categoriaGastos };
};

export default useCategoriaGasto;