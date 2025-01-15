import { useState, useEffect } from "react";
import { pagina, symbols, alerts, atributos } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
import { PAGINA_URL } from '@env';

const useMetodopago = (keyId) => {
  const [metodopago, setMetodopago] = useState([]);
  const { accessToken, refreshToken } = useAuth();

  const fetchMetodopago = async () => {
    try {
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_metodopago}`
        , {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "refresh-token": `${refreshToken}`
          },
        });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const json = await response.json();
      setMetodopago(json);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_metodopago}`, error);
    }
  };

  useEffect(() => {
    fetchMetodopago();
  }, [accessToken, keyId]);

  return { metodopago };
};

export default useMetodopago;
