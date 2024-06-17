import { useState, useEffect } from "react";
import { pagina, symbols, alerts } from '../constants.js'


const useResumen = () => {
  const [resumenData, setResumenData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchResumen = async (id) => {
    try {
      const response = await globalThis.fetch(`${pagina.pagina}${symbols.barra}${pagina.pagina_resumen}${symbols.barra}${id}`);
      const json = await response.json();
      setResumenData((prevData) => ({...prevData, [id]: json }));
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_resumen}${id}`, error);
    }
  };

  useEffect(() => {
    fetchResumen('1');
  }, []);

  useEffect(() => {
    fetchResumen('2');
    setLoading(false);
  }, []);

  return { loading, data: resumenData };
};

export default useResumen;