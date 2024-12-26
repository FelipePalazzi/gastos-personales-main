import { useState } from "react";
import {symbols ,alerts} from '../constants'
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const useGetKeys = () => {
  const [getkeys, setGetkeys] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGetKeys = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}conseguirllaves`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
            "user_id": "2"
          }
      });
      const json = await response.json();
      setGetkeys(json);
   console.log(json)

      setLoading(false);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${atributos.gasto}`, error);
      setLoading(false);
    }
  };

  return { getkeys, loading, fetchGetKeys };
};

export default useGetKeys;