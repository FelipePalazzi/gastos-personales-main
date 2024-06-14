import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, StyleSheet,Alert,} from 'react-native'
import useIngresos from '../hooks/useIngresos'
import useMonedaIngreso from '../hooks/useMonedaIngreso'
import useResponsableIngreso from '../hooks/useResponsableIngreso'
import { useParams, useLocation  } from "react-router-dom"
import {useNavigate} from 'react-router-native'
import {Picker} from '@react-native-picker/picker'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import Icon from 'react-native-vector-icons/FontAwesome'
import theme from '../styles/theme'
import { ActivityIndicator } from 'react-native-paper'
import { Dimensions } from 'react-native'
import moment from 'moment'
import 'moment/locale/es'
import { alerts,button_text, atributos, symbols,pagina } from '../constants'

const screenWidth = Dimensions.get('window').width

const AgregarIngreso = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const deleteMode = location.state?.deleteMode
  const [responsable, setResponsable] = useState('')
  const [tipocambio, setTipocambio] = useState('')
  const [moneda, setMoneda] = useState('')
  const [importe, setImporte] = useState(0)
  const [descripcion, setDescripcion] = useState('')
  const { loading } = useIngresos()
  const { monedaIngresos } = useMonedaIngreso()
  const { responsableIngresos } = useResponsableIngreso()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [selectedDate, setSelectedDate] = useState(moment())
  const [isFocused, setIsFocused] = useState(false)
  const params = useParams()
  const id = params.id
  
  useEffect(() => {
      const fetchData = async () => {
        const ingreso = await obtenerGasto(id)
        setResponsable(ingreso[0].responsable)
        setTipocambio(ingreso[0].tipocambio.toFixed(4))
        setMoneda(ingreso[0].moneda)
        setImporte(ingreso[0].importe.toFixed(2))
        setDescripcion(ingreso[0].descripcion)
        responsableIngresos.find((ri) => ri.nombre === ingreso[0].responsable)
        monedaIngresos.find((mi) => mi.descripcion === ingreso[0].moneda)
      }
      fetchData()
  }, [id, responsableIngresos,monedaIngresos])

  const obtenerGasto = async (id) => {
    const response = await fetch(`${pagina.pagina}${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}${id}`)
    const ingreso = await response.json()
    const fechaMoment = moment.utc(ingreso[0].fecha)
    setSelectedDate(fechaMoment)
    return ingreso
  }

  const handleTipocambioChange = (text) => {
    setTipocambio(text)
  }
  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }
  
  const hideDatePicker = () => {
    setDatePickerVisibility(false)
  }
  const handleConfirm = (date) => {
    const utcDate = moment(date)
    setSelectedDate(utcDate)
    setFecha(utcDate)
    hideDatePicker()
  }

  const createIngreso = async (ingreso) => {
    try {
      const response = await fetch(`${pagina.pagina}${symbols.barra}${pagina.pagina_ingreso}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ingreso),
      })
      const data = await response.json()
      Alert.alert(alerts.exito, alerts.guardado_exito, [
        { text:button_text.ok, onPress: () => navigate(`${symbols.barra}${pagina.pagina_ingreso}`, { replace: true }) },
      ])
    } catch (error) {
      console.error(error)
    }
  }

  const updateIngreso = async (ingreso) => {
    try {
      await fetch(`${pagina.pagina}${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}${ingreso.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ingreso),
      })
      Alert.alert(alerts.exito, alerts.actualizado_exito, [
        { text: button_text.ok, onPress: () => navigate(`${symbols.barra}${pagina.pagina_ingreso}`, { replace: true }) },
      ])
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmitForm = async (e) => {
    const missingFields = [];
            
    if (!responsable) {
      missingFields.push(atributos.responsable);
    }
    if (!moneda) {
      missingFields.push(atributos.tipo_importe);
    }

    if (!tipocambio) {
      missingFields.push(atributos.tipo_cambio);
    }

    if (!importe) {
      missingFields.push(atributos.importe);
    }
   
    if (missingFields.length > 0) {
      const message = missingFields.map((field) => `→ ${field}`).join('\n');
      Alert.alert(`${alerts.missing_data}${symbols.colon}`, message);
      return;
    }
    const ingreso = {
    fecha: selectedDate.format('YYYY-MM-DD HH:mm:ss'),
      responsable,
      moneda,
      importe,
      tipocambio, 
      descripcion,
      id,
    }
    if (ingreso.id) {
      await updateIngreso(ingreso)
    } else {
      await createIngreso(ingreso)
    }
  }
  const handleCancel = () => {
    navigate(`${symbols.barra}${pagina.pagina_ingreso}`, { replace: true })
  }

  const handleDelete = async () => {
    if (id) {
      Alert.alert(
       `${button_text.delete}${atributos.gasto}`,
        alerts.delete_question,
        [
          {
            text: button_text.cancel,
            style: theme.alerts.cancelar,
          },
          {
            text: button_text.delete,
            onPress: async () => {
              try {
        const response = await fetch(`${pagina.pagina}${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        Alert.alert(alerts.exito, alerts.delete_exito, [
          { text: button_text.ok, onPress: () => navigate(`${symbols.barra}${pagina.pagina_ingreso}`, { replace: true }) },
        ])
      } catch (error) {
        console.error(`${alerts.error_ocurrido}${atributos.ingreso}${error.message}`)
      }
    }
  }
]
)
}
}
  return (
    <View >

      <View><Text></Text></View>
      <View><Text></Text></View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
          <Text style={styles.loadingText}>{alerts.cargando}</Text>
        </View>
      ) : (<View>
      <View >
          <View style={styles.rowContainer}>
      <Text style={styles.text}>{`${atributos.fecha}${symbols.colon}`}</Text>
        <Text style={styles.dateText}>{selectedDate.format('LL')}</Text>
      <View style={styles.buttonContainer}>
  <Icon.Button name={theme.icons.calendar} title="" onPress={showDatePicker}>{`${button_text.select}`}</Icon.Button>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
    </View>
    <View >
  <View style={styles.rowContainer}>
    <Text style={styles.text}>{`${atributos.responsable}${symbols.colon}`}</Text>
    {responsableIngresos && (
  <Picker
    selectedValue={responsable}
    onValueChange={(text) => setResponsable(text)}
    style={styles.picker}
  >
    <Picker.Item label={`${button_text.select}`} value="" />
    {responsableIngresos.map((ri) => (
      <Picker.Item key={ri.id} label={ri.nombre} value={ri.id} />
    ))}
  </Picker>
)}
  </View>
</View>

<View>
  <View style={styles.rowContainer}>
    <Text style={styles.text}>{`${atributos.tipo_importe}${symbols.colon}`}</Text>
    {monedaIngresos && (
  <Picker
    selectedValue={moneda}
    onValueChange={(text) => setMoneda(text)}
    style={styles.picker}
  >
    <Picker.Item label={`${button_text.select}`} value="" />
    {monedaIngresos.map((ri) => (
      <Picker.Item key={ri.id} label={ri.descripcion} value={ri.id} />
    ))}
  </Picker>
)}
  </View>
</View>


<View>
  <View style={styles.rowContainer}>
    <Text style={styles.text}>{`${atributos.tipo_cambio}${symbols.colon}`}</Text>
    <TextInput
      value={tipocambio}
      onChangeText={handleTipocambioChange}
      placeholder={atributos.tipo_cambio}
      keyboardType="numeric"
      style={{
        width: 250,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: isFocused ? theme.colors.primary : theme.colors.notFocused,
        paddingVertical: 8,
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  </View>
</View>

<View>
<View style={styles.rowContainer}>
      <Text style={styles.text}>{`${atributos.importe}${symbols.colon}`}</Text>
      <TextInput
        value={importe}
        onChangeText={(text) => setImporte(text)}
        placeholder={atributos.importe}
        keyboardType="numeric"
        style={{
          width: 250,
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: isFocused ? theme.colors.primary : theme.colors.notFocused,
          paddingVertical: 8,
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
  </View>
</View>
<View >
  <View style={styles.rowContainer}>
      <Text style={styles.text}>{`${atributos.descripcion}${symbols.colon}`}</Text>
      <TextInput
        value={descripcion}
        onChangeText={(text) => setDescripcion(text)}
        placeholder={`${atributos.descripcion}${symbols.space}${button_text.opcional}`}
        style={{
          width: 250,
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: isFocused ? theme.colors.primary : theme.colors.notFocused,
          paddingVertical: 8,
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
  </View>
</View>
<View>
<View>
    </View>
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
      <Icon.Button backgroundColor={theme.colors.red} name={theme.icons.borrar} title="" onPress={handleDelete} >{button_text.delete}</Icon.Button>
    </View>
      )}
      </View>
      </View>
     )}
    </View>
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
    backgroundColor: theme.colors.white,
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
  },
  picker: {
    fontSize: theme.fontSizes.ingresar,
    padding: 8,
    height: 40,
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
    marginTop: 150
  },
})

export default AgregarIngreso