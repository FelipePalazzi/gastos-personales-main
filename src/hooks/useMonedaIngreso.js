import { useState, useEffect } from "react";
import {pagina,symbols ,alerts } from '../constants'
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const useMonedaIngreso = () => {
  const [monedaIngresos, setmonedaIngresos] = useState([]);

  const fetchmonedaIngresos = async () => {
    try {
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_moneda_ingreso}`);
      const json = await response.json();
      setmonedaIngresos(json);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_moneda_ingreso}`, error);
    }
  };

  useEffect(() => {
    fetchmonedaIngresos();
  }, []);

  return { monedaIngresos };
};

export default useMonedaIngreso;