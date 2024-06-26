import { useState, useEffect } from "react";
import {pagina,symbols ,alerts} from '../constants'
const useGastos = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGastos = async () => {
    try {
      const response = await globalThis.fetch(`${pagina.pagina}${symbols.barra}${pagina.pagina_gasto}`);
      const json = await response.json();
      setGastos(json);
      setTimeout(() => {
        setLoading(false);
      }, 5); 
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_gasto}`, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, []);

  return { gastos, loading };
};

export default useGastos;