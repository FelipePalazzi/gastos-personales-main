import { useState, useEffect } from "react";
import { pagina, symbols, alerts } from '../constants.js'
import {PAGINA_URL} from '@env'

const useResumen = () => {
  const [resumenData, setResumenData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchResumen = async (id) => {
    try {
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_resumen}${symbols.barra}${id}`);
      const json = await response.json();
      setResumenData((prevData) => ({...prevData, [id]: json }));
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_resumen}${id}`, error);
    }
  };

  useEffect(() => {
    Promise.all([fetchResumen('1'), fetchResumen('2')]).then(() => {
      setLoading(false);
    });
  }, []);

  return { loading, resumen: resumenData };
};

export default useResumen;