import { useState, useEffect } from "react";
import { pagina, symbols, alerts } from '../constants.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const useResumen = () => {
  const [resumenData, setResumenData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchResumen = async (id) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_resumen}${symbols.barra}${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });  
        if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const json = await response.json();
      setResumenData((prevData) => ({...prevData, [id]: json }));
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_resumen}${id}`, error);
    }
  };
  const fetchResumen5 = async (id) => {
    try {
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_resumen}${symbols.barra}5${symbols.barra}${id}`        , {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const json = await response.json();
      setResumenData((prevData) => ({...prevData, [`5,${id}`]: json }));
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_resumen}${id}`, error);
    }
  };
  useEffect(() => {
    const ids = ['1', '2', '3', '4'];
    const promises = ids.map((id) => fetchResumen(id));
    promises.push(...ids.map((id) => fetchResumen5(id)));
    Promise.all(promises).then(() => {
      setLoading(false);
    });
  }, []);

  return { loading, resumen: resumenData };
};

export default useResumen;