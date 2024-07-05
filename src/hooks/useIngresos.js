import { useState, useEffect } from "react";
import {pagina,symbols ,alerts } from '../constants'
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const useIngresos = () => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIngresos = async () => {
    try {
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_ingreso}`);
      const json = await response.json();
      setIngresos(json);
      setTimeout(() => {
        setLoading(false);
      }, 500); 
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_ingreso}`, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngresos();
  }, []);

  return { ingresos, loading };
};

export default useIngresos;