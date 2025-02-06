import { useState, useEffect } from "react";
import { pagina, symbols, alerts, atributos } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
const PAGINA_URL  = process.env.PAGINA_URL


const useResponsable = (keyId) => {
  const [responsable, setresponsable] = useState([]);
  const { accessToken, refreshToken } = useAuth();

  const fetchresponsable = async () => {
    try {
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_responsable}${symbols.barra}${keyId}?activo=null`, {
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
      setresponsable(json);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_responsable}`, error);
    }
  };

  useEffect(() => {
    fetchresponsable();
  }, [accessToken, keyId]);

  return { responsable };
};

export default useResponsable;