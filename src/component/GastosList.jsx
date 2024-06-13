import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Dimensions, ScrollView, RefreshControl } from 'react-native';
import { DataTable,Searchbar, ActivityIndicator,Card } from 'react-native-paper';
import {useNavigate} from 'react-router-native'
import theme from '../theme.js';
import moment from 'moment'
import { Feather } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'
import { alerts, button_text, atributos, symbols, pagina } from '../constants';
import { filterData, sortData, handlePress, getSortIcon } from '../utils';

const useFetchGastos = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchGastos = async () => {
    try {
      const response = await globalThis.fetch(`${pagina.pagina}${symbols.barra}${pagina.pagina_gasto}`);
      const json = await response.json();
      setGastos(json);
      setLoading(false);
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${atributos.gasto}`, error);
      setLoading(false);
    }
  };
  return { gastos, loading, fetchGastos };
};

const screenWidth = Dimensions.get('window').width;
const numberOfItemsPerPageList = [5,6,7,8,9,10];

const GastoList = () => {
  const [orden, setOrden] = useState('asc');
  const [columna, setColumna] = useState('id');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(7);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(7);
  const { gastos, loading, fetchGastos } = useFetchGastos();
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate()
  const [gasto, setGastos] = useState({})
  
  const handlePressGasto = useCallback((gastoId, index) => {
    setExpanded((prevExpanded) => ({ ...prevExpanded, [gastoId]: !prevExpanded[gastoId] }));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGastos();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchGastos();
  }, []);

  
  const filteredData = filterData(gastos, search, ['totalar', 'total'], 'fecha');

  const sortedData = useMemo(() => {
    return sortData(filteredData, orden, columna);
  }, [orden, columna, filteredData]);

  const [selectedGastoId, setSelectedGasto] = useState(null) 
  const scrollViewRef = useRef(null) 
  const [contentOffset, setContentOffset] = useState({ y: 0 }) 
  const handleScroll = (event) => {
    setContentOffset(event.nativeEvent.contentOffset) 
  } 

  const handleSort = useCallback((columna) => {
    setColumna(columna);
    const ordenInverso = (orden === 'asc'? 'desc' : orden === 'desc'? 'no orden' : 'asc');
    setOrden(ordenInverso);
  }, [orden]);



  const selectedGasto = useMemo(() => {
    if (selectedGastoId) {
      const selectedGasto = gastos.find((gasto) => gasto.id === selectedGastoId);
      return {
       ...selectedGasto,
      };
    }
    return null;
  }, [selectedGastoId, gastos]);

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

  const handleSubmit = async (gasto) => {
    navigate(`${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${pagina.pagina_new}`, { replace: true }) 
    await createGasto(gasto) 
  } 
  const onEdit = async (updatedGasto) => {
    navigate(`${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${updatedGasto.id}`, { replace: true }) 
    await updateGasto(updatedGasto) 
  } 

const onDelete = async (id) => {
  navigate(`${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${id}`, { state: { deleteMode: true } }) 
  await deleteGasto(id) 
} 
  return (
    <ScrollView     showsVerticalScrollIndicator={true}
    vertical
    style={styles.scroll}
    onScroll={handleScroll}
    scrollEventThrottle={theme.scroll.desplazamiento}
    ref={scrollViewRef}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }>
    <View style={styles.container}>
      <Searchbar
        placeholder="Filtrar"
        style={styles.search}
        elevation={theme.search.elevation}
        onChangeText={setSearch}
        value={search}
      />
      <DataTable>
        <DataTable.Header style={styles.headerRow}>
          <DataTable.Title
            onPress={() => handleSort('fecha')}
            style={styles.headerCell}
          >
            <Text style={styles.text}>{atributos.fecha}</Text>
            <Feather name={getIcon('fecha')} size={theme.icons.ordenar} color={columna === 'fecha'? theme.colors.white : theme.colors.gray} />
          </DataTable.Title>
          <DataTable.Title
            onPress={() => handleSort('tipogasto')}
            style={styles.headerCell}
          >
            <Text style={styles.text}>{atributos.tipo}</Text>
            <Feather name={getIcon('tipogasto')} size={theme.icons.ordenar} color={columna === 'tipogasto'? theme.colors.white : theme.colors.gray} />
          </DataTable.Title>
          <DataTable.Title
            onPress={() => handleSort('totalar')}
            style={styles.headerCell}
          >
            <Text style={styles.text}>{`${symbols.peso}${atributos.ar}`}</Text>
            <Feather name={getIcon('totalar')} size={theme.icons.ordenar} color={columna === 'totalar'? theme.colors.white : theme.colors.gray} />
          </DataTable.Title>
          <DataTable.Title
            onPress={() => handleSort('total')}
            style={styles.headerCell}
          >
            <Text style={styles.text}>{`${symbols.peso}${atributos.uy}`}</Text>
            <Feather name={getIcon('total')} size={theme.icons.ordenar} color={columna === 'total'? theme.colors.white : theme.colors.gray} />
          </DataTable.Title>
        </DataTable.Header>


        {loading? (
  <View style={styles.loadingContainer}>
    <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
    <Text style={styles.loadingText}>{alerts.cargando}</Text>
  </View>
) : (
  sortedData.slice(page * pageSize, (page + 1) * pageSize).map((gasto, index) => (
    <React.Fragment key={index}>
      <DataTable.Row style={styles.row} onPress={() => handlePressGasto(gasto.id, index)}>
        <DataTable.Cell>{moment.utc(gasto.fecha).format('DD/MM/YY')}</DataTable.Cell>
        <DataTable.Cell>{gasto.tipogasto}</DataTable.Cell>
        <DataTable.Cell>{`${gasto.totalar}`}</DataTable.Cell>
        <DataTable.Cell>{`${gasto.total}`}</DataTable.Cell>
      </DataTable.Row>
      {expanded[gasto.id] && (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.descriptionRow}>
              <Text style={styles.description}>{`${atributos.responsable}${symbols.colon}`}</Text>
              <Text>{gasto.responsable}</Text>
            </View>
            <View style={styles.descriptionRow}>
              <Text style={styles.description}>{`${atributos.categoria}${symbols.colon}`}</Text>
              <Text>{gasto.categoria}</Text>
            </View>
            <View style={styles.descriptionRow}>
              <Text style={styles.description}>{`${atributos.cambio}${symbols.colon}`}</Text>
              <Text>{`${symbols.peso}${gasto.tipocambio}`}</Text>
            </View>
            <View style={styles.descriptionRow}>
              <Text style={styles.description}>{`${atributos.descripcion}${symbols.colon}`}</Text>
              <Text>{gasto.descripcion}</Text>
            </View>
            <View style={styles.buttonContainer}>
            <Card.Actions>
              <Icon.Button
                backgroundColor={theme.colors.edit}
                name={theme.icons.editar}
                title=""
                onPress={() => onEdit(gasto)}
              >{button_text.edit}</Icon.Button>
              <Icon.Button
                backgroundColor={theme.colors.delete}
                name={theme.icons.borrar}
                title=""
                onPress={() => onDelete(gasto.id)}
              >{button_text.delete}</Icon.Button>
              </Card.Actions>
            </View>
          </Card.Content>
        </Card>
      )}
    </React.Fragment>
  ))
)}
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(sortedData.length / pageSize)}
          onPageChange={handlePageChange}
          label={`Página ${page + 1} de ${Math.ceil(sortedData.length / pageSize)}`}
          onItemsPerPageChange={handleItemsPerPageChange}
          selectPageDropdownLabel={'Cant.'}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={numberOfItemsPerPage}

        />
   </DataTable>
      <View style={styles.button}>
        <Icon.Button
          backgroundColor={theme.colors.agregar}
          name={theme.icons.agregar}
          title=""
          onPress={() => handleSubmit(gasto)}
        >{`${button_text.agregar}${symbols.space}${atributos.gasto}`}</Icon.Button>
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
},
  loadingText: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
},
  container: {
    flex: 1,
    padding: 16, 
    paddingTop: 20
},
  text: {
    textAlign: 'center',
    padding: 10,
},
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    backgroundColor: theme.colors.table
},
card: {
  elevation:2,
  backgroundColor: theme.colors.card
},
  description: {
    fontWeight: theme.fontWeights.bold,
},
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
},
  headerdescription: {
    backgroundColor: theme.colors.tableSecondary,
    textAlign: 'center'
},
  cell: {
    width: screenWidth/4,
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.cell,
    fontWeight: theme.fontWeights.bold,
},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:20,
    backgroundColor: theme.colors.primary,
    
},
  scroll: { 
    flex:1
},
  button: {
    padding: 16,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
},
  search:{
    paddingBottom:1,
    backgroundColor: theme.colors.search,
},
  headerCell:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth:screenWidth/4,
    paddingHorizontal: 20,
}
});

export default GastoList;