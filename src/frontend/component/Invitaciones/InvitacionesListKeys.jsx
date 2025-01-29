import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Header from '../Comunes/DataTable/Header.jsx';
import Rows from '../Comunes/DataTable/Rows.jsx';
import Pagination from '../Comunes/DataTable/Pagination.jsx';
import { styleMovimiento, styleComun } from '../../styles/styles.js';
import { getColumns, getCardRows, getAtributosSearch } from './listKeyConfig.js';
import useInvitacionesKey from '../../hooks/useInvitacionesKey.js';
import PickerModal from '../Keys/PickerModal.jsx';
import theme from '../../theme/theme.js';
import CodigoInvitacion from './Dialogs/CodigoInvitacion.jsx';
import AprobarInvitacion from './Dialogs/AprobarInvitacion.jsx';
import RechazarInvitacion from './Dialogs/RechazarInvitacion.jsx';
import BusquedaAvanzada from '../Comunes/Busqueda/BusquedaAvanzada.jsx';
import useTableData from '../Comunes/DataTable/useTableData.jsx';

const InvitacionesListKeys = ({ keyId, nombreKey, codigo, navigation }) => {
    const [message, setMessage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [expanded, setExpanded] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [visibleCodigo, setVisibleCodigo] = useState(false);
    const [visibleAprobar, setVisibleAprobar] = useState(false);
    const [visibleCancelar, setVisibleCancelar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { getinvitacioneskey, loading, fetchInvitacioneskey } = useInvitacionesKey(keyId);

    const data = useMemo(() => {
        return Array.isArray(getinvitacioneskey)
            ? getinvitacioneskey.map(({ id_invitacion, ...rest }) => ({
                id: id_invitacion,
                ...rest,
            }))
            : [];
    }, [getinvitacioneskey]);

    const handlePressRow = useCallback((invitacionId, index) => {
        setExpanded((prevExpanded) => ({ ...prevExpanded, [invitacionId]: !prevExpanded[invitacionId] }));
    }, []);

    const prevKeyId = useRef(keyId);

    const fetchData = useCallback(
        async (query) => {
            if (keyId) {
                await fetchInvitacioneskey(query);
            }
        },
        [fetchInvitacioneskey, keyId]
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

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData(appliedFilters);
        setRefreshing(false);
    }, [fetchData]);

    const handlePress = () => {
        setVisibleCodigo(false);
    };

    useEffect(() => {
        if (keyId !== prevKeyId.current) {
            prevKeyId.current = keyId;
            onRefresh();
        }
    }, [keyId, onRefresh]);

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

    const handleSubmit = async () => {
        setVisibleCodigo(true)
    }
    const [invitacionId, setInvitacionId] = useState(null);

    const handleAprobar = async (item) => {
        setInvitacionId(item.id)
        setVisibleAprobar(true)
    }

    const handleCancelar = async (item) => {
        setInvitacionId(item.id)
        setVisibleCancelar(true)
    }

    const columns = useMemo(() => getColumns(), []);

    const cardrows = useMemo(() => getCardRows(), []);

    return (
        <>
            <View style={{ backgroundColor: styleMovimiento.colorBackground }}>

                <View style={{ flexDirection: 'row', backgroundColor: theme.colors.primary, paddingTop: 45, paddingBottom: 8, alignItems: 'center' }}>
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
                    <View style={styleComun.keys.container}>
                        <TouchableOpacity
                            style={styleComun.keys.button}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={styleComun.keys.buttonText}>
                                {nombreKey}
                            </Text>
                            <Icon name="menu-down" size={20} color={theme.colors.white} style={{ marginLeft: 10 }} />
                        </TouchableOpacity>

                    </View>
                </View>
                <PickerModal modalVisible={modalVisible} setModalVisible={setModalVisible} navigation={navigation} />
                <CodigoInvitacion visible={visibleCodigo} handlePress={handlePress} codigo={codigo} keyName={nombreKey} />

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
                onEdit={handleAprobar}
                boton1={(appliedFilters?.estado === 'Pendiente' || appliedFilters?.estado === '') ? 'Aprobar' : null}
                onDelete={handleCancelar}
                boton2={(appliedFilters?.estado === 'Pendiente' || appliedFilters?.estado === '') ? 'Cancelar' : null}
                loading={isLoading}
                page={page}
                pageSize={pageSize}
                style={styleMovimiento}
                message={
                    getinvitacioneskey.message === 'No tienes acceso a esta funcionalidad'
                        ? getinvitacioneskey.message
                        : message
                }
            />

            <Pagination
                page={page}
                onPageChange={handlePageChange}
                numberOfPages={numberOfPages}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={pageSize}
                handleSubmit={handleSubmit}
                onItemsPerPageChange={handleItemsPerPageChange}
                style={styleMovimiento}
                IconHandleSumbit={'clipboard-outline'}
                textIconSumbit={'Copiar codigo'}
            />
            <AprobarInvitacion visible={visibleAprobar} setVisible={setVisibleAprobar} invitacionId={invitacionId} />
            <RechazarInvitacion visible={visibleCancelar} setVisible={setVisibleCancelar} invitacionId={invitacionId} />
        </>
    );
};

export default InvitacionesListKeys;