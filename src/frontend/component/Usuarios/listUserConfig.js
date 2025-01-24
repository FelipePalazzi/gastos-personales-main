import moment from 'moment';

export const getColumns = () => {
    return [
        { key: 'username', label: 'Usuario', sortable: true },
        { key: 'role', label: 'Rol', sortable: true },
        { key: 'fecha_union', label: 'Unido', sortable: true, render: (value) => moment.utc(value).format('DD/MM/YY') },
    ];
};

export const getCardRows = () => {
    return [
        { key: 'email', label: `Email: ` },
    ];
};

export const getAtributosSearch = () => {
    return [
        { key: 'fechaDesde', label: 'Fecha Desde', renderType: 'datePicker' },
        { key: 'fechaHasta', label: 'Fecha Hasta', renderType: 'datePicker' },
        {
            key: 'estado', label: 'Estado', renderType: 'searchDropdown', data:
                [{ nombre: 'Activo', activo: true },
                { nombre: 'Expulsado', activo: true },
                { nombre: 'Abandono', activo: true }]
        },
        {
            key: 'role', label: 'Rol', renderType: 'searchDropdown', data:
                [{ nombre: 'Dueño', activo: true },
                { nombre: 'Administrador', activo: true },
                { nombre: 'Usuario', activo: true },
                { nombre: 'Resumenes', activo: true }
            ]
        },
        { key: 'username', label: 'Nombre de Usuario', renderType: 'textInput' },
    ];
};