import React, { useState, useEffect } from 'react'
import { View, Text,  StyleSheet, ScrollView,} from 'react-native'
import useGastos from '../hooks/useGastos'
import useTipoGasto from '../hooks/useTipoGasto'
import useCategoriaGasto from '../hooks/useCategoriaGasto'
import useResponsableIngreso from '../hooks/useResponsableIngreso'
import { useParams, useLocation  } from "react-router-dom"
import {useNavigate} from 'react-router-native'
import {Picker} from '@react-native-picker/picker'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import Icon from 'react-native-vector-icons/FontAwesome'
import theme from '../styles/theme'
import { ActivityIndicator ,Dialog, Portal, TextInput,} from 'react-native-paper'
import { Dimensions } from 'react-native'
import moment from 'moment'
import 'moment/locale/es'
import { alerts,button_text, atributos, symbols,pagina } from '../constants'

const screenWidth = Dimensions.get('window').width;

const AgregarGasto = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const deleteMode = location.state?.deleteMode
  const [tipogasto, setTipogasto] = useState('')
  const [tipocambio, settipocambio] = useState(0)
  const [totalar, setTotalar] = useState(0)
  const [total, setTotal] = useState(0)
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState('')
  const [responsable, setResponsable] = useState('')
  const { loading } = useGastos()
  const { tipogastos } = useTipoGasto()
  const {responsableIngresos} = useResponsableIngreso()
  const {categoriaGastos} = useCategoriaGasto()  
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(moment())
  const params = useParams()
  const id = params.id
  const [visible, setVisible] = useState(false);
  const [visibleOK, setvisibleOK] = useState(false);
  const [visibleDelete, setvisibleDelete] = useState(false);
  const [visibleOKDelete, setvisibleOKDelete] = useState(false);
  const [message, setMessage] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
        const gasto = await obtenerGasto(id)
        settipocambio(gasto[0].tipocambio.toFixed(4))
        setTotalar(gasto[0].totalar.toFixed(0))
        setTotal(gasto[0].total.toFixed(2))
        setDescripcion(gasto[0].descripcion)
        const tipogasto = tipogastos.find((tg) => tg.descripcion === gasto[0].tipogasto)
        if (tipogasto) {
          setTipogasto(tipogasto.id)
          setCategoria(tipogasto.categoria)
        }
        setResponsable(responsableIngresos.find((r) => r.nombre === gasto[0].responsable).id)
      }
      fetchData()
    }, [id, tipogastos, responsableIngresos])

  const obtenerGasto = async (id) => {
    const response = await fetch(`${pagina.pagina}${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${id}`)
    const gasto = await response.json()
    const fechaMoment = moment.utc(gasto[0].fecha)
    setSelectedDate(fechaMoment)
    return gasto
  }
  
  const handletipoCambioChange = (text) => {
    settipocambio(text)
    if (totalar && tipocambio) {
      const total = totalar * text
      setTotal(total.toFixed(2))
    } else {
      setTotal(0)
    }
  }
  const handleTotalarChange = (text) => {
    if (text === 0) {
      setTotalar(null)
    } else {
     setTotalar(text)
      if (totalar && tipocambio) {
        const total = text * tipocambio
        setTotal(total.toFixed(2))
      } else {
        setTotal(0)
      }
  }}

  const handleTipogastoChange = (itemValue) => {
    setTipogasto(itemValue)
    const tipogastoSeleccionado = tipogastos.find((tg) => tg.id === itemValue)
    if (tipogastoSeleccionado) {
      setCategoria(tipogastoSeleccionado.categoria)
      setResponsable(tipogastoSeleccionado.responsable)
    } else {
      setCategoria('')
      setResponsable('')
    }
  }

  const showDatePicker = () => {
    setDatePickerVisible(true)
  }
  
  const hideDatePicker = () => {
    setDatePickerVisible(false)
  }

  const handleConfirm = (date) => {
    hideDatePicker()
    const utcDate = moment(date)
    setSelectedDate(utcDate)
    setFecha(utcDate)
  }

  const createGasto = async (gasto) => {
    try {
      const response = await fetch(`${pagina.pagina}${symbols.barra}${pagina.pagina_gasto}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gasto),
      })
      const data = await response.json()
      setvisibleOK(true);
    } catch (error) {
      console.error(error)
    }
  }

  const updateGasto = async (gasto) => {
    try {
      await fetch(`${pagina.pagina}${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${gasto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gasto),
      })
      setvisibleOK(true);
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    const missingFields = [];
    
    if (!tipogasto) {
      missingFields.push(atributos.tipo_gasto);
    }
        
    if (!responsable) {
      missingFields.push(atributos.responsable);
    }
    if (!tipocambio) {
      missingFields.push(atributos.tipo_cambio);
    }

    if (!totalar) {
      missingFields.push(atributos.total_arg);
    }
    
    if (!total) {
      missingFields.push(atributos.total_uyu);
    }

    
    if (missingFields.length > 0) {
      const message = missingFields.map((field) => `\n\n→ ${field}`).join('\n');
      setMessage(message)
      setVisible(true);
      return;
    }

    const gasto = {  fecha: selectedDate.format('YYYY-MM-DD HH:mm:ss'), tipogasto, tipocambio, totalar, total, descripcion, responsable, id }
    if (gasto.id) {
      await updateGasto(gasto)
    } else {
      await createGasto(gasto)
    }
  }

  const handleCancel = () => {
    navigate(`${symbols.barra}${pagina.pagina_gasto}`, { replace: true })
  }

  const handleDelete = async () => {
    if (id) {
      setvisibleDelete(true);
    }
  }



  return (
    <>
    <ScrollView  showsVerticalScrollIndicator={true}
    vertical
    style={styles.scroll}
    scrollEventThrottle={theme.scroll.desplazamiento}
    >
    <View >
       <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{`${button_text.formulario}${atributos.gasto}`}</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
          <Text style={styles.loadingText}>{alerts.cargando}</Text>
        </View>
      ) : (
        <>
      <View style={styles.backgroundContainer}>
       <View style={styles.container}> 

          <View style={styles.rowContainer}>
      <Text style={styles.text}>{`${atributos.fecha}${symbols.colon}`}</Text>
        <Text style={styles.dateText}>{selectedDate.format('LL')}</Text>
      <View style={styles.buttonContainer}>
  <Icon.Button name={theme.icons.calendar} title="" onPress={showDatePicker}>{`${button_text.select}`}</Icon.Button>
      </View>
      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>

  <View style={styles.rowContainer}>
    <Text style={styles.text}>{`${atributos.tipo_gasto}${symbols.colon}`}</Text>
    <Picker
        selectedValue={tipogasto}
        onValueChange={handleTipogastoChange}
        style={styles.picker}
        mode='dropdown'
        dropdownIconColor={theme.colors.textSecondary}
      >
        <Picker.Item label={`${button_text.select} ${atributos.tipo_gasto}`} value="" color={theme.colors.gray}/>
        {tipogastos.map((tg) => (
          <Picker.Item key={tg.id} label={tg.descripcion} value={tg.id} />
        ))}
      </Picker>
  </View>

<View style={styles.rowContainer}>
    <Text style={styles.text}>{`${atributos.responsable}${symbols.colon}`}</Text>
    <Picker
        selectedValue={responsable}
        onValueChange={(text) => setResponsable(text)}
        style={styles.picker}
        mode='dropdown'
        dropdownIconColor={theme.colors.textSecondary}
      >
        <Picker.Item label={`${button_text.select} ${atributos.responsable}`} value='' color={theme.colors.gray}/>
        {responsableIngresos.map((r) => (
          <Picker.Item key={r.id} label={r.nombre} value={r.id} />
        ))}
      </Picker>
  </View>

  <View style={styles.rowContainer}>
    <Text style={styles.text}>{`${atributos.tipo_cambio}${symbols.colon}`}</Text>
    <TextInput
    mode='outlined'
      value={tipocambio}
      onChangeText={handletipoCambioChange}
      placeholder={atributos.tipo_cambio}
      keyboardType="numeric"
      style={styles.text_input}
      outlineStyle={{borderColor:theme.colors.primary}}
    />
  </View>



  <View style={styles.rowContainer}>
    <Text style={styles.text}>{`${atributos.total_arg}${symbols.colon}`}</Text>
    <TextInput
    mode='outlined'
      value={totalar}
      onChangeText={handleTotalarChange}
      placeholder={atributos.total_arg}
      keyboardType="numeric"
      style={styles.text_input}
      outlineStyle={{borderColor:theme.colors.primary}}
    />
  </View>


  <View style={styles.rowContainer}>
    <Text style={styles.text}>{`${atributos.total_uyu}${symbols.colon}`}</Text>
   {totalar? 
  (tipocambio?  <TextInput style={styles.text_input} mode='outlined' disabled>{total}</TextInput> : <TextInput style={styles.text_input} mode='outlined' disabled >{`${button_text.ingresar}${symbols.space}${atributos.tipo_cambio}`}</TextInput>) 
  : 
  (tipocambio? <TextInput style={styles.text_input} mode='outlined' disabled>{`${button_text.ingresar}${symbols.space}${atributos.total_arg}`}</TextInput> 
  : <TextInput style={styles.text_input}  mode='outlined' disabled>{`${button_text.ingresar}${symbols.space}${atributos.total_arg}${symbols.and}${atributos.tipo_cambio}`}</TextInput>)
}
  </View>


  <View style={styles.rowContainer}>
      <Text style={styles.text}>{`${atributos.descripcion}${symbols.colon}`}</Text>
      <TextInput
      mode='outlined'
        value={descripcion}
        onChangeText={(text) => setDescripcion(text)}
        placeholder={`${atributos.descripcion}${symbols.space}${button_text.opcional}`}
        style={styles.text_input}
        outlineStyle={{borderColor:theme.colors.primary}}
      />
  </View>



<View>

      <View style={styles.rowContainer}>
        <Text style={styles.text}>{`${atributos.categoria}${symbols.colon}`}</Text>
          {categoria ? <TextInput style={styles.text_input} mode='outlined' disabled>{categoriaGastos.find((c) => c.id === categoria).descripcion}</TextInput> : 
          <TextInput style={styles.text_input} mode='outlined' disabled>{`${button_text.select}${symbols.space}${atributos.tipo_gasto}`}</TextInput>}
      </View>
    </View>

    </View>
{/* Mensaje de faltan datos */}
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Icon icon="alert" />
        <Dialog.Title style={styles.title}>{alerts.missing_data}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{`${message}`}</Text>
        </Dialog.Content>
        <Dialog.Actions>
              <Icon.Button name={theme.icons.close} onPress={() => setVisible(false)}>{button_text.cancel}</Icon.Button>
            </Dialog.Actions>
      </Dialog>
    </Portal>
{/* Mensaje de todo OK */}
    <Portal>
      <Dialog visible={visibleOK} onDismiss={() => setvisibleOK(false)}>
        <Dialog.Icon icon="emoticon-cool-outline" />
        <Dialog.Title style={styles.title}>{alerts.guardado_exito}</Dialog.Title>
        <Dialog.Actions>
              <Icon.Button name="angellist" onPress={() => navigate(`${symbols.barra}${pagina.pagina_gasto}`, { replace: true })}>{button_text.ok}</Icon.Button>
            </Dialog.Actions>
      </Dialog>
    </Portal>
{/* Mensaje de borrado */}
    <Portal>
      <Dialog visible={visibleDelete} onDismiss={() => setvisibleDelete(false)}>
        <Dialog.Icon icon="delete-alert" />
        <Dialog.Title style={styles.title}>{alerts.delete_question}</Dialog.Title>
        <Dialog.Actions style={{justifyContent:'center', justifyContent:'space-between'}}>
              <Icon.Button name={theme.icons.close} backgroundColor="transparent" color={theme.colors.edit} onPress={() => setvisibleDelete(false)}>{button_text.cancel}</Icon.Button>
              <Icon.Button name="trash" backgroundColor={theme.colors.delete} onPress={async () => {try {
          const response = await fetch(`${pagina.pagina}${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
              })
            setvisibleDelete(false)
            setvisibleOKDelete(true)}
              catch {(error)}}}>{button_text.delete}
              </Icon.Button>
            </Dialog.Actions>
      </Dialog>
    </Portal>
    <Portal>
    <Dialog visible={visibleOKDelete} onDismiss={() => setvisibleOKDelete(false)}>
        <Dialog.Icon icon="delete-empty" />
        <Dialog.Title style={styles.title}>{alerts.delete_exito}</Dialog.Title>
        <Dialog.Actions>
              <Icon.Button name="angellist" onPress={() => navigate(`${symbols.barra}${pagina.pagina_gasto}`, { replace: true })}>{button_text.ok}</Icon.Button>
            </Dialog.Actions>
      </Dialog>
      </Portal>
    </View>

    <View style={styles.rowButton}>
      <View style={styles.button}>
      <Icon.Button backgroundColor={theme.colors.cancelar} name={theme.icons.close} title="" onPress={handleCancel}>{button_text.cancel}</Icon.Button>
      </View>
      {!deleteMode && (
    <View style={styles.button}>
      <Icon.Button backgroundColor={theme.colors.agregar} name={theme.icons.save} title="" onPress={handleSubmitForm} >{button_text.sumbit}</Icon.Button>
      
    </View>
       )}
      {deleteMode && (
    <View style={styles.button}>
      <Icon.Button backgroundColor={theme.colors.red} name={theme.icons.borrar} title="" onPress={handleDelete}>{button_text.delete}</Icon.Button>
    </View>
      )}
      </View>
      </>

     )}
     
    </View>
    </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
  },
  dateText: {
    fontSize: theme.fontSizes.ingresar,
    marginRight:80
  },
  buttonContainer: {
    marginLeft: -60,
  },
  button: {
    padding: 16,
    alignItems: 'center',
  },
  text:{
    padding: 10,
    fontSize: theme.fontSizes.ingresar,
    color: theme.colors.white,
    backgroundColor: theme.colors.primary,
    marginVertical: 2,
    borderRadius:6,
    overflow: 'hidden',
    marginRight: 8,
    marginLeft: 15
  },
  rowContainer: {
    fontSize: theme.fontSizes.ingresar,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginEnd:20,
    width:screenWidth*0.97,
  },
  picker: {
    flex: 1,
    fontSize: theme.fontSizes.ingresar,
    height: 40,
    marginEnd:16,
    width: screenWidth * 0.6,
    borderColor: theme.colors.gray,
    borderWidth: 1,
    backgroundColor: theme.colors.picker
  },
  rowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
   title: {
    textAlign: 'center',
  },
  text_input:{
    flex: 1,
    marginRight: 16, 
    height: 40,
    padding: 10,
    paddingVertical: 8,
    fontSize:13,
  }, 
  container: {
    padding:10,
    paddingHorizontal:10,
    marginEnd:20,
},
backgroundContainer:{
  backgroundColor: theme.colors.table,
},
scroll:{
  flex:1,
}
})

export default AgregarGasto