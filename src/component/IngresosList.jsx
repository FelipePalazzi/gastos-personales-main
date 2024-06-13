import React, { useState,useCallback, useMemo, useEffect,useRef} from 'react'
import { View, Text, TouchableOpacity, StyleSheet,  ScrollView,Dimensions, RefreshControl} from 'react-native'
import theme from '../theme.js'
import { Table,TableWrapper,Cell } from 'react-native-table-component'
import moment from 'moment'
import { Feather } from '@expo/vector-icons'
import {useNavigate} from 'react-router-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Searchbar, ActivityIndicator } from 'react-native-paper'
import  {filterData, handlePress, sortData, getSortIcon} from '../utils'
import { alerts,button_text, atributos, symbols,pagina } from '../constants'

const useFetchIngresos = () => {
  const [ingresos, setIngresos] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchIngresos = async () => {
    try {
      const response = await globalThis.fetch(`${pagina.pagina}${symbols.barra}${pagina.pagina_ingreso}`)
      const json = await response.json()
      setIngresos(json)
      setLoading(false)
    } catch (error) {
      console.error(`${alerts.error_ocurrido}${atributos.ingreso}`, error)
      setLoading(false)
    }
  }

  return { ingresos, loading, fetchIngresos }
}

const screenWidth = Dimensions.get('window').width

const IngresoList = () => {

  const [orden, setOrden] = useState('asc')
  const [columna, setColumna] = useState('id')
  const navigate = useNavigate()
  const [ingreso, setIngresos] = useState({})
  const [search, setSearch] = useState('')
  const [totalar, setTotalar] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const { ingresos, loading, fetchIngresos } = useFetchIngresos()

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchIngresos()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchIngresos()
  }, [])

  const handleSort = useCallback((columna) => {
    setColumna(columna);
    const ordenInverso = (orden === 'asc'? 'desc' : orden === 'desc'? 'no orden' : 'asc');
    setOrden(ordenInverso);
  }, [orden]);

  const filteredData = filterData(ingresos, search, ['moneda'], 'fecha');
  
  const sortedData = useMemo(() => {
    return sortData(filteredData, orden, columna);
  }, [orden, columna, filteredData]);
  

  const [selectedIngresoId, setSelectedIngreso] = useState(null)
  const scrollViewRef = useRef(null)
  const [contentOffset, setContentOffset] = useState({ y: 0 })
  const handleScroll = (event) => {
    setContentOffset(event.nativeEvent.contentOffset)
  }

  const handlePressIngreso = useCallback((ingresoId, index) => {
    handlePress(ingresoId, index, setSelectedIngreso, scrollViewRef);
  }, [setSelectedIngreso, scrollViewRef]);

  const selectedIngreso = useMemo(() => {
    if (selectedIngresoId) {
      const selectedIngreso = ingresos.find((ingreso) => ingreso.id === selectedIngresoId)
      return {
       ...selectedIngreso
      }
    }
    return null
  }, [selectedIngresoId, ingresos])

  const getIcon = (columna) => {
    return getSortIcon(columna, orden, columna);
  };

  const handleSubmit = async (ingreso) => {
    navigate(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}${pagina.pagina_new}`, { replace: true })
    await createIngreso(ingreso)
  }

  const onEdit = async (updatedIngreso) => {
    navigate(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}${updatedIngreso.id}`, { replace: true })
    await updateIngreso(updatedIngreso)
  }

const onDelete = async (id) => {
  navigate(`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}${id}`, { state: { deleteMode: true } })
  await deleteIngreso(id)
}

return (
  <View style={styles.container}>
  <View>  
    <Searchbar
      placeholder="Filtrar"
      style={styles.search}
      elevation={theme.search.elevation}
      onChangeText={setSearch}
      value={search}
    />
    <View><Text></Text></View>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => handleSort('fecha')}>
          <View style={styles.headerCell}>
            <Text style={styles.text}>{atributos.fecha}</Text>
            <Feather name={getIcon('fecha')} size={theme.icons.ordenar} color={columna === 'fecha' ? theme.colors.white : theme.colors.gray} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSort('responsable')}>
          <View style={styles.headerCell}>
            <Text style={styles.text}>{atributos.responsable}</Text>
            <Feather name={getIcon('responsable')} size={theme.icons.ordenar} color={columna === 'responsable' ? theme.colors.white : theme.colors.gray} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSort('importe')}>
          <View style={styles.headerCell}>
            <Text style={styles.text}>{atributos.importe}</Text>
            <Feather name={getIcon('importe')} size={theme.icons.ordenar} color={columna === 'importe' ? theme.colors.white : theme.colors.gray} />
          </View>
        </TouchableOpacity>
      </View>
      
  </View>

  <ScrollView
    showsVerticalScrollIndicator={true}
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
    }
  >

    <Table >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
          <Text style={styles.loadingText}>{alerts.cargando}</Text>
        </View>
      ) : (
        <View>
          {sortedData.map((ingreso, index) => (
            <View key={index}>
              <TableWrapper style={styles.row}>
                <TouchableOpacity onPress={() => {
                  if (selectedIngreso && selectedIngreso.id === ingreso.id) {
                    setSelectedIngreso(null)
                  } else {
                    handlePressIngreso(ingreso.id, index)
                  }
                }}>
                  <Cell data={moment.utc(ingreso.fecha).format('DD/MM/YY')} style={styles.cell} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  if (selectedIngreso && selectedIngreso.id === ingreso.id) {
                    setSelectedIngreso(null)
                  } else {
                    handlePressIngreso(ingreso.id, index)
                  }
                }}>
                  <Cell data={ingreso.responsable} style={styles.cell}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  if (selectedIngreso && selectedIngreso.id === ingreso.id) {
                    setSelectedIngreso(null)
                  } else {
                    handlePressIngreso(ingreso.id, index)
                  }
                }}>
                  <Cell data={[ingreso.moneda,' ',ingreso.importe]} style={styles.cell} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  if (selectedIngreso && selectedIngreso.id === ingreso.id) {
                    setSelectedIngreso(null)
                  } else {
                    handlePressIngreso(ingreso.id, index)

                  }
                }}>
                </TouchableOpacity>
              </TableWrapper>
              <ScrollView ref={(scrollView) => this.scrollView = scrollView}>
              {selectedIngreso && selectedIngreso.id === ingreso.id && (
                <View style={styles.headerdescription}>
                  <View style={styles.descriptionRow}>
                    <Text style={styles.description}>{selectedIngreso && selectedIngreso.moneda === `${atributos.uy}`
                            ? `${atributos.ar}${symbols.guion}${ingreso.moneda}${symbols.colon}`
                            : selectedIngreso && selectedIngreso.moneda === `${atributos.usd}`
                            ? `${ingreso.moneda}${symbols.guion}${atributos.ar}${symbols.colon}`
                            : selectedIngreso && selectedIngreso.moneda === `${atributos.ar}`
                            ? `${ingreso.moneda}${symbols.guion}${atributos.uy}${symbols.colon}`
                            : null}</Text>
                    <Text>{ selectedIngreso.tipocambio}</Text>
                  </View>
                  <View style={styles.descriptionRow}>
                    <Text style={styles.description}>{selectedIngreso && selectedIngreso.moneda === 3 
                    ? `${atributos.total_uyu}${symbols.colon}`
                    :`${atributos.total_arg}${symbols.colon}`}</Text>
                    <Text>
                        {selectedIngreso && selectedIngreso.moneda === `${atributos.uy}`
                            ? `$ ${(selectedIngreso.importe / selectedIngreso.tipocambio).toFixed(2)}`
                            : selectedIngreso && selectedIngreso.moneda === `${atributos.usd}`
                            ? `$ ${(selectedIngreso.importe * selectedIngreso.tipocambio).toFixed(2)}`
                            : selectedIngreso && selectedIngreso.moneda === `${atributos.ar}`
                            ? `$ ${(selectedIngreso.tipocambio * selectedIngreso.importe).toFixed(2)}`
                            : null}
                        </Text>
                  </View>
                  <View style={styles.descriptionRow}>
                    <Text style={styles.description}>{`${atributos.descripcion}${symbols.colon}`}</Text>
                    <Text>{selectedIngreso.descripcion}</Text>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Icon.Button
                      backgroundColor={theme.colors.edit}
                      name={theme.icons.editar}
                      title=""
                      onPress={() => onEdit(selectedIngreso)}
                    >{button_text.edit}</Icon.Button>
                    <Icon.Button
                      backgroundColor={theme.colors.delete}
                      name={theme.icons.borrar}
                      title=""
                      onPress={() => onDelete(selectedIngreso.id)}
                    >{button_text.delete}</Icon.Button>
                  </View>
                </View>
              )}
              </ScrollView>
            </View>
          ))}
        </View>
      )}
    </Table>

  </ScrollView>
  <View style={styles.button}>
    <Icon.Button backgroundColor={theme.colors.agregar} name={theme.icons.agregar} title="" onPress={() => { handleSubmit(ingreso) }}>{`${button_text.agregar}${symbols.space}${atributos.ingreso}`}</Icon.Button>
  </View>

  </View>
)}
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
    padding: 10
},
  row: {
    flexDirection: 'row',
    backgroundColor: theme.colors.table
},
  description: {
    backgroundColor: theme.colors.tableSecondary,
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
    width: screenWidth/3-10,
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.cell,
    fontWeight: theme.fontWeights.bold
},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    borderEndWidth: 1,
    borderColor: theme.colors.cell,
    width: screenWidth/3-10.4,
    paddingHorizontal: 5,
}
})

export default IngresoList