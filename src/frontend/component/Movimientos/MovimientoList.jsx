import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { atributos, button_text, symbols } from '../../../constants.js';
import useGastos from '../../hooks/useGastos.js';
import useIngresos from '../../hooks/useIngresos.js';
import BusquedaAvanzada from '../Comunes/Busqueda/BusquedaAvanzada.jsx';
import Header from '../Comunes/DataTable/Header.jsx';
import Rows from '../Comunes/DataTable/Rows.jsx';
import Pagination from '../Comunes/DataTable/Pagination.jsx';
import { styleMovimiento } from '../../styles/styles.js';
import useCombinedData from '../../hooks/useCombinedData.js';
import { getColumns, getCardRows, getAtributosSearch } from './listConfig.js';
import useTableData from '../Comunes/DataTable/useTableData.jsx';

const MovimientoList = ({ keyId, routeParams }) => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [expanded, setExpanded] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const route = useRoute();
    const tipo = routeParams?.tipo || route.params?.tipo;
    const esEntrada = tipo === 'entradas';
    const MovimientoForm = esEntrada ? 'IngresoForm' : 'GastoForm';
    const MovimientoLabelForm = esEntrada ? 'Nueva Entrada' : 'Nueva Salida'

    const { gastos, loading, fetchGastos } = useGastos(keyId);
    const { ingresos, loadingIngreso, fetchIngresos } = useIngresos(keyId);

    const data = useMemo(() => {
        return esEntrada ? ingresos : gastos;
    }, [esEntrada, ingresos, gastos]);

    const fetchData = esEntrada ? fetchIngresos : fetchGastos;

    useEffect(() => {
        if (route.params?.refresh) {
            onRefresh();
            navigation.setParams({ refresh: false });
        }
    }, [route.params]);

    const handleApplyFilters = (filters) => {
        const query = new URLSearchParams({
            ...filters,
        }).toString();
        setAppliedFilters(filters);
        setIsLoading(true);
        fetchData(query).finally(() => setIsLoading(false));
    };

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
    } = useTableData(data, 10, 'fecha', 'desc');

    const handlePressGasto = useCallback((gastoId, index) => {
        setExpanded((prevExpanded) => ({ ...prevExpanded, [gastoId]: !prevExpanded[gastoId] }));
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData(`limit=${pageSize * 3}&estado=Activo`);
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            if (keyId && keyId !== previousKeyId.current) {
                previousKeyId.current = keyId;
                setIsLoading(true);
                fetchData('limit=100&estado=Activo').finally(() => setIsLoading(false));
            }
        }, [keyId, fetchData])
    );
    const previousKeyId = useRef(keyId);

    useEffect(() => {
        onRefresh();
    }, [pageSize]);


    const handleSubmit = async () => {
        navigation.navigate(MovimientoForm, { deleteMode: false, keyId: keyId, labelHeader: MovimientoLabelForm })
        await createGasto(data)
    }
    const onEdit = async (item) => {
        navigation.navigate(MovimientoForm, { itemParam: item, deleteMode: false, keyId: keyId, labelHeader: MovimientoLabelForm })
        await updateGasto(item)
    }

    const onDelete = async (item) => {
        navigation.navigate(MovimientoForm, { itemParam: item, deleteMode: true, keyId: keyId, labelHeader: MovimientoLabelForm })
        await deleteGasto(item.id)
    }

    const columns = useMemo(() => getColumns(esEntrada, atributos), [esEntrada, atributos]);

    const cardrows = useMemo(() => getCardRows(esEntrada, atributos, symbols), [esEntrada, atributos, symbols]);

    const [appliedFilters, setAppliedFilters] = useState({estado:'Activo'});

    const { categoria, subcategoria, responsable, moneda, metodopago, submetodopago } = useCombinedData(keyId);



    const categorias = React.useMemo(() =>
        categoria.map(item => ({
            nombre: item.categoria,
            activo: item.categoria_activo,
        })),
        [categoria]
    );

    const subcategorias = React.useMemo(() =>
        subcategoria.map(item => ({
            nombre: item.subcategoria,
            activo: item.subcategoria_activo,
        })),
        [subcategoria]
    );

    const responsables = React.useMemo(() =>
        responsable.map(item => ({
            nombre: item.responsable,
            activo: item.responsable_activo,
        })),
        [responsable]
    );

    const monedas = React.useMemo(() =>
        moneda.map(item => ({
            nombre: item.codigo_moneda,
            activo: item.moneda_activo,
        })),
        [moneda]
    );

    const metodopagos = React.useMemo(() =>
        metodopago.map(item => ({
            nombre: item.metodopago,
            activo: true,
        })),
        [metodopago]
    );

    const submetodopagos = React.useMemo(() =>
        submetodopago.map(item => ({
            nombre: item.submetodo_pago,
            activo: item.submetodo_pago_activo,
        })),
        [submetodopago]
    );

    const atributosSearch = React.useMemo(() =>
        getAtributosSearch(esEntrada, { categorias, subcategorias, responsables, monedas, metodopagos, submetodopagos }),
        [esEntrada, categorias, subcategorias, responsables, monedas, metodopagos, submetodopagos]
    );

    return (
        <>
            <View style={{ backgroundColor: styleMovimiento.colorBackground }}>

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
                onRowClick={handlePressGasto}
                columns={columns}
                Cardrows={cardrows}
                onRefresh={onRefresh}
                refreshing={refreshing}
                onEdit={onEdit}
                boton1={button_text.edit}
                onDelete={onDelete}
                boton2={button_text.archivar}
                loading={isLoading}
                page={page}
                pageSize={pageSize}
                style={styleMovimiento}
                tipoMovimiento={tipo}
            />

            <Pagination
                page={page}
                onPageChange={handlePageChange}
                numberOfPages={numberOfPages}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                pageSize={pageSize}
                handleSubmit={handleSubmit}
                onItemsPerPageChange={handleItemsPerPageChange}
                style={styleMovimiento}
            />

        </>
    );
};

export default MovimientoList;