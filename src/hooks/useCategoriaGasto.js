import { useState, useEffect, useCallback } from "react";
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pagina, symbols, alerts } from '../constants';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const useCategoriaGasto = (keyId) => {
  const [categoriaGastos, setCategoriaGastos] = useState([]);

  const fetchCategoriaGastos = useCallback(async () => {
    if (!keyId) return; 
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_categoria_gasto}${symbols.barra}${keyId}`
        , {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const json = await response.json();
      setCategoriaGastos(json);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_categoria_gasto}`, error);
    }
  }, []);

  useEffect(() => {
    fetchCategoriaGastos();
  }, [fetchCategoriaGastos]);

  return { categoriaGastos };
};

export default useCategoriaGasto;
