export const getAtributosSearch = () => {
    return [
        {
            key: 'activo', label: 'Activo', renderType: 'searchDropdown', data:
                [{ nombre: 'Activo', activo: true },
                { nombre: 'Archivado', activo: true }]
        },
        {
            key: 'estado', label: 'Estado', renderType: 'searchDropdown', data:
                [{ nombre: 'Activo', activo: true },
                { nombre: 'Expulsado', activo: true },
                { nombre: 'Abandono', activo: true }]
        },
        { key: 'nombre', label: 'Nombre', renderType: 'textInput' },
        {
            key: 'role', label: 'Rol', renderType: 'searchDropdown', data:
                [{ nombre: 'Dueño', activo: true },
                { nombre: 'Administrador', activo: true },
                { nombre: 'Usuario', activo: true },
                { nombre: 'Resumenes', activo: true }
                ]
        }
    ];
};