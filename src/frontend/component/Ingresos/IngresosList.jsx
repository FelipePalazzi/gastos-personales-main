import React, { useState,useCallback, useMemo, useEffect,useRef} from 'react'
import { View, Text, ScrollView, RefreshControl, BackHandler} from 'react-native'
import { useFocusEffect , useNavigation, useRoute} from '@react-navigation/native';
import theme from '../../theme/theme.js'
import moment from 'moment'
import { Feather } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'
import { DataTable,Searchbar, ActivityIndicator,Card } from 'react-native-paper'
import  {filterData,  sortData, getSortIcon} from '../../utils.js'
import { alerts,button_text, atributos, symbols,pagina } from '../../../constants.js'
import {styleLista} from '../../styles/styles.js';
import useIngresos from '../../hooks/useIngresos.js'

const numberOfItemsPerPageList = [5,6,7,8,9,10];

const IngresoList = ({keyId}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [orden, setOrden] = useState('asc')
  const [columna, setColumna] = useState('id')
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const { ingresos, loading, fetchIngresos } = useIngresos(keyId)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(7);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(7);
  const [expanded, setExpanded] = useState({});
  const [ingreso, setIngreso] = useState({});

  useEffect(() => {
    if (route.params?.refresh) {
      onRefresh(); 
      navigation.setParams({ refresh: false });
    }
  }, [route.params]);
  
  const handlePressIngreso = useCallback((ingresoId, index) => {
    setExpanded((prevExpanded) => ({ ...prevExpanded, [ingresoId]: !prevExpanded[ingresoId] }));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchIngresos();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (keyId && keyId !== previousKeyId.current) {
        previousKeyId.current = keyId;
        fetchIngresos();
      }
    }, [keyId, fetchIngresos])
  );

  const previousKeyId = useRef(keyId); 

  const filteredData = filterData(ingresos, search, ['moneda'], 'fecha','fecha');

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

  const handleSubmit = async (ingreso) => {
    navigation.navigate(`IngresoForm`,{ingresoParam:ingreso, deleteMode:false, keyid:keyId, labelHeader: "Nuevo Ingreso"}) 
    await createIngreso(ingreso)
  }

  const onEdit = async (ingreso) => {
    navigation.navigate(`IngresoForm`,{ingresoParam:ingreso, deleteMode:false, keyid:keyId, labelHeader: "Nuevo Ingreso"}) 
    await updateIngreso(ingreso)
  }

const onDelete = async (ingreso) => {
  navigation.navigate(`IngresoForm`,{ingresoParam:ingreso, deleteMode:true, keyid:keyId, labelHeader: "Nuevo Ingreso"}) 
  await deleteIngreso(ingreso.id)
}

{/*useEffect(() => {
  const backAction = () => {
    navigate(`${symbols.barra}`, { replace: true }) 
    return true;
  };
  
  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    backAction,
  );

  return () => backHandler.remove();
}, []);
*/}

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
            <Text >{atributos.fecha}</Text>
            <Feather name={getIcon('fecha')} size={theme.icons.ordenar} color={columna === 'fecha'? theme.colors.white : theme.colors.gray} />
          </DataTable.Title>
          <DataTable.Title
            onPress={() => handleSort('responsable')}
            style={{marginHorizontal:30,marginLeft:30}}
            textStyle={styleLista.textTitleTable}
          >
            <Text>{atributos.responsable}</Text>
            <Feather name={getIcon('responsable')} size={theme.icons.ordenar} color={columna === 'responsable'? theme.colors.white : theme.colors.gray} />
          </DataTable.Title>
          <DataTable.Title
            onPress={() => handleSort('importe')}
            style={{marginLeft:20}}
            textStyle={styleLista.textTitleTable}
          >
            <Text>{atributos.importe}</Text>
            <Feather name={getIcon('importe')} size={theme.icons.ordenar} color={columna === 'importe'? theme.colors.white : theme.colors.gray} />
          </DataTable.Title>
        </DataTable.Header>
        {loading? (
          <View style={styleLista.loadingContainer}>
            <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
            <Text style={styleLista.loadingText}>{alerts.cargando}</Text>
          </View>
        ) : (
          sortedData.slice(page * pageSize, (page + 1) * pageSize).map((ingreso, index) => (
            <React.Fragment key={index}>
              <DataTable.Row style={[styleLista.row, expanded[ingreso.id] && { backgroundColor: theme.colors.tableSecondary }]} onPress={() => handlePressIngreso(ingreso.id, index)}> 
                <DataTable.Cell textStyle={styleLista.textRowTable} style={{marginHorizontal:10,marginStart:30}}>{moment.utc(ingreso.fecha).format('DD/MM/YY')}</DataTable.Cell>
                <DataTable.Cell textStyle={styleLista.textRowTable}>{ingreso.responsable}</DataTable.Cell>
                <DataTable.Cell textStyle={styleLista.textRowTable}>{`${ingreso.moneda}${symbols.space}${ingreso.importe}`}</DataTable.Cell>   
              </DataTable.Row>
              {expanded[ingreso.id] && (
                <Card style={styleLista.card}>
                  <Card.Content>
                    <View style={styleLista.descriptionRow}>
                      <Text style={styleLista.description}>{ingreso.moneda === `${atributos.uy}`
                            ? `${atributos.ar}${symbols.guion}${ingreso.moneda}${symbols.colon}`
                            :  ingreso.moneda === `${atributos.usd}`
                            ? `${ingreso.moneda}${symbols.guion}${atributos.ar}${symbols.colon}`
                            :  ingreso.moneda === `${atributos.ar}`
                            ? `${ingreso.moneda}${symbols.guion}${atributos.ar}${symbols.colon}`
                            : null}
                      </Text>
                      <Text>{ingreso.tipocambio}</Text>
                    </View>
                    <View style={styleLista.descriptionRow}>
                      <Text style={styleLista.description}>{ingreso.moneda === 3 
                    ? `${atributos.total_uyu}${symbols.colon}`
                    :`${atributos.total_arg}${symbols.colon}`}
                      </Text>
                      <Text>{ingreso.moneda === `${atributos.uy}`
                            ? `$ ${(ingreso.importe / ingreso.tipocambio).toFixed(2)}`
                            : ingreso && ingreso.moneda === `${atributos.usd}`
                            ? `$ ${(ingreso.importe * ingreso.tipocambio).toFixed(2)}`
                            : ingreso && ingreso.moneda === `${atributos.ar}`
                            ? `$ ${(ingreso.importe).toFixed(2)}`
                            : null}
                      </Text>
                    </View>    
                    <View style={styleLista.descriptionRow}>
                      <Text style={styleLista.description}>{`${atributos.descripcion}${symbols.colon}`}</Text>
                      <Text>{ingreso.descripcion}</Text>
                    </View>
                    <Card.Actions>
                    <View>
                      <Icon.Button
                        backgroundColor={theme.colors.edit}
                        name={theme.icons.editar}
                        onPress={() => onEdit(ingreso)}
                      >{button_text.edit}
                      </Icon.Button>
                      </View>
                      <View>
                      <Icon.Button
                        backgroundColor={theme.colors.delete}
                        name={theme.icons.borrar}
                        onPress={() => onDelete(ingreso.id)}
                      >{button_text.delete}
                      </Icon.Button>
                      </View>
                      </Card.Actions>
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
          onPress={() => handleSubmit(ingreso)}
        >{`${button_text.agregar}${symbols.space}${atributos.ingreso}`}
        </Icon.Button>
      </View>
      </View>
    </ScrollView>
  );
};

export default IngresoList