import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, Text,ScrollView, RefreshControl } from 'react-native';
import { DataTable,Searchbar, ActivityIndicator,Card } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import theme from '../../styles/theme.js';
import moment from 'moment'
import { Feather } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'
import { alerts, button_text, atributos, symbols, pagina } from '../../constants.js';
import { filterData, sortData,  getSortIcon } from '../../utils.js';
import {styleLista} from '../../styles/styles.js';
import useGastos from '../../hooks/useGastos.js';

const numberOfItemsPerPageList = [5,6,7,8,9,10];

const GastoList = ({ navigation , keyId}) => {
  const [orden, setOrden] = useState('asc');
  const [columna, setColumna] = useState('id');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(7);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(7);
  const { gastos, loading, fetchGastos } = useGastos(keyId);
  const [expanded, setExpanded] = useState({});
  const [gasto, setGastos] = useState({});

  const handlePressGasto = useCallback((gastoId, index) => {
    setExpanded((prevExpanded) => ({ ...prevExpanded, [gastoId]: !prevExpanded[gastoId] }));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGastos();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (keyId && keyId !== previousKeyId.current) {
        previousKeyId.current = keyId;
        fetchGastos();
      }
    }, [keyId, fetchGastos])
  );
  
  const previousKeyId = useRef(keyId); 
  
  
  const filteredData = filterData(gastos, search, ['totalar', 'total'], 'fecha','fecha');

  const sortedData = useMemo(() => {
    return sortData(filteredData, orden, columna);
  }, [orden, columna, filteredData]);

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
    navigation.navigate(`GastoForm`,{gastoParam:gasto, deleteMode:false}) 
    await createGasto(gasto) 
  } 
  const onEdit = async (gasto) => {
    navigation.navigate(`GastoForm`,{gastoParam:gasto, deleteMode:false}) 
    await updateGasto(gasto) 
  } 

  const onDelete = async (gasto) => {
    navigation.navigate(`GastoForm`,{gastoParam:gasto, deleteMode:true}) 
    await deleteGasto(gasto.id) 
  } 


  return (
    <ScrollView  showsVerticalScrollIndicator={true}
    vertical
    style={styleLista.scroll}
    onScroll={handleScroll}
    scrollEventThrottle={theme.scroll.desplazamiento}
    ref={scrollViewRef}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }>
    <View>
      <Searchbar
        placeholder={button_text.filtrar}
        style={styleLista.search}
        elevation={theme.search.elevation}
        onChangeText={setSearch}
        value={search}
        inputStyle={styleLista.textRowTable}
        placeholderTextColor={theme.colors.textPrimary}
        iconColor={theme.colors.textPrimary}
      />
    </View>
    <View style={styleLista.container}>
      <DataTable>
        <DataTable.Header style={styleLista.headerRow}>
          <DataTable.Title
            onPress={() => handleSort('fecha')}
            textStyle={styleLista.textTitleTable}
          >
            <Text style={styleLista.text}>{atributos.fecha}</Text>
            <Feather name={getIcon('fecha')} size={theme.icons.ordenar} color={columna === 'fecha'? theme.colors.white : theme.colors.gray} />
          </DataTable.Title>
          <DataTable.Title
            onPress={() => handleSort('tipogasto')}
            style={{marginHorizontal:5,marginLeft:20}}
            textStyle={styleLista.textTitleTable}
          >
            <Text style={styleLista.text}>{atributos.tipo}</Text>
            <Feather name={getIcon('tipogasto')} size={theme.icons.ordenar} color={columna === 'tipogasto'? theme.colors.white : theme.colors.gray} />
          </DataTable.Title>
          <DataTable.Title
            onPress={() => handleSort('totalar')}
            style={{marginHorizontal:5,marginLeft:5}}
            textStyle={styleLista.textTitleTable}
          >
            <Text style={styleLista.text}>{`${symbols.peso}${atributos.ar}`}</Text>
            <Feather name={getIcon('totalar')} size={theme.icons.ordenar} color={columna === 'totalar'? theme.colors.white : theme.colors.gray} />
          </DataTable.Title>
          <DataTable.Title
            onPress={() => handleSort('total')}
            style={{marginLeft:5}}
            textStyle={styleLista.textTitleTable}
          >
            <Text style={styleLista.text}>{`${symbols.peso}${atributos.uy}`}</Text>
            <Feather name={getIcon('total')} size={theme.icons.ordenar} color={columna === 'total'? theme.colors.white : theme.colors.gray} />
          </DataTable.Title>
        </DataTable.Header>
        {loading? (
        <View style={styleLista.loadingContainer}>
          <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
          <Text style={styleLista.loadingText}>{alerts.cargando}</Text>
        </View>
        ) : (
  sortedData.slice(page * pageSize, (page + 1) * pageSize).map((gasto, index) => (
    <React.Fragment key={index}>
      <DataTable.Row style={[styleLista.row, expanded[gasto.id] && { backgroundColor: theme.colors.tableSecondary }]} onPress={() => handlePressGasto(gasto.id, index)}>
        <DataTable.Cell textStyle={styleLista.textRowTable} style={{marginHorizontal:10,marginStart:30}}>{moment.utc(gasto.fecha).format('DD/MM/YY')}</DataTable.Cell>
        <DataTable.Cell textStyle={styleLista.textRowTable}>{gasto.tipogasto}</DataTable.Cell>
        <DataTable.Cell textStyle={styleLista.textRowTable}>{`${gasto.totalar}`}</DataTable.Cell>
        <DataTable.Cell textStyle={styleLista.textRowTable}>{`${gasto.total}`}</DataTable.Cell>
      </DataTable.Row>
      {expanded[gasto.id] && (
        <Card style={styleLista.card}>
          <Card.Content>
            <View style={styleLista.descriptionRow}>
              <Text style={styleLista.description}>{`${atributos.responsable}${symbols.colon}`}</Text>
              <Text>{gasto.responsable}</Text>
            </View>
            <View style={styleLista.descriptionRow}>
              <Text style={styleLista.description}>{`${atributos.categoria}${symbols.colon}`}</Text>
              <Text>{gasto.categoria}</Text>
            </View>
            <View style={styleLista.descriptionRow}>
              <Text style={styleLista.description}>{`${atributos.cambio}${symbols.colon}`}</Text>
              <Text>{`${symbols.peso}${gasto.tipocambio}`}</Text>
            </View>
            <View style={styleLista.descriptionRow}>
              <Text style={styleLista.description}>{`${atributos.descripcion}${symbols.colon}`}</Text>
              <Text>{gasto.descripcion}</Text>
            </View>
            <View style={styleLista.buttonContainer}>
            <Card.Actions>
            <View>
              <Icon.Button
                backgroundColor={theme.colors.edit}
                name={theme.icons.editar}
                onPress={() => onEdit(gasto)}
              >{button_text.edit}
              </Icon.Button>
              </View>
              <View>
              <Icon.Button
                backgroundColor={theme.colors.delete}
                name={theme.icons.borrar}
                onPress={() => onDelete(gasto)}
              >{button_text.delete}
              </Icon.Button>
              </View>
            </Card.Actions>
            </View>
          </Card.Content>
        </Card>
      )}
    </React.Fragment>
  ))
)}
   </DataTable>
   </View>
   <View>
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(sortedData.length / pageSize)}
        onPageChange={handlePageChange}
        label={`${pagina.nombre} ${page + 1} ${symbols.de} ${Math.ceil(sortedData.length / pageSize)}`}
        onItemsPerPageChange={handleItemsPerPageChange}
        selectPageDropdownLabel={alerts.cantidad}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={numberOfItemsPerPage}
      />
      <View style={styleLista.button}>
        <Icon.Button
          backgroundColor={theme.colors.agregar}
          name={theme.icons.agregar}
          onPress={() => handleSubmit(gasto)}
        >{`${button_text.agregar}${symbols.space}${atributos.gasto}`}
        </Icon.Button>
      </View>
    </View>
    </ScrollView>
  );
};


export default GastoList;