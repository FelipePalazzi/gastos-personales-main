import { useState } from "react";
import { pagina, symbols, alerts } from '../../constants';
import { PAGINA_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeTokenUserId } from "../utils";
import { useAuth } from "../helpers/AuthContext";

const useGetKeys = () => {
  const [getkeys, setGetkeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accessToken,refreshToken } = useAuth();
  const fetchGetKeys = async () => {
    try {
      const userId = decodeTokenUserId(accessToken)
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_key}${symbols.barra}userid${symbols.barra}${userId}?activo=null`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
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