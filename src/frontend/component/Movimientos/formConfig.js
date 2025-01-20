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
            { key: 'responsable', label: 'Responsable', data: responsables, icon: 'account' },
            { key: 'id_moneda_origen', label: 'Moneda', data: monedas, icon: 'currency-usd' },
            { key: 'comentario', label: 'Comentario', renderType: 'textInput' },
            { key: 'metodopago', label: 'Metodo de pago',  data: metodopagos, icon:'bank' },
            { key: 'submetodopago', label: 'Submetodo de pago', data: submetodopagos, icon:'credit-card' },
        ];
    } else {
        return [
            { key: 'fecha', label: 'Fecha', renderType: 'datePicker' },
            { key: 'categoria', label: 'Categoría', data:categorias, icon:'tag' },
            { key: 'subcategoria', label: 'Subcategoría', data: subcategorias, icon: 'layers' },
            { key: 'responsable', label: 'Responsable', data: responsables, icon: 'account' },
            { key: 'id_moneda_origen', label: 'Moneda', data: monedas, icon: 'currency-usd' },
            { key: 'monto', label: 'Importe'},
            { key: 'comentario', label: 'Comentario', renderType: 'textInput' },
            { key: 'metodopago', label: 'Metodo de pago',  data: metodopagos, icon:'bank' },
            { key: 'submetodopago', label: 'Submetodo de pago', data: submetodopagos, icon:'credit-card' },
        ];
    }
};

