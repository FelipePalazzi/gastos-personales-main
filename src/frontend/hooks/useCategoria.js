import { useState, useEffect } from "react";
import { pagina, symbols, alerts, atributos } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
import { PAGINA_URL } from '@env';

const useCategoria = (keyId) => {
  const [categoria, setCategoria] = useState([]);
  const { accessToken, refreshToken } = useAuth();

  const fetchCategoria = async () => {
    try {
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_categoria}${symbols.barra}${keyId}?activo=null`
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
      setCategoria(json);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_categoria}`, error);
    }
  };

  useEffect(() => {
    fetchCategoria();
  }, [accessToken, keyId]);

  return { categoria };
};

export default useCategoria;
