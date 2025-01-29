export const getAtributosSearch = (dataSources) => {
    const {
        categorias,
        subcategorias,
        responsables,
        monedas,
        metodopagos,
        submetodopagos,
    } = dataSources;
        return [
            { key: 'fechaDesde', label: 'Fecha Desde', renderType: 'datePicker' },
            { key: 'fechaHasta', label: 'Fecha Hasta', renderType: 'datePicker' },
            { key: 'estado', label: 'Estado', renderType: 'searchDropdown', data: [{nombre:'Activo', activo:true}, {nombre:'Historico', activo:true}, {nombre:'Archivado', activo:true}] },
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
};