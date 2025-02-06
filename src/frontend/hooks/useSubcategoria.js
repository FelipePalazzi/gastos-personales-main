import { useState, useEffect } from "react";
import { pagina, symbols, alerts, atributos } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
const PAGINA_URL  = process.env.PAGINA_URL


const useSubcategoria = (keyId) => {
  const [subcategoria, setSubcategoria] = useState([]);
  const { accessToken, refreshToken } = useAuth();

  const fetchSubcategoria = async () => {
    try {
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_subcategoria}${symbols.barra}${keyId}?activo=null`, {
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
      setSubcategoria(json);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_subcategoria}`, error);
    }
  };

  useEffect(() => {
    fetchSubcategoria();
  }, [accessToken, keyId]);

  return { subcategoria };
};

export default useSubcategoria;