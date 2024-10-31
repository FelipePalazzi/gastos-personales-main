import { useState, useEffect } from "react";
import {pagina,symbols ,alerts } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const useResponsableIngreso = () => {
  const [responsableIngresos, setresponsableIngresos] = useState([]);

  const fetchresponsableIngresos = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_responsable}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
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