import { useState, useEffect } from "react";
import { pagina, symbols, alerts } from '../constants'

const useResumen = () => {
    const [resumen1, setResumen1] = useState(null);
    const [loading, setLoading] = useState(true);
  
    const fetchResumen = async (id) => {
      try {
        const response = await globalThis.fetch(`${pagina.pagina}${symbols.barra}${pagina.pagina_resumen}${symbols.barra}${id}`);
        const json = await response.json();
        setResumen1(json);
        setLoading(false);
      } catch (error) {
        console.error(`${alerts.error_ocurrido}${pagina.pagina_resumen}${id}`, error);
      }
    };
  
    useEffect(() => {
      fetchResumen('1');
    }, []);
  
    return { loading, data: resumen1 };
  };
  
  export default useResumen;