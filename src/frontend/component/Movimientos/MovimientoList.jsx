import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { atributos, symbols } from '../../../constants.js';
import { getSortIcon } from '../../utils.js';
import useGastos from '../../hooks/useGastos.js';
import useIngresos from '../../hooks/useIngresos.js';
import BusquedaAvanzada from '../Comunes/Busqueda/BusquedaAvanzada.jsx';
import Header from '../Comunes/DataTable/Header.jsx';
import Rows from '../Comunes/DataTable/Rows.jsx';
import Pagination from '../Comunes/DataTable/Pagination.jsx';
import { styleMovimiento } from '../../styles/styles.js';
import useCombinedData from '../../hooks/useCombinedData.js';
import { getColumns, getCardRows, getAtributosSearch } from './listConfig.js';

const getPageData = (data, page, pageSize) => {
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
};

const MovimientoList = ({ keyId, routeParams }) => {
    const navigation = useNavigation();
    const [orden, setOrden] = useState('asc');
    const [columna, setColumna] = useState('id');
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [numberOfItemsPerPage, onItemsPerPageChange] = useState(10);
    const [expanded, setExpanded] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const route = useRoute();
    const tipo = routeParams?.tipo || route.params?.tipo;
    const esEntrada = tipo === 'entradas';
    const MovimientoForm = esEntrada ? 'IngresoForm' : 'GastoForm';
    const MovimientoLabelForm = esEntrada ? 'Nuevo Ingreso' : 'Nuevo Gasto'

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
            limit: 18,
        }).toString();
        setAppliedFilters(filters);
        setIsLoading(true);
        fetchData(query).finally(() => setIsLoading(false));
    };

    const handlePressGasto = useCallback((gastoId, index) => {
        setExpanded((prevExpanded) => ({ ...prevExpanded, [gastoId]: !prevExpanded[gastoId] }));
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData(`limit=${pageSize*3}`);
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            if (keyId && keyId !== previousKeyId.current) {
                previousKeyId.current = keyId;
                setIsLoading(true);
                fetchData('limit=30').finally(() => setIsLoading(false));
            }
        }, [keyId, fetchData])
    );
    const previousKeyId = useRef(keyId);

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
    
    const currentData = useMemo(() => {
        return getPageData(data, page, pageSize);
    }, [data, page, pageSize]);
    

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

    const numberOfPages = Math.ceil(data.length / pageSize)
    const numberOfItemsPerPageList = [10, 15, 20, 50, 100];

    const [appliedFilters, setAppliedFilters] = useState({});

    const { categoria, subcategoria, responsable, moneda, metodopago, submetodopago } = useCombinedData(keyId);

    const [categorias, setCategorias] = React.useState([]);
    const [subcategorias, setSubcategorias] = React.useState([]);
    const [responsables, setResponsables] = React.useState([]);
    const [monedas, setMonedas] = React.useState([]);
    const [metodopagos, setMetodopagos] = React.useState([]);
    const [submetodopagos, setSubmetodopagos] = React.useState([]);

    React.useEffect(() => {
        setCategorias(categoria.map(item => ({
            nombre: item.categoria,
            activo: item.categoria_activo,
        })));
        setSubcategorias(subcategoria.map(item => ({
            nombre: item.subcategoria,
            activo: item.subcategoria_activo,
        })));
        setResponsables(responsable.map(item => ({
            nombre: item.responsable,
            activo: item.responsable_activo,
        })));
        setMonedas(moneda.map(item => ({
            nombre: item.codigo_moneda,
            activo: item.moneda_activo,
        })));
        setMetodopagos(metodopago.map(item => ({
            nombre: item.metodopago,
            activo: true,
        })));
        setSubmetodopagos(submetodopago.map(item => ({
            nombre: item.submetodo_pago,
            activo: item.submetodo_pago_activo,
        })));
    }, [keyId, categoria, subcategoria, responsable, moneda, metodopago, submetodopago]);
    

    const atributosSearch = useMemo(() => getAtributosSearch(esEntrada, { categorias, subcategorias, responsables, monedas, metodopagos, submetodopagos }), [
        esEntrada,
        categorias,
        subcategorias,
        responsables,
        monedas,
        metodopagos,
        submetodopagos,
    ]);

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
                onDelete={onDelete}
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
                numberOfItemsPerPage={numberOfItemsPerPage}
                handleSubmit={handleSubmit}
                onItemsPerPageChange={handleItemsPerPageChange}
                style={styleMovimiento}
            />

        </>
    );
};

export default MovimientoList;