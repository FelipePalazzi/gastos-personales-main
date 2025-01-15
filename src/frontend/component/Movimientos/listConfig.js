import moment from 'moment';

export const getColumns = (esEntrada, atributos) => {
    if (esEntrada) {
        return [
            { key: 'fecha', label: atributos.fecha, sortable: true, render: (value) => moment.utc(value).format('DD/MM/YY') },
            { key: 'importe', label: 'Importe', sortable: true, render: (value) => Number(value).toFixed(0) },
            { key: 'monedamonto', label: `Moneda`, sortable: true },
            { key: 'responsable', label: atributos.responsable, sortable: true },
        ];
    } else {
        return [
            { key: 'fecha', label: atributos.fecha, sortable: true, render: (value) => moment.utc(value).format('DD/MM/YY') },
            { key: 'subcategoria', label: atributos.tipo, sortable: true },
            { key: 'importe', label: 'Importe', sortable: true, render: (value) => Number(value).toFixed(0) },
            { key: 'monedamonto', label: `Moneda`, sortable: true },
        ];
    }
};

export const getCardRows = (esEntrada, atributos, symbols) => {
    if (esEntrada) {
        return [
            { key: 'responsable', label: `${atributos.responsable}${symbols.colon}` },
            { key: 'ARG', label: `${symbols.peso}${atributos.ar}`, sortable: true, render: (value) => Number(value).toFixed(2) },
            { key: 'UYU', label: `${symbols.peso}${atributos.uy}`, sortable: true, render: (value) => Number(value).toFixed(2) },
            { key: 'USD', label: `${symbols.peso}${atributos.usd}`, sortable: true, render: (value) => Number(value).toFixed(2) },
            { key: 'comentario', label: `${atributos.descripcion}${symbols.colon}` },
            { key: 'metodopago', label: `Metodo de pago:` },
            { key: 'submetodopago', label: `Submetodo de pago:` },
        ];
    } else {
        return [
            { key: 'responsable', label: `${atributos.responsable}${symbols.colon}` },
            { key: 'categoria', label: `${atributos.categoria}${symbols.colon}` },
            { key: 'ARG', label: `${atributos.ar} ${symbols.peso}`, sortable: true, render: (value) => Number(value).toFixed(2) },
            { key: 'UYU', label: `${atributos.uy} ${symbols.peso}`, sortable: true, render: (value) => Number(value).toFixed(2) },
            { key: 'USD', label: `${atributos.usd} ${symbols.peso}`, sortable: true, render: (value) => Number(value).toFixed(2) },
            { key: 'comentario', label: `${atributos.descripcion}${symbols.colon}` },
            { key: 'metodopago', label: `Metodo de pago:` },
            { key: 'submetodopago', label: `Submetodo de pago:` },
        ];
    }
};

export const getAtributosSearch = (esEntrada, dataSources) => {
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
            { key: 'responsable', label: `Responsable`, renderType: 'searchDropdown', data: responsables },
        ];
    } else {
        return [
            { key: 'estado', label: 'Estado', renderType: 'searchDropdown', data: ['activo', 'historico', 'pendiente'] },
            { key: 'categoria', label: 'Categoría', renderType: 'searchDropdown', data: categorias },
            { key: 'subcategoria', label: 'Subcategoría', renderType: 'searchDropdown', data: subcategorias },
            { key: 'responsable', label: 'Responsable', renderType: 'searchDropdown', data: responsables },
            { key: 'moneda', label: 'Moneda', renderType: 'searchDropdown', data: monedas },
            { key: 'metodopago', label: 'Metodo de pago', renderType: 'searchDropdown', data: metodopagos },
            { key: 'submetodopago', label: 'Submetodo de pago', renderType: 'searchDropdown', data: submetodopagos },
            { key: 'comentario', label: 'Comentario', renderType: 'textInput' },
            { key: 'fechaDesde', label: 'Fecha Desde', renderType: 'datePicker' },
            { key: 'fechaHasta', label: 'Fecha Hasta', renderType: 'datePicker' },
        ];
    }
};