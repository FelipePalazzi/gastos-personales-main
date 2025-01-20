import { useState, useEffect } from "react";
import { pagina, symbols, alerts, atributos } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
import { PAGINA_URL } from '@env';
import { decodeTokenUserId } from "../utils";


const useGetKeys = () => {
  const [getkeys, setGetkeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accessToken, refreshToken, refreshAccessToken } = useAuth();
  const fetchGetKeys = async (query = 'activo=null') => {
    try {
      const userId = decodeTokenUserId(accessToken)
      if (!userId) throw new Error('Usuario no autenticado');
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_key}${symbols.barra}userid${symbols.barra}${userId}?${query}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "refresh-token": `${refreshToken}`,
        }
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          const tokenRefreshed = await refreshAccessToken(); // Ejecutar correctamente la función
          if (tokenRefreshed) {
            console.log('Token renovado, puedes reintentar la solicitud.');
            return await fetchGetKeys(query); // Reintenta la solicitud con el nuevo token
          } else {
            console.error('No se pudo renovar el token. Usuario no autenticado.');
          }
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const json = await response.json();
      setGetkeys(json);
      setLoading(false);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_key}`, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGetKeys();
  }, [accessToken]);

  return { getkeys, loading, fetchGetKeys };
};

export default useGetKeys;