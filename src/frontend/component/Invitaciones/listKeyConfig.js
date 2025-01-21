import moment from 'moment';

export const getColumns = () => {
    return [
        { key: 'nombre_usuario', label: 'Usuario', sortable: true },
        { key: 'enviado', label: 'Enviado', sortable: true, render: (value) => moment.utc(value).format('DD/MM/YY') },
        { key: 'vence', label: 'Vencimiento', sortable: true, render: (value) => moment.utc(value).format('DD/MM/YY')  },
    ];
};

export const getCardRows = () => {
    return [
        { key: 'email', label: `Email: ` },
        { key: 'estado', label: `Estado: ` },
    ];
};