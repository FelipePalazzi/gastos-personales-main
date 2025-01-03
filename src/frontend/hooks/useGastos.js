import { useState } from "react";
import {pagina,symbols ,alerts} from '../constants'
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const useGastos = (keyId) => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGastos = async () => {
    if (!keyId) return; 
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${keyId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      setGastos(json);
      setLoading(false);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${atributos.gasto}`, error);
      setLoading(false);
    }
  };

  return { gastos, loading, fetchGastos };
};

export default useGastos;