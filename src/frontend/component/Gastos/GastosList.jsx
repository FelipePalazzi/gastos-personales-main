import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text,ScrollView, RefreshControl,  Modal,TextInput,StyleSheet, Pressable} from 'react-native';
import { DataTable, ActivityIndicator,Card} from 'react-native-paper';
import { useFocusEffect , useNavigation, useRoute} from '@react-navigation/native';
import theme from '../../theme/theme.js';
import moment from 'moment'
import { Feather } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'
import { alerts, button_text, atributos, symbols, pagina } from '../../../constants.js';
import { filterData, sortData,  getSortIcon } from '../../utils.js';
import {styleComun, styleLista, styleLoading} from '../../styles/styles.js';
import useGastos from '../../hooks/useGastos.js';
import { BlurView } from '@react-native-community/blur';

const numberOfItemsPerPageList = [5,6,7,8,9,10,20];

const GastoList = ({ keyId}) => {
  const navigation = useNavigation();
  const route = useRoute();
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
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (route.params?.refresh) {
      onRefresh(); 
      navigation.setParams({ refresh: false });
    }
  }, [route.params]);

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
    navigation.navigate(`GastoForm`,{gastoParam:gasto, deleteMode:false, keyid:keyId, labelHeader: "Nuevo Gasto"}) 
    await createGasto(gasto) 
  } 
  const onEdit = async (gasto) => {
    navigation.navigate(`GastoForm`,{gastoParam:gasto, deleteMode:false, keyid:keyId, labelHeader: "Nuevo Gasto"}) 
    await updateGasto(gasto) 
  } 

  const onDelete = async (gasto) => {
    navigation.navigate(`GastoForm`,{gastoParam:gasto, deleteMode:true, keyid:keyId, labelHeader: "Nuevo Gasto"}) 
    await deleteGasto(gasto.id) 
  } 


  return (
<>
    <View  style={{backgroundColor:theme.colors.white}}>
<View style={styles.container}>
  <View style={{margin:10}}>
    <Icon.Button
          backgroundColor={theme.colors.primary}
          name={'search'}
          onPress={() => setModalVisible(true)}
          style={{paddingHorizontal:150}}
        >Busqueda Avanzada
        </Icon.Button>
        </View>
        </View>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <BlurView
            style={styles.blurView}
            blurType="light" // Puede ser "dark", "light", "xlight"
            blurAmount={20}
          >
            <View style={styles.modalContent}>
              <Text style={styles.title}>Búsqueda Avanzada</Text>
              <TextInput
                style={styles.input}
                placeholder="Palabra clave"
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={styles.input}
                placeholder="Categoría"
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={styles.input}
                placeholder="Rango de fechas"
                placeholderTextColor="#aaa"
              />
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
            </View>
          </BlurView>
        </View>
      </Modal>


      <View style={{marginHorizontal:10}}>
      <DataTable.Header style={styleLista.headerRow}>
          <DataTable.Title
            onPress={() => handleSort('fecha')}
            textStyle={styleLista.textTitleTable}
          >
            <Text style={styleComun.text}>{atributos.fecha}</Text>
            <Feather name={getIcon('fecha')} size={theme.icons.ordenar} color={columna === 'fecha'? theme.colors.white : theme.colors.gray} />
          </DataTable.Title>
          <DataTable.Title
            onPress={() => handleSort('subcategoria')}
            style={{marginHorizontal:5,marginLeft:20}}
            textStyle={styleLista.textTitleTable}
          >
            <Text style={styleComun.text}>{atributos.tipo}</Text>
            <Feather name={getIcon('subcategoria')} size={theme.icons.ordenar} color={columna === 'subcategoria'? theme.colors.white : theme.colors.gray} />
          </DataTable.Title>
          <DataTable.Title
            onPress={() => handleSort('totalar')}
            style={{marginHorizontal:5,marginLeft:5}}
            textStyle={styleLista.textTitleTable}
          >
            <Text style={styleComun.text}>{`${symbols.peso}${atributos.ar}`}</Text>
            <Feather name={getIcon('totalar')} size={theme.icons.ordenar} color={columna === 'totalar'? theme.colors.white : theme.colors.gray} />
          </DataTable.Title>
          <DataTable.Title
            onPress={() => handleSort('total')}
            style={{marginLeft:5}}
            textStyle={styleLista.textTitleTable}
          >
            <Text style={styleComun.text}>{`${symbols.peso}${atributos.uy}`}</Text>
            <Feather name={getIcon('total')} size={theme.icons.ordenar} color={columna === 'total'? theme.colors.white : theme.colors.gray} />
          </DataTable.Title>
          <DataTable.Title
            onPress={() => handleSort('total')}
            style={{marginLeft:5}}
            textStyle={styleLista.textTitleTable}
          >
            <Text style={styleComun.text}>{`${symbols.peso}${atributos.usd}`}</Text>
            <Feather name={getIcon('total')} size={theme.icons.ordenar} color={columna === 'total'? theme.colors.white : theme.colors.gray} />
          </DataTable.Title>
        </DataTable.Header>
        </View>
    </View>
        <ScrollView  showsVerticalScrollIndicator={true}
        vertical
        style={styleComun.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
    <View style={styleLista.container}>
      {
        sortedData.length>0 && 
      <DataTable>
        {loading? (
        <View style={styleLoading.loadingContainer}>
          <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
          <Text style={styleLoading.loadingText}>{alerts.cargando} {atributos.gasto}s</Text>
        </View>
        ) : (
  sortedData.slice(page * pageSize, (page + 1) * pageSize).map((gasto, index) => (
    <React.Fragment key={index}>
      <DataTable.Row style={[styleLista.row, expanded[gasto.id] && { backgroundColor: theme.colors.tableSecondary }]} onPress={() => handlePressGasto(gasto.id, index)}>
        <DataTable.Cell textStyle={styleLista.textRowTable} style={{marginHorizontal:10,marginStart:30}}>{moment.utc(gasto.fecha).format('DD/MM/YY')}</DataTable.Cell>
        <DataTable.Cell textStyle={styleLista.textRowTable}>{gasto.subcategoria}</DataTable.Cell>
        <DataTable.Cell textStyle={styleLista.textRowTable}>{`${gasto.ARG.toFixed(2)}`}</DataTable.Cell>
        <DataTable.Cell textStyle={styleLista.textRowTable}>{`${gasto.UYU.toFixed(2)}`}</DataTable.Cell>
        <DataTable.Cell textStyle={styleLista.textRowTable}>{`${gasto.USD.toFixed(2)}`}</DataTable.Cell>
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
              <Text style={styleLista.description}>{`Cambio ARG`}</Text>
              <Text>{`${symbols.peso}${gasto.cambio_arg}`}</Text>
            </View>
            <View style={styleLista.descriptionRow}>
              <Text style={styleLista.description}>{`Cambio UYU`}</Text>
              <Text>{`${symbols.peso}${gasto.cambio_uyu}`}</Text>
            </View>
            <View style={styleLista.descriptionRow}>
              <Text style={styleLista.description}>{`Cambio USD`}</Text>
              <Text>{`${symbols.peso}${gasto.cambio_usd}`}</Text>
            </View>
            <View style={styleLista.descriptionRow}>
              <Text style={styleLista.description}>{`${atributos.descripcion}${symbols.colon}`}</Text>
              <Text>{gasto.descripcion}</Text>
            </View>
            <View>
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
  ||  <View style={styleLoading.loadingContainer}>
  <Text style={styleLoading.loadingText}>Sin coincidencias</Text>
</View>
  }
   </View>
   </ScrollView>
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
        style={{backgroundColor:theme.colors.tableSecondary, marginHorizontal:10}}
      />
      <View style={[styleComun.button,{alignItems:'flex-start', marginStart:10}]}>
        <Icon.Button
          backgroundColor={theme.colors.agregar}
          name={theme.icons.agregar}
          onPress={() => handleSubmit(gasto)}
        >{`${button_text.agregar}${symbols.space}${atributos.gasto}`}
        </Icon.Button>
      </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fondo oscuro semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    position: 'absolute',
    width: '80%',
    borderRadius: 15,
    height: '80%',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Fondo blanco semi-transparente
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20, // Márgenes laterales
    marginVertical: 40, // Márgenes superior/inferior
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  closeButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default GastoList;