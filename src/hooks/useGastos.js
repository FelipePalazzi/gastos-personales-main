import { useState, useEffect } from "react";
import {pagina,symbols ,alerts} from '../constants'
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const useGastos = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGastos = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_gasto}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
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