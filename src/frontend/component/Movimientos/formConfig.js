export const getAtributosForm = (esEntrada, dataSources) => {
    const {
        categorias,
        subcategorias,
        responsables,
        monedas,
        metodopagos,
        submetodopagos,
    } = dataSources;

    if (esEntrada) {
        return [
            { key: 'fecha', label: 'Fecha', renderType: 'datePicker' },
            { key: 'responsable', label: 'Responsable', data: responsables },
            { key: 'id_moneda_origen', label: 'Moneda', data: monedas },
            { key: 'comentario', label: 'Comentario', renderType: 'textInput' },
            { key: 'metodopago', label: 'Metodo de pago',  data: metodopagos },
            { key: 'submetodopago', label: 'Submetodo de pago', data: submetodopagos },
        ];
    } else {
        return [
            { key: 'fecha', label: 'Fecha', renderType: 'datePicker' },
            { key: 'categoria', label: 'Categoría', data:categorias },
            { key: 'subcategoria', label: 'Subcategoría', data: subcategorias },
            { key: 'responsable', label: 'Responsable', data: responsables },
            { key: 'id_moneda_origen', label: 'Moneda', data: monedas },
            { key: 'comentario', label: 'Comentario', renderType: 'textInput' },
            { key: 'metodopago', label: 'Metodo de pago',  data: metodopagos },
            { key: 'submetodopago', label: 'Submetodo de pago', data: submetodopagos },
        ];
    }
};

