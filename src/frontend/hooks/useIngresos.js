import { useState, useEffect } from "react";
import { pagina, symbols, alerts, atributos } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
import * as Keychain from 'react-native-keychain';
import { PAGINA_URL } from '@env';

const useIngresos = (keyId) => {
  const { accessToken, refreshToken } = useAuth();
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIngresos = async (query = '') => {
    try {
      setLoading(true)
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}${keyId}?${query}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "refresh-token": `${refreshToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error en la solicitud de los ingresos');
      }
      const json = await response.json();
      setIngresos(json);
      setLoading(false);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${atributos.ingreso}`, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngresos();
  }, [accessToken, keyId]);

  return { ingresos, loading, fetchIngresos };
};

export default useIngresos;
