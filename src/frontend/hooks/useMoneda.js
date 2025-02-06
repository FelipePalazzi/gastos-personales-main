import { useState, useEffect } from "react";
import { pagina, symbols, alerts, atributos } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
const PAGINA_URL  = process.env.PAGINA_URL


const useMoneda = (keyId) => {
  const [moneda, setmoneda] = useState([]);
  const { accessToken, refreshToken } = useAuth();

  const fetchmoneda = async () => {
    try {
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_moneda}${symbols.barra}todas${symbols.barra}${keyId}?activo=null`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "refresh-token": `${refreshToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const json = await response.json();
      setmoneda(json);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_moneda}`, error);
    }
  };

  useEffect(() => {
    fetchmoneda();
  }, [accessToken, keyId]);

  return { moneda };
};

export default useMoneda;