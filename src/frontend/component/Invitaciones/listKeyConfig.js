import moment from 'moment';

export const getColumns = () => {
    return [
        { key: 'nombre_usuario', label: 'Usuario', sortable: true },
        { key: 'enviado', label: 'Enviado', sortable: true, render: (value) => moment.utc(value).format('DD/MM/YY') },
        { key: 'vence', label: 'Vencimiento', sortable: true, render: (value) => moment.utc(value).format('DD/MM/YY') },
    ];
};

export const getCardRows = () => {
    return [
        { key: 'email', label: `Email: ` },
        { key: 'estado', label: `Estado: ` },
    ];
};

export const getAtributosSearch = () => {
    return [
        {
            key: 'estado', label: 'Estado', renderType: 'searchDropdown', data:
                [{ nombre: 'Pendiente', activo: true },
                { nombre: 'Aprobada', activo: true },
                { nombre: 'Rechazada', activo: true },
                { nombre: 'Cancelada', activo: true },
                { nombre: 'Expirada', activo: true }]
        },
        { key: 'username', label: 'Nombre de usuario', renderType: 'TextInput' },
        { key: 'fechaEnvioDesde', label: 'Fecha Envio Desde', renderType: 'datePicker' },
        { key: 'fechaEnvioHasta', label: 'Fecha Envio Hasta', renderType: 'datePicker' },
        { key: 'fechaExpiracionDesde', label: 'Fecha Expiracion Desde', renderType: 'datePicker' },
        { key: 'fechaExpiracionHasta', label: 'Fecha Expiracion Hasta', renderType: 'datePicker' },
    ];
};