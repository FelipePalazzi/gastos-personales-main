
import { useMemo } from "react";
import useCategoria from "./useCategoria";
import useSubcategoria from "./useSubcategoria";
import useResponsable from "./useResponsable";
import useMoneda from "./useMoneda";
import useMetodopago from "./useMetodopago";
import useSubmetodopago from "./useSubmetodopago";

const useCombinedData = (keyId) => {
    const { categoria } = useCategoria(keyId);
    const { subcategoria } = useSubcategoria(keyId);
    const { responsable } = useResponsable(keyId);
    const { moneda } = useMoneda(keyId);
    const { metodopago } = useMetodopago(keyId);
    const { submetodopago } = useSubmetodopago(keyId);

    const combinedData = useMemo(() => {
        return { categoria, subcategoria, responsable, moneda, metodopago, submetodopago };
    }, [categoria, subcategoria, responsable, moneda, metodopago, submetodopago]);

    return { ...combinedData };
};

export default useCombinedData