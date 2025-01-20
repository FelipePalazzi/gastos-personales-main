import { useState, useEffect } from "react";
import { pagina, symbols, alerts, atributos } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
import { PAGINA_URL } from '@env';

const useGetUserperKey = (keyId) => {
  const { accessToken, refreshToken } = useAuth();
  const [userperkey, setUserperkey] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserperkey = async () => {
    try {
      setLoading(true)
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_key}${symbols.barra}keyid${symbols.barra}${keyId}`, {
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
      setUserperkey(json);
      setLoading(false);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_key} Userperkey`, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserperkey();
  }, [accessToken, keyId]);

  return { userperkey, loading, fetchUserperkey };
};

export default useGetUserperKey;
