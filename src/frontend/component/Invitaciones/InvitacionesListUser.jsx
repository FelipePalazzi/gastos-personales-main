import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { getSortIcon, decodeTokenUsername } from '../../utils.js';
import SearchDropdown from '../Comunes/Busqueda/SearchDropdown.jsx';
import Header from '../Comunes/DataTable/Header.jsx';
import Rows from '../Comunes/DataTable/Rows.jsx';
import Pagination from '../Comunes/DataTable/Pagination.jsx';
import { styleMovimiento, styleComun, screenWidth } from '../../styles/styles.js';
import { getColumns, getCardRows } from './listUserConfig.js';
import useInvitacionesUser from '../../hooks/useInvitacionesUser.js';
import theme from '../../theme/theme.js';
import CancelarInvitacion from './Dialogs/CancelarInvitacion.jsx';
import { useAuth } from '../../helpers/AuthContext.js';
import CodigoInvitacionIngresar from './Dialogs/CodigoInvitacionIngresar.jsx';

const InvitacionesListUser = ({ navigation }) => {
    const [message, setMessage] = useState('');
    const [orden, setOrden] = useState('asc');
    const [columna, setColumna] = useState('id');
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [numberOfItemsPerPage, onItemsPerPageChange] = useState(10);
    const [expanded, setExpanded] = useState({});
    const [visibleCancelar, setVisibleCancelar] = useState(false);
    const { accessToken } = useAuth()
    const nombreUsuario = decodeTokenUsername(accessToken)
    const { getinvitacionesuser, loading, fetchInvitacionesuser } = useInvitacionesUser();

    const data = useMemo(() => {
        return Array.isArray(getinvitacionesuser)
            ? getinvitacionesuser.map(({ id_invitacion, ...rest }) => ({
                id: id_invitacion,
                ...rest,
            }))
            : [];
    }, [getinvitacionesuser]);

    const handlePressRow = useCallback((invitacionId, index) => {
        setExpanded((prevExpanded) => ({ ...prevExpanded, [invitacionId]: !prevExpanded[invitacionId] }));
    }, []);

    const prevQuery = useRef(query);

    const fetchData = useCallback(
        async (filters) => {
            await fetchInvitacionesuser(filters);
        },
        [fetchInvitacionesuser]
    );

    const [hasRefreshed, setHasRefreshed] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        const filters = query ? `estado=${query}` : `estado=Pendiente`;
        await fetchData(filters);
        setRefreshing(false);
        setHasRefreshed(true); 
    }, [fetchData, query]);

    const prevStates = useRef({ visibleCancelar: false, visibleCodigo: false });

    useEffect(() => {
        const { visibleCancelar: prevVisibleCancelar, visibleCodigo: prevVisibleCodigo } = prevStates.current;
    
        if (
            (prevVisibleCancelar && !visibleCancelar) || 
            (prevVisibleCodigo && !visibleCodigo)       
        ) {
            onRefresh();
        }
    
        prevStates.current = { visibleCancelar, visibleCodigo };
    }, [visibleCancelar, visibleCodigo, onRefresh]);
    

    useEffect(() => {
        if (query !== prevQuery.current) {
            prevQuery.current = query;
            onRefresh();
        }
    }, [query, onRefresh]);

    const handleSort = useCallback((columna) => {
        setColumna(columna);
        const ordenInverso = (orden === 'asc' ? 'desc' : orden === 'desc' ? 'no orden' : 'asc');
        setOrden(ordenInverso);
    }, [orden]);

    const getIcon = (columna) => {
        return getSortIcon(columna, orden, columna);
    };

    const handlePageChange = (page) => {
        setPage(page);
    };

    const handleItemsPerPageChange = (value) => {
        setPage(0);
        setPageSize(value);
        onItemsPerPageChange(value);
    };
    useEffect(() => {
        onRefresh();
    }, [numberOfItemsPerPage]);

    const [invitacionId, setInvitacionId] = useState(null);

    const handleCancelar = async (item) => {
        setInvitacionId(item.id)
        setVisibleCancelar(true)
    }

    const columns = useMemo(() => getColumns(), []);

    const cardrows = useMemo(() => getCardRows(), []);

    const numberOfPages = Math.ceil(data.length / pageSize)
    const numberOfItemsPerPageList = [10, 15, 20, 50, 100];

    const [query, setQuery] = React.useState('Pendiente')

    useEffect(() => {
        if (loading) {
            setMessage('Cargando invitaciones...');
        } else if (!loading && data.length === 0) {
            setMessage(
                query === ''
                    ? 'Ingrese un estado'
                    : `No hay invitaciones en ${query}`
            );
        } else {
            setMessage('');
        }
    }, [loading, data, query]);

    const [visibleCodigo, setVisibleCodigo] = useState(false);
    const handlePressCodigo = () => {
        setVisibleCodigo(!visibleCodigo);
    };

    return (
        <>
            <View style={{ backgroundColor: styleMovimiento.colorBackground }}>

                <View style={{ justifyContent: 'space-between', flexDirection: 'row', backgroundColor: theme.colors.primary, paddingTop: 45, paddingBottom: 8 }}>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{
                                marginLeft: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={() => navigation.goBack()}
                        >
                            <Icon name="keyboard-backspace" size={30} color={theme.colors.white} style={{ paddingEnd: 20 }} />

                        </TouchableOpacity>
                    </View>
                    <View style={[styleComun.keys.container, { width: screenWidth / 2 }]}>
                        <Icon name="account" size={20} color={theme.colors.white} style={{ marginLeft: 10 }} />
                        <Text style={styleComun.keys.buttonText}>
                            {nombreUsuario ? nombreUsuario : 'Cargando...'}
                        </Text>
                    </View>
                </View>
                <SearchDropdown
                    options={
                        [{ nombre: 'Pendiente', activo: true },
                        { nombre: 'Expirada', activo: true },
                        { nombre: 'Aprobada', activo: true },
                        { nombre: 'Cancelada', activo: true },
                        { nombre: 'Rechazada', activo: true }]
                    }
                    placeholder={'Estado'}
                    onSelect={(value) => {
                        setQuery(value.nombre);
                    }}
                    value={query}
                    onClear={() => {
                        setQuery('');
                    }}
                    style={{ margin: 10, marginBottom: 0, width: '95%' }}
                />
                <Header
                    columns={columns}
                    handleSort={handleSort}
                    getIcon={getIcon}
                    style={styleMovimiento}
                />

            </View>
            <Rows
                expanded={expanded}
                data={data}
                onRowClick={handlePressRow}
                columns={columns}
                Cardrows={cardrows}
                onRefresh={onRefresh}
                refreshing={refreshing}
                onDelete={handleCancelar}
                boton2={(query === 'Pendiente' || query === '') ? 'Cancelar' : null}
                loading={loading}
                page={page}
                pageSize={pageSize}
                style={styleMovimiento}
                message={message}
            />

            <Pagination
                page={page}
                onPageChange={handlePageChange}
                numberOfPages={numberOfPages}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={numberOfItemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                style={styleMovimiento}
                handleSubmit={handlePressCodigo}
                IconHandleSumbit={'clipboard-plus-outline'}
                textIconSumbit={'Unirse'}
            />
            <CancelarInvitacion visible={visibleCancelar} setVisible={setVisibleCancelar} invitacionId={invitacionId} />
            <CodigoInvitacionIngresar visible={visibleCodigo} handlePress={handlePressCodigo} />
        </>
    );
};

export default InvitacionesListUser;