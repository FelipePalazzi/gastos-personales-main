import { useState, useEffect } from "react";
import { pagina, symbols, alerts, atributos } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
import { PAGINA_URL } from '@env';

const useCambioDia = (keyId) => {
    const [cambio, setCambio] = useState([]);
    const { accessToken, refreshToken } = useAuth();

    const fetchCambioDia = async (fecha = new Date()) => {
        try {
            const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_cambio}`
                , {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "refresh-token": `${refreshToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fecha: fecha })
                });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const json = await response.json();
            setCambio(json);
        } catch (error) {
            console.error(`${alerts.error_ocurrido}${pagina.pagina_cambio}`, error);
        }
    };

    useEffect(() => {
        fetchCambioDia();
    }, [accessToken, keyId]);

    return { cambio };
};

export default useCambioDia;
