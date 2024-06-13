import { useState, useEffect } from "react";
import {pagina,symbols ,alerts } from '../constants'
const useResponsableIngreso = () => {
  const [responsableIngresos, setresponsableIngresos] = useState([]);

  const fetchresponsableIngresos = async () => {
    try {
      const response = await globalThis.fetch(`${pagina.pagina}${symbols.barra}${pagina.pagina_responsable}`);
      const json = await response.json();
      setresponsableIngresos(json);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_responsable}`, error);
    }
  };

  useEffect(() => {
    fetchresponsableIngresos();
  }, []);

  return { responsableIngresos };
};

export default useResponsableIngreso;