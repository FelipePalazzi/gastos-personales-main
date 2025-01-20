export const getEntidades = (dataSources) => {
    const {
        categorias,
        subcategorias,
        responsables,
        monedas,
        submetodopagos,
    } = dataSources;

    return [
        { key: 'categoria', label: 'Categoría', data:categorias, icon:'tag'},
        { key: 'subcategoria', label: 'Subcategoría', data: subcategorias, icon: 'layers' },
        { key: 'responsable', label: 'Responsable', data: responsables, icon: 'account' },
        //{ key: 'id_moneda_origen', label: 'Moneda', data: monedas, icon: 'currency-usd' },
        { key: 'submetodopago', label: 'Submetodo de pago', data: submetodopagos, icon:'credit-card' },
    ]
}