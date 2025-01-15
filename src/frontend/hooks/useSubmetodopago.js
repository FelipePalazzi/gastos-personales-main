import { useState, useEffect } from "react";
import { pagina, symbols, alerts, atributos } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
import { PAGINA_URL } from '@env';

const useSubmetodopago = (keyId) => {
  const [submetodopago, setSubmetodopago] = useState([]);
  const { accessToken, refreshToken } = useAuth();

  const fetchSubmetodopago = async () => {
    try {
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_submetodopago}${symbols.barra}${keyId}?activo=null`
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
      setSubmetodopago(json);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_submetodopago}`, error);
    }
  };

  useEffect(() => {
    fetchSubmetodopago();
  }, [accessToken, keyId]);

  return { submetodopago };
};

export default useSubmetodopago;
