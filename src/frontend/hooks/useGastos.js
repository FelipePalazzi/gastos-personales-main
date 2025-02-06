import { useState, useEffect } from "react";
import { pagina, symbols, alerts, atributos } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
const PAGINA_URL  = process.env.PAGINA_URL


const useGastos = (keyId) => {
  const { accessToken, refreshToken } = useAuth();
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGastos = async (query = 'limit=100&estado=Activo') => {
    try {
      setLoading(true)
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${keyId}?${query}`, {
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
      setGastos(json);
      setLoading(false);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${atributos.gasto}`, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, [accessToken, keyId]);

  return { gastos, loading, fetchGastos };
};

export default useGastos;
