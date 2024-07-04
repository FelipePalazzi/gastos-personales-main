import { useState, useEffect } from "react";
import {pagina,symbols ,alerts } from '../constants'
import {PAGINA_URL} from '@env'
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