import { useState, useEffect } from "react";
import {pagina,symbols ,alerts } from '../constants'
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const useIngresos = () => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIngresos = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_ingreso}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
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