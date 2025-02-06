import { useState, useEffect } from "react";
import { pagina, symbols, alerts, atributos } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
const PAGINA_URL  = process.env.PAGINA_URL


const useInvitacionesKey = (keyId) => {
  const [getinvitacioneskey, setinvitacioneskey] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accessToken, refreshToken } = useAuth();

  const fetchInvitacioneskey = async (query='estado=Pendiente') => {
    try {
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_invitaciones}${symbols.barra}keyid${symbols.barra}${keyId}?${query}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "refresh-token": `${refreshToken}`,
        }
      });
      const json = await response.json();
      setinvitacioneskey(json);
      setLoading(false);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_invitaciones}`, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitacioneskey();
  }, [accessToken]);

  return { getinvitacioneskey, loading, fetchInvitacioneskey };
};

export default useInvitacionesKey;