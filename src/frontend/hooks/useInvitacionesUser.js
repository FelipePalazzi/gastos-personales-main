import { useState, useEffect } from "react";
import { pagina, symbols, alerts, atributos } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
const PAGINA_URL  = process.env.PAGINA_URL

import { decodeTokenUserId } from "../utils";


const useInvitacionesUser = () => {
  const [getinvitacionesuser, setinvitacionesuser] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accessToken, refreshToken } = useAuth();

  const fetchInvitacionesuser = async (query = 'estado=Pendiente') => {
    try {
      const userId = decodeTokenUserId(accessToken)
      const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_invitaciones}${symbols.barra}userid${symbols.barra}${userId}?${query}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "refresh-token": `${refreshToken}`,
        }
      });
      const json = await response.json();
      setinvitacionesuser(json);
      setLoading(false);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${pagina.pagina_invitaciones} User`, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitacionesuser();
  }, [accessToken]);

  return { getinvitacionesuser, loading, fetchInvitacionesuser };
};

export default useInvitacionesUser;