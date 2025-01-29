import moment from 'moment';

export const getColumns = (esEntrada, atributos) => {
    if (esEntrada) {
        return [
            { key: 'fecha', label: atributos.fecha, sortable: true, render: (value) => moment.utc(value).format('DD/MM/YY') },
            { key: 'responsable', label: atributos.responsable, sortable: true },
            { key: 'importe', label: 'Importe', sortable: true, render: (value) => Number(value).toFixed(0) },
            { key: 'monedamonto', label: `Moneda`, sortable: true },
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
            { key: 'ARG', label: `Equivalencia en ${symbols.peso}${atributos.ar} `, sortable: true, render: (value) => Number(value).toFixed(2) },
            { key: 'UYU', label: `Equivalencia en ${symbols.peso}${atributos.uy} `, sortable: true, render: (value) => Number(value).toFixed(2) },
            { key: 'USD', label: `Equivalencia en ${symbols.peso}${atributos.usd} `, sortable: true, render: (value) => Number(value).toFixed(2) },
            { key: 'comentario', label: `${atributos.descripcion}${symbols.colon}` },
            { key: 'metododepago', label: `Metodo de pago:` },
            { key: 'submetododepago', label: `Submetodo de pago:` },
        ];
    } else {
        return [
            { key: 'responsable', label: `${atributos.responsable}${symbols.colon}` },
            { key: 'categoria', label: `${atributos.categoria}${symbols.colon}` },
            { key: 'subcategoria', label: `Subcategoria${symbols.colon}` },
            { key: 'ARG', label: `Equivalencia en ${atributos.ar} ${symbols.peso}`, sortable: true, render: (value) => Number(value).toFixed(2) },
            { key: 'UYU', label: `Equivalencia en ${atributos.uy} ${symbols.peso}`, sortable: true, render: (value) => Number(value).toFixed(2) },
            { key: 'USD', label: `Equivalencia en ${atributos.usd} ${symbols.peso}`, sortable: true, render: (value) => Number(value).toFixed(2) },
            { key: 'comentario', label: `${atributos.descripcion}${symbols.colon}` },
            { key: 'metododepago', label: `Metodo de pago: ` },
            { key: 'submetododepago', label: `Submetodo de pago: ` },
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
            { key: 'fechaDesde', label: 'Fecha Desde', renderType: 'datePicker' },
            { key: 'fechaHasta', label: 'Fecha Hasta', renderType: 'datePicker' },
            { key: 'estado', label: 'Estado', renderType: 'searchDropdown', data: [{ nombre: 'Activo', activo: true }, { nombre: 'Historico', activo: true }, { nombre: 'Archivado', activo: true }] },
            { key: 'responsable', label: 'Responsable', renderType: 'searchDropdown', data: responsables, icon: 'account' },
            { key: 'moneda', label: 'Moneda del gasto', renderType: 'searchDropdown', data: monedas, icon: 'currency-usd' },
            { key: 'metodopago', label: 'Metodo de pago', renderType: 'searchDropdown', data: metodopagos, icon: 'bank' },
            { key: 'submetodopago', label: 'Submetodo de pago', renderType: 'searchDropdown', data: submetodopagos, icon: 'credit-card' },
            { key: 'monedaFiltro', label: 'Moneda Filtro monto:', renderType: 'searchDropdown', data: monedas, icon: 'currency-usd' },
            { key: 'montoMax', label: 'Monto max.:', renderType: 'monedaInput' },
            { key: 'montoMin', label: 'Monto min.:', renderType: 'monedaInput' },
            { key: 'comentario', label: 'Comentario', renderType: 'textInput' },
        ];
    } else {
        return [
            { key: 'fechaDesde', label: 'Fecha Desde', renderType: 'datePicker' },
            { key: 'fechaHasta', label: 'Fecha Hasta', renderType: 'datePicker' },
            { key: 'estado', label: 'Estado', renderType: 'searchDropdown', data: [{ nombre: 'Activo', activo: true }, { nombre: 'Historico', activo: true }, { nombre: 'Archivado', activo: true }] },
            { key: 'categoria', label: 'Categoría', renderType: 'searchDropdown', data: categorias, icon: 'tag' },
            { key: 'subcategoria', label: 'Subcategoría', renderType: 'searchDropdown', data: subcategorias, icon: 'layers' },
            { key: 'responsable', label: 'Responsable', renderType: 'searchDropdown', data: responsables, icon: 'account' },
            { key: 'moneda', label: 'Moneda del gasto', renderType: 'searchDropdown', data: monedas, icon: 'currency-usd' },
            { key: 'metodopago', label: 'Metodo de pago', renderType: 'searchDropdown', data: metodopagos, icon: 'bank' },
            { key: 'submetodopago', label: 'Submetodo de pago', renderType: 'searchDropdown', data: submetodopagos, icon: 'credit-card' },
            { key: 'monedaFiltro', label: 'Filtrar por monto:', renderType: 'searchDropdown', data: monedas, icon: 'currency-usd' },
            { key: 'montoMax', label: 'Maximo:', renderType: 'monedaInput' },
            { key: 'montoMin', label: 'Minimo:', renderType: 'monedaInput' },
            { key: 'comentario', label: 'Comentario', renderType: 'textInput' },
        ];
    }
};