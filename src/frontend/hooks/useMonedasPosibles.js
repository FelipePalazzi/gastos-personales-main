import { useState, useEffect } from "react";
import { pagina, symbols, alerts, atributos } from '../../constants';
import { useAuth } from "../helpers/AuthContext";
const PAGINA_URL  = process.env.PAGINA_URL


const useMonedasPosibles = (keyId) => {
    const [monedasPosibles, setMonedasPosibles] = useState([]);
    const { accessToken, refreshToken } = useAuth();

    const fetchMonedasPosibles = async () => {
        try {
            const response = await globalThis.fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_monedas_posibles}`
                , {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "refresh-token": `${refreshToken}`
                    }
                });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const json = await response.json();
            setMonedasPosibles(json);
        } catch (error) {
            console.error(`${alerts.error_ocurrido}${pagina.pagina_monedas_posibles}`, error);
        }
    };

    useEffect(() => {
        fetchMonedasPosibles();
    }, [accessToken, keyId]);

    return { monedasPosibles };
};

export default useMonedasPosibles;
