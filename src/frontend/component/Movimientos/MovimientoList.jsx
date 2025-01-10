import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment'
import { atributos, symbols } from '../../../constants.js';
import { filterData, sortData, getSortIcon } from '../../utils.js';
import useGastos from '../../hooks/useGastos.js';
import useIngresos from '../../hooks/useIngresos.js';
import BusquedaAvanzada from './BusquedaAvanzada.jsx';
import Header from './DataTable/Header.jsx';
import Rows from './DataTable/Rows.jsx';
import Pagination from './DataTable/Pagination.jsx';
import { styleGasto, styleIngreso } from '../../styles/styles.js';
import useCategoria from '../../hooks/useCategoria.js';
import useSubcategoria from '../../hooks/useSubcategoria.js';
import useResponsable from '../../hooks/useResponsable.js';

const MovimientoList = ({ keyId, routeParams }) => {
    const navigation = useNavigation();
    const [orden, setOrden] = useState('asc');
    const [columna, setColumna] = useState('id');
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(9);
    const [numberOfItemsPerPage, onItemsPerPageChange] = useState(9);
    const [expanded, setExpanded] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const route = useRoute();
    const tipo = routeParams?.tipo || route.params?.tipo;
    const esEntrada = tipo === 'entradas';
    const esSalida = tipo === 'salidas';

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
        await fetchData('limit=18');
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            if (keyId && keyId !== previousKeyId.current) {
                previousKeyId.current = keyId;
                setIsLoading(true);
                fetchData('limit=18').finally(() => setIsLoading(false));
            }
        }, [keyId, fetchData])
    );
    const previousKeyId = useRef(keyId);

    const filteredData = filterData(data, search, ['totalar', 'total'], 'fecha', 'fecha');

    const sortedData = useMemo(() => {
        return sortData(filteredData, orden, columna);
    }, [orden, columna, filteredData]);

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

    const handleSubmit = async (data) => {
        navigation.navigate(`GastoForm`, { gastoParam: data, deleteMode: false, keyid: keyId, labelHeader: "Nuevo Gasto" })
        await createGasto(data)
    }
    const onEdit = async (gasto) => {
        navigation.navigate(`GastoForm`, { gastoParam: gasto, deleteMode: false, keyid: keyId, labelHeader: "Nuevo Gasto" })
        await updateGasto(gasto)
    }

    const onDelete = async (gasto) => {
        navigation.navigate(`GastoForm`, { gastoParam: gasto, deleteMode: true, keyid: keyId, labelHeader: "Nuevo Gasto" })
        await deleteGasto(gasto.id)
    }
    const columns = useMemo(() => {
        if (esEntrada) {
            return [
                { key: 'fecha', label: atributos.fecha, sortable: true, render: (value) => moment.utc(value).format('DD/MM/YY'), },
                { key: 'importe', label: 'Importe', sortable: true, render: (value) => Number(value).toFixed(0), },
                { key: 'monedamonto', label: `Moneda`, sortable: true },
                { key: 'responsable', label: atributos.responsable, sortable: true },

            ];
        } else {
            return [
                { key: 'fecha', label: atributos.fecha, sortable: true, render: (value) => moment.utc(value).format('DD/MM/YY'), },
                { key: 'subcategoria', label: atributos.tipo, sortable: true },
                { key: 'importe', label: 'Importe', sortable: true, render: (value) => Number(value).toFixed(0), },
                { key: 'monedamonto', label: `Moneda`, sortable: true },
            ];
        }
    }, []);

    const cardrows = useMemo(() => {
        if (esEntrada) {
            return [
                { key: 'responsable', label: `${atributos.responsable}${symbols.colon}` },
                { key: `cambio_arg`, label: `Cambio ARG${symbols.colon}` },
                { key: `cambio_uyu`, label: `Cambio UYU${symbols.colon}` },
                { key: `cambio_usd`, label: `Cambio USD${symbols.colon}` },
                { key: 'ARG', label: `${symbols.peso}${atributos.ar}`, sortable: true, render: (value) => Number(value).toFixed(2), },
                { key: 'UYU', label: `${symbols.peso}${atributos.uy}`, sortable: true, render: (value) => Number(value).toFixed(2), },
                { key: 'USD', label: `${symbols.peso}${atributos.usd}`, sortable: true, render: (value) => Number(value).toFixed(2), },
                { key: 'comentario', label: `${atributos.descripcion}${symbols.colon}` },
                { key: 'metodopago', label: `Metodo de pago:` },
                { key: 'submetodopago', label: `Submetodo de pago:` },
            ];
        } else {
            return [
                { key: 'responsable', label: `${atributos.responsable}${symbols.colon}` },
                { key: 'categoria', label: `${atributos.categoria}${symbols.colon}` },
                { key: `cambio_arg`, label: `Cambio ARG${symbols.colon}`, render: (value) => Number(value).toFixed(4), },
                { key: `cambio_uyu`, label: `Cambio UYU${symbols.colon}`, render: (value) => Number(value).toFixed(4), },
                { key: `cambio_usd`, label: `Cambio USD${symbols.colon}`, render: (value) => Number(value).toFixed(4), },
                { key: 'ARG', label: `${atributos.ar} ${symbols.peso}`, sortable: true, render: (value) => Number(value).toFixed(2), },
                { key: 'UYU', label: `${atributos.uy} ${symbols.peso}`, sortable: true, render: (value) => Number(value).toFixed(2), },
                { key: 'USD', label: `${atributos.usd} ${symbols.peso}`, sortable: true, render: (value) => Number(value).toFixed(2), },
                { key: 'comentario', label: `${atributos.descripcion}${symbols.colon}` },
                { key: 'metodopago', label: `Metodo de pago:` },
                { key: 'submetodopago', label: `Submetodo de pago:` },
            ];
        }
    }, []);

    const numberOfPages = Math.ceil(sortedData.length / pageSize)
    const numberOfItemsPerPageList = [9, 10, 15, 20];

    const [appliedFilters, setAppliedFilters] = useState({});

    const { categoria } = useCategoria(keyId);
    const { subcategoria } = useSubcategoria(keyId);
    const { responsable } = useResponsable(keyId);

    const [categorias, setCategorias] = React.useState([]);
    const [subcategorias, setSubcategorias] = React.useState([]);
    const [responsables, setResponsables] = React.useState([]);

    React.useEffect(() => {
        setCategorias(categoria.map(item => item.categoria));
        setSubcategorias(subcategoria.map(item => item.subcategoria));
        setResponsables(responsable.map(item => item.responsable));
    }, [keyId, categoria, subcategoria, responsable]);

    const atributosSearch = useMemo(() => {
        if (esEntrada) {
            return [
                { key: 'responsable', label: `Responsable`, renderType: 'searchDropdown', data: responsables },
            ];
        } else {
            return [
                { key: 'estado', label: 'Estado', renderType: 'searchDropdown', data: ['activo', 'historico', 'pendiente'] },
                { key: 'categoria', label: 'Categoría', renderType: 'searchDropdown', data: categorias },
                { key: 'subcategoria', label: 'Subcategoría', renderType: 'searchDropdown', data: subcategorias },
                { key: 'responsable', label: 'Responsable', renderType: 'searchDropdown', data: responsables },
                { key: 'comentario', label: 'Comentario', renderType: 'textInput' },
                { key: 'fechaDesde', label: 'Fecha Desde', renderType: 'datePicker' },
                { key: 'fechaHasta', label: 'Fecha Hasta', renderType: 'datePicker' },
            ];
        }
    }, [categorias, subcategorias, responsables]);

    return (
        <>
            <View style={{ backgroundColor: esEntrada ? styleIngreso.colorBackground : styleGasto.colorBackground }}>

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
                    style={esEntrada ? styleIngreso : styleGasto}
                />

            </View>
            <Rows
                expanded={expanded}
                sortedData={sortedData}
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
                style={esEntrada ? styleIngreso : styleGasto}
            />

            <Pagination
                data={data}
                page={page}
                onPageChange={handlePageChange}
                numberOfPages={numberOfPages}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={numberOfItemsPerPage}
                handleSubmit={handleSubmit}
                onItemsPerPageChange={handleItemsPerPageChange}
                tipo={tipo}
                style={esEntrada ? styleIngreso : styleGasto}
            />

        </>
    );
};

export default MovimientoList;