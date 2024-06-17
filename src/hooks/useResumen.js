import { useState, useEffect } from "react";
import { pagina, symbols, alerts } from '../constants.js'

const useResumen = () => {
  const [resumenData, setResumenData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchResumen = async (id) => {
    try {
      const response = await globalThis.fetch(`${pagina.pagina}${symbols.barra}${pagina.pagina_resumen}${symbols.barra}${id}`);
      const json = await response.json();
      setResumenData((prevData) => ({ ...prevData, [id]: json }));
      setLoading(false);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_resumen}${id}`, error);
    }
  };

  useEffect(() => {
    fetchResumen('1');
    fetchResumen('2');
  }, []);

  return { loading, data: resumenData };
};

export default useResumen;