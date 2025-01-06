import { useState, useEffect } from "react";
import { pagina, symbols, alerts } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
import * as Keychain from 'react-native-keychain';
import { PAGINA_URL} from '@env';

const useGastos = (keyId) => {
  const { accessToken, refreshToken} = useAuth(); 
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchGastos = async () => {
    try {
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${1}?estado=activo`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "refresh-token": `${refreshToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error en la solicitud de los gastos');
      }
      const json = await response.json();
      setGastos(json);
      setLoading(false);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${atributos.gasto}`, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, [accessToken]); // Se vuelve a llamar si el accessToken cambia

  return { gastos, loading, fetchGastos };
};

export default useGastos;
