import { useState, useEffect } from "react";
import { pagina, symbols, alerts, atributos } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
const PAGINA_URL  = process.env.PAGINA_URL


const useMonedasFaltantes = (keyId) => {
  const [monedasfaltantes, setmonedasfaltantes] = useState([]);
  const { accessToken, refreshToken } = useAuth();

  const fetchmonedasfaltantes = async () => {
    try {
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_moneda}${symbols.barra}faltantes${symbols.barra}${keyId}`, {
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
      setmonedasfaltantes(json);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_moneda} faltantes`, error);
    }
  };

  useEffect(() => {
    fetchmonedasfaltantes();
  }, [accessToken, keyId]);

  return { monedasfaltantes };
};

export default useMonedasFaltantes;