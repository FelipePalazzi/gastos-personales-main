export const getMonedas = (dataSources) => {
    const {
        monedas,
        monedasFaltantes
    } = dataSources;

    return [
        { key: 'id_moneda', label: 'Moneda', data: monedas, icon: 'currency-usd' },
        { key: 'id_moneda_faltante', label: 'Moneda', data: monedasFaltantes, icon: 'currency-usd' },
    ]
}