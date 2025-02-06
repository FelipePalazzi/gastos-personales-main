import { useState, useEffect } from "react";
import { pagina, symbols, alerts, atributos } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
const PAGINA_URL  = process.env.PAGINA_URL

import moment from "moment";

const useCambioDia = (keyId) => {
    const [cambio, setCambio] = useState([]);
    const { accessToken, refreshToken } = useAuth();
    const fechaHoy = moment().format('YYYY-MM-DD HH:mm:ss')

    const fetchCambioDia = async (query=`fecha=${fechaHoy}`) => {
        try {
            const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_cambio}?${query}`
                , {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "refresh-token": `${refreshToken}`,
                        'Content-Type': 'application/json'
                    },
                });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const json = await response.json();
            setCambio(json);
        } catch (error) {
          console.error("Error al obtener el cambio:", error);
        }
    };

    useEffect(() => {
        fetchCambioDia();
    }, [accessToken, keyId]);

    return { cambio, fetchCambioDia };
};

export default useCambioDia;
