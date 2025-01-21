import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { atributos, symbols } from '../../../constants.js';
import { getSortIcon } from '../../utils.js';
import SearchDropdown from '../Comunes/Busqueda/SearchDropdown.jsx';
import Header from '../Comunes/DataTable/Header.jsx';
import Rows from '../Comunes/DataTable/Rows.jsx';
import Pagination from '../Comunes/DataTable/Pagination.jsx';
import { styleMovimiento, styleComun } from '../../styles/styles.js';
import { getColumns, getCardRows } from './listKeyConfig.js';
import useInvitacionesKey from '../../hooks/useInvitacionesKey.js';
import PickerModal from '../Main/PickerModal.jsx';
import theme from '../../theme/theme.js';
import CodigoInvitacion from './Dialogs/CodigoInvitacion.jsx';
import AprobarInvitacion from './Dialogs/AprobarInvitacion.jsx';
import RechazarInvitacion from './Dialogs/RechazarInvitacion.jsx';

const InvitacionesListKeys = ({ keyId, handleKeyId, keys, nombreKey = 'Cargando...', navigation }) => {
    const [message, setMessage] = useState('');
    const [orden, setOrden] = useState('asc');
    const [columna, setColumna] = useState('id');
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [numberOfItemsPerPage, onItemsPerPageChange] = useState(10);
    const [expanded, setExpanded] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [visibleCodigo, setVisibleCodigo] = useState(false);
    const [visibleAprobar, setVisibleAprobar] = useState(false);
    const [visibleCancelar, setVisibleCancelar] = useState(false);

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
    const prevQuery = useRef(query);

    const fetchData = useCallback(
        async (filters) => {
            if (keyId) {
                await fetchInvitacioneskey(filters);
            }
        },
        [fetchInvitacioneskey, keyId]
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        const filters = query ? `estado=${query}` : `estado=Pendiente`;
        await fetchData(filters);
        setRefreshing(false);
    }, [fetchData, query]);

    const [codigo, setCodigo] = useState(keys.find((key) => Number(key.id_key) === Number(keyId))?.codigo_invitacion || '')

    const handlePress = () => {
        setVisibleCodigo(false);
    };

    useEffect(() => {
        const selectedKey = keys.find((key) => Number(key.id_key) === Number(keyId));
        setCodigo(selectedKey?.codigo_invitacion || '');

        if (keyId !== prevKeyId.current) {
            prevKeyId.current = keyId;
            onRefresh();
        }
    }, [keyId, onRefresh, keys]);


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
                            onPress={() => navigation.goBack()}
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
                {keys && <PickerModal keys={keys} modalVisible={modalVisible} setModalVisible={setModalVisible} handleKeyId={handleKeyId} navigation={navigation} nombreKey={nombreKey} />}

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
                onEdit={handleAprobar}
                boton1={(query === 'Pendiente' || query === '') ? 'Aprobar' : null}
                onDelete={handleCancelar}
                boton2={(query === 'Pendiente' || query === '') ? 'Cancelar' : null}
                loading={loading}
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
                numberOfItemsPerPage={numberOfItemsPerPage}
                handleSubmit={handleSubmit}
                onItemsPerPageChange={handleItemsPerPageChange}
                style={styleMovimiento}
                IconHandleSumbit={'clipboard-outline'}
                textIconSumbit={'Copiar codigo'}
            />
            <CodigoInvitacion visible={visibleCodigo} handlePress={handlePress} codigo={codigo} keyName={nombreKey} />
            <AprobarInvitacion visible={visibleAprobar} setVisible={setVisibleAprobar} invitacionId={invitacionId} />
            <RechazarInvitacion visible={visibleCancelar} setVisible={setVisibleCancelar} invitacionId={invitacionId} />
        </>
    );
};

export default InvitacionesListKeys;