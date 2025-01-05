import { useState } from "react";
import { pagina, symbols, alerts } from '../../constants';
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;
import { decodeTokenUserId } from "../utils";
import { useAuth } from "../helpers/AuthContext";

const useGetKeys = () => {
  const [getkeys, setGetkeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accessToken,refreshToken, refreshAccessToken } = useAuth();
  let token = accessToken;
  const fetchGetKeys = async () => {
    try {
      if (!token) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          token = accessToken;
        } else {
          console.error('No se pudo refrescar el token, redirigir al login');
          return;
        }
      }
      const userId = decodeTokenUserId(token)
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_key}${symbols.barra}userid${symbols.barra}${userId}?activo=null`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          "refresh-token": refreshToken,
        }
      });
      const json = await response.json();
      setGetkeys(json);
      setLoading(false);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${atributos.gasto}`, error);
      setLoading(false);
    }
  };

  return { getkeys, loading, fetchGetKeys };
};

export default useGetKeys;