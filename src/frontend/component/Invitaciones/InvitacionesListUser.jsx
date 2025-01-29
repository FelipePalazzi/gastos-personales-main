import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { getSortIcon, decodeTokenUsername } from '../../utils.js';
import Header from '../Comunes/DataTable/Header.jsx';
import Rows from '../Comunes/DataTable/Rows.jsx';
import Pagination from '../Comunes/DataTable/Pagination.jsx';
import { styleMovimiento, styleComun, screenWidth } from '../../styles/styles.js';
import { getColumns, getCardRows, getAtributosSearch } from './listUserConfig.js';
import useInvitacionesUser from '../../hooks/useInvitacionesUser.js';
import theme from '../../theme/theme.js';
import CancelarInvitacion from './Dialogs/CancelarInvitacion.jsx';
import { useAuth } from '../../helpers/AuthContext.js';
import CodigoInvitacionIngresar from './Dialogs/CodigoInvitacionIngresar.jsx';
import BusquedaAvanzada from '../Comunes/Busqueda/BusquedaAvanzada.jsx';
import useTableData from '../Comunes/DataTable/useTableData.jsx';

const InvitacionesListUser = ({ keyId, navigation }) => {
    const [message, setMessage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [expanded, setExpanded] = useState({});
    const [visibleCancelar, setVisibleCancelar] = useState(false);
    const { accessToken } = useAuth()
    const nombreUsuario = decodeTokenUsername(accessToken)
    const { getinvitacionesuser, loading, fetchInvitacionesuser } = useInvitacionesUser();
    const [isLoading, setIsLoading] = useState(false);

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

    const fetchData = useCallback(
        async (filters) => {
            await fetchInvitacionesuser(filters);
        },
        [fetchInvitacionesuser]
    );

    const handleApplyFilters = (filters) => {
        const query = new URLSearchParams({
            ...filters,
        }).toString();
        setAppliedFilters(filters);
        setIsLoading(true);
        fetchData(query).finally(() => setIsLoading(false));
    };

    const atributosSearch = getAtributosSearch()

    const [appliedFilters, setAppliedFilters] = useState({estado:'Pendiente'});
    
    const [hasRefreshed, setHasRefreshed] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData(appliedFilters);
        setRefreshing(false);
        setHasRefreshed(true);
    }, [fetchData, appliedFilters]);

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

    const {
        page,
        pageSize,
        numberOfPages,
        currentData,
        handleSort,
        getIcon,
        handlePageChange,
        handleItemsPerPageChange,
        numberOfItemsPerPageList
    } = useTableData(data, 10, 'enviado', 'desc');

    useEffect(() => {
        onRefresh();
    }, [pageSize]);

    const [invitacionId, setInvitacionId] = useState(null);

    const handleCancelar = async (item) => {
        setInvitacionId(item.id)
        setVisibleCancelar(true)
    }

    const columns = useMemo(() => getColumns(), []);

    const cardrows = useMemo(() => getCardRows(), []);

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
                            onPress={() => navigation.navigate('HomeTab')}
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

                <BusquedaAvanzada
                    onApplyFilters={handleApplyFilters}
                    atributosSearch={atributosSearch}
                    appliedFilters={appliedFilters}
                    keyId={keyId}
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
                data={currentData}
                onRowClick={handlePressRow}
                columns={columns}
                Cardrows={cardrows}
                onRefresh={onRefresh}
                refreshing={refreshing}
                onDelete={handleCancelar}
                boton2={(appliedFilters?.estado === 'Pendiente' || appliedFilters?.estado === '') ? 'Cancelar' : null}
                loading={isLoading}
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
                numberOfItemsPerPage={pageSize}
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