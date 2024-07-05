import { useState, useEffect } from "react";
import {pagina,symbols ,alerts } from '../constants'
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const useTipoGasto = () => {
  const [tipogastos, setTipogastos] = useState([]);

  const fetchTipoGastos = async () => {
    try {
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_tipo_gasto}`);
      const json = await response.json();
      setTipogastos(json);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_tipo_gasto}`, error);
    }
  };

  useEffect(() => {
    fetchTipoGastos();
  }, []);

  return { tipogastos };
};

export default useTipoGasto;