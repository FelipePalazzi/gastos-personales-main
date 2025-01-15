export const getEntidades = (dataSources) => {
    const {
        categorias,
        subcategorias,
        responsables,
        monedas,
        metodopagos,
        submetodopagos,
    } = dataSources;

    return [
        { key: 'categoria', label: 'Categoría', data:categorias },
        { key: 'subcategoria', label: 'Subcategoría', data: subcategorias },
        { key: 'responsable', label: 'Responsable', data: responsables },
        { key: 'id_moneda_origen', label: 'Moneda', data: monedas },
        { key: 'submetodopago', label: 'Submetodo de pago', data: submetodopagos },
    ]
}