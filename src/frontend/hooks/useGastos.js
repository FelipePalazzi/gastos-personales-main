import { useState, useEffect } from "react";
import { pagina, symbols, alerts } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
import * as Keychain from 'react-native-keychain';

const useGastos = (keyId) => {
  const { accessToken, refreshToken, refreshAccessToken } = useAuth(); // Asegúrate de que tienes estos valores
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGastos = async () => {
    try {
      // Verifica si el accessToken está disponible
      if (!accessToken) {
        console.log('AccessToken no disponible. Refrescando...');
        const refreshed = await refreshAccessToken(); // Refresca el accessToken si no hay uno
        if (!refreshed) {
          throw new Error('No se pudo obtener el nuevo accessToken');
        }
      }

      // Después de asegurarte que tienes un accessToken, procede con la solicitud
      const credentials = await Keychain.getGenericPassword();
      const refreshToken = credentials.password;

      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${1}?estado=historico`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`, // Usa el accessToken refrescado o disponible
          "refresh-token": refreshToken,
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
