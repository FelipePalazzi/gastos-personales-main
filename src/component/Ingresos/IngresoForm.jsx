import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, BackHandler} from 'react-native'
import useIngresos from '../../hooks/useIngresos'
import useMonedaIngreso from '../../hooks/useMonedaIngreso'
import useResponsableIngreso from '../../hooks/useResponsableIngreso'
import { useParams, useLocation  } from "react-router-dom"
import {useNavigate} from 'react-router-native'
import {Picker} from '@react-native-picker/picker'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import Icon from 'react-native-vector-icons/FontAwesome'
import theme from '../../styles/theme'
import { ActivityIndicator ,Dialog, Portal, TextInput, } from 'react-native-paper'
import moment from 'moment'
import 'moment/locale/es'
import { alerts,button_text, atributos, symbols,pagina } from '../../constants'
import { styleForm } from '../../styles/styles.js'
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

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
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(moment())
  const params = useParams()
  const id = params.id
  const [visible, setVisible] = useState(false);
  const [visibleOK, setvisibleOK] = useState(false);
  const [visibleDelete, setvisibleDelete] = useState(false);
  const [visibleOKDelete, setvisibleOKDelete] = useState(false);
  const [visibleBack, setVisibleBack] = useState(false);
  const [message, setMessage] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
        const ingreso = await obtenerGasto(id)
        setTipocambio(ingreso[0].tipocambio.toFixed(4))
        setImporte(ingreso[0].importe.toFixed(2))
        setDescripcion(ingreso[0].descripcion)
        setResponsable(responsableIngresos.find((r) => r.nombre === ingreso[0].responsable).id)
        setMoneda(monedaIngresos.find((mi) => mi.descripcion === ingreso[0].moneda).id)
      }
      fetchData()
  }, [id, responsableIngresos,monedaIngresos])

  const obtenerGasto = async (id) => {
    const response = await fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}${id}`)
    const ingreso = await response.json()
    const fechaMoment = moment.utc(ingreso[0].fecha)
    setSelectedDate(fechaMoment)
    return ingreso
  }

  const handleTipocambioChange = (text) => {
    setTipocambio(text)
  }
  const showDatePicker = () => {
    setDatePickerVisible(true)
  }
  
  const hideDatePicker = () => {
    setDatePickerVisible(false)
  }
  const handleConfirm = (date) => {
    const utcDate = moment(date)
    setSelectedDate(utcDate)
    setFecha(utcDate)
    hideDatePicker()
  }

  const createIngreso = async (ingreso) => {
    try {
      const response = await fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_ingreso}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ingreso),
      })
      const data = await response.json()
      setvisibleOK(true);
    } catch (error) {
      console.error(error)
    }
  }

  const updateIngreso = async (ingreso) => {
    try {
      await fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}${ingreso.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ingreso),
      })
      setvisibleOK(true);
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
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
      const message = missingFields.map((field) => `\n\n→ ${field}`).join('\n');
      setMessage(message)
      setVisible(true);
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
      setvisibleDelete(true);
}
}

useEffect(() => {
  const backAction = () => {
    setVisibleBack(true)
    return true;
  };
  
  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    backAction,
  );

  return () => backHandler.remove();
}, []);

  return (
    <>
    <ScrollView  showsVerticalScrollIndicator={true}
    vertical
    style={styleForm.scroll}
    scrollEventThrottle={theme.scroll.desplazamiento}
    >
    <View >
     {/*Mensaje de volver*/}
    <Portal>
      <Dialog visible={visibleBack} onDismiss={() => setVisibleBack(false)}>
        <Dialog.Icon icon={theme.icons.volverAlert} />
        <Dialog.Title style={styleForm.title}>{alerts.regresar}</Dialog.Title>
        <Dialog.Actions style={styleForm.dialogActions}>
        <Icon.Button name={theme.icons.close} backgroundColor={theme.colors.transparente} color={theme.colors.edit} onPress={() => setVisibleBack(false)}>{button_text.cancel}</Icon.Button>
              <Icon.Button name={theme.icons.volver} onPress={() => 
                navigate(`${symbols.barra}${pagina.pagina_ingreso}`, { replace: true })}>
                  {button_text.volver}
                  </Icon.Button>
            </Dialog.Actions>
      </Dialog>
    </Portal>

       <View style={styleForm.loadingContainer}>
        <Text style={styleForm.loadingText}>{`${button_text.formulario}${atributos.gasto}`}</Text>
      </View>
      {loading ? (
        <View style={styleForm.loadingContainer}>
          <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
          <Text style={styleForm.loadingText}>{alerts.cargando}</Text>
        </View>
      ) : (
      <>
      <View style={styleForm.backgroundContainer}>
       <View style={styleForm.container}> 

          <View style={styleForm.rowContainer}>
      <Text style={styleForm.text}>{`${atributos.fecha}${symbols.colon}`}</Text>
        <Text style={[styleForm.dateText, { color: !deleteMode? theme.colors.black : theme.colors.gray }]}>{selectedDate.format('LL')}</Text>
      <View style={styleForm.buttonContainer}>
  <Icon.Button name={theme.icons.calendar} disabled={deleteMode} backgroundColor={!deleteMode ? theme.colors.blue : theme.colors.disabled} onPress={showDatePicker}>{`${button_text.select}`}</Icon.Button>
      </View>
      <DateTimePickerModal
      enabled={!deleteMode}
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
    </View>
    <View >
  <View style={styleForm.rowContainer}>
    <Text style={styleForm.text}>{`${atributos.responsable}${symbols.colon}`}</Text>
  <Picker
  enabled={!deleteMode}
    selectedValue={responsable}
    onValueChange={(text) => setResponsable(text)}
    style={styleForm.picker}
    mode={theme.picker.modo}
    dropdownIconColor={deleteMode? theme.colors.disabled : theme.colors.textSecondary}
    >
    <Picker.Item label={`${button_text.select} ${atributos.responsable}`} value="" color={theme.colors.gray}/>
    {responsableIngresos.map((ri) => (
      <Picker.Item key={ri.id} label={ri.nombre} value={ri.id} color={!deleteMode? theme.colors.black :theme.colors.gray}/>
    ))}
  </Picker>
  </View>

  <View style={styleForm.rowContainer}>
    <Text style={styleForm.text}>{`${atributos.tipo_importe}${symbols.colon}`}</Text>
  <Picker
  enabled={!deleteMode}
    selectedValue={moneda}
    onValueChange={(text) => {
      setMoneda(text);
      if (text === monedaIngresos.find((mi) => mi.descripcion === atributos.ar).id) {
        handleTipocambioChange('1');
      }
    }}
    style={styleForm.picker}
    mode={theme.picker.modo}
    dropdownIconColor={deleteMode? theme.colors.disabled :theme.colors.textSecondary}
   >
    <Picker.Item label={`${button_text.select} ${atributos.tipo_importe}`} value='' color={theme.colors.gray}/>
    {monedaIngresos.map((ri) => (
      <Picker.Item key={ri.id} label={ri.descripcion} value={ri.id} color={!deleteMode? theme.colors.black :theme.colors.gray}/>
    ))}
  </Picker>
  </View>

  <View style={styleForm.rowContainer}>
    <Text style={styleForm.text}>{`${atributos.tipo_cambio}${symbols.colon}`}</Text>
    <TextInput
    disabled={deleteMode || moneda===monedaIngresos.find((mi) => mi.descripcion === atributos.ar).id}
    mode='outlined'
      value={tipocambio}
      onChangeText={handleTipocambioChange}
      placeholder={atributos.tipo_cambio}
      keyboardType="numeric"
      style={styleForm.text_input}
      outlineStyle={deleteMode? { borderColor: theme.colors.disabled } : { borderColor: theme.colors.primary }}
      />
  </View>

<View style={styleForm.rowContainer}>
      <Text style={styleForm.text}>{`${atributos.importe}${symbols.colon}`}</Text>
      <TextInput
       disabled={deleteMode}
          mode='outlined'
        value={importe}
        onChangeText={(text) => setImporte(text)}
        placeholder={atributos.importe}
        keyboardType="numeric"
        style={styleForm.text_input}
        outlineStyle={deleteMode? { borderColor: theme.colors.disabled } : { borderColor: theme.colors.primary }}
    />
  </View>

  <View style={styleForm.rowContainer}>
      <Text style={styleForm.text}>{`${atributos.descripcion}${symbols.colon}`}</Text>
      <TextInput
      disabled={deleteMode}
      mode='outlined'
        value={descripcion}
        onChangeText={(text) => setDescripcion(text)}
        placeholder={`${atributos.descripcion}${symbols.space}${button_text.opcional}`}
        style={styleForm.text_input}
        outlineStyle={deleteMode? { borderColor: theme.colors.disabled } : { borderColor: theme.colors.primary }}
        />
  </View>
  </View>
 {/* Mensaje de faltan datos */}
 <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Icon icon={theme.icons.alerta}  />
        <Dialog.Title style={styleForm.title}>{alerts.missing_data}</Dialog.Title>
        <Dialog.Content>
          <Text style={styleForm.dateText}>{`${message}`}</Text>
        </Dialog.Content>
        <Dialog.Actions>
              <Icon.Button name={theme.icons.close} onPress={() => setVisible(false)}>{button_text.cancel}</Icon.Button>
            </Dialog.Actions>
      </Dialog>
    </Portal>
{/* Mensaje de todo OK */}
    <Portal>
      <Dialog visible={visibleOK} onDismiss={() => navigate(`${symbols.barra}${pagina.pagina_ingreso}`, { replace: true })}>
        <Dialog.Icon icon={theme.icons.okAlert}  />
        <Dialog.Title style={styleForm.title}>{alerts.guardado_exito}</Dialog.Title>
        <Dialog.Actions>
              <Icon.Button name={theme.icons.ok} onPress={() => navigate(`${symbols.barra}${pagina.pagina_ingreso}`, { replace: true })}>{button_text.ok}</Icon.Button>
            </Dialog.Actions>
      </Dialog>
    </Portal>
{/* Mensaje de borrado */}
    <Portal>
      <Dialog visible={visibleDelete} onDismiss={() => setvisibleDelete(false)}>
        <Dialog.Icon icon={theme.icons.deleteAlert} />
        <Dialog.Title style={styleForm.title}>{alerts.delete_question}</Dialog.Title>
        <Dialog.Actions style={styleForm.dialogActions}>
              <Icon.Button name={theme.icons.close} backgroundColor={theme.colors.transparente} color={theme.colors.edit} onPress={() => setvisibleDelete(false)}>{button_text.cancel}</Icon.Button>
              <Icon.Button name={theme.icons.borrar} backgroundColor={theme.colors.delete} onPress={async () => {try {
          const response = await fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}${id}`, {
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
        <Dialog.Icon icon={theme.icons.deleteComplete} />
        <Dialog.Title style={styleForm.title}>{alerts.delete_exito}</Dialog.Title>
        <Dialog.Actions>
              <Icon.Button name={theme.icons.ok} onPress={() => navigate(`${symbols.barra}${pagina.pagina_ingreso}`, { replace: true })}>{button_text.ok}</Icon.Button>
            </Dialog.Actions>
      </Dialog>
      </Portal>
    </View>

    <View style={styleForm.rowButton}>
      <View style={styleForm.button}>
      <Icon.Button backgroundColor={theme.colors.cancelar} name={theme.icons.close}  onPress={handleCancel}>{button_text.cancel}</Icon.Button>
      </View>
      {!deleteMode && (
    <View style={styleForm.button}>
      <Icon.Button backgroundColor={theme.colors.agregar} name={theme.icons.save}  onPress={handleSubmitForm} >{button_text.sumbit}</Icon.Button>
      
    </View>
       )}
      {deleteMode && (
    <View style={styleForm.button}>
      <Icon.Button backgroundColor={theme.colors.red} name={theme.icons.borrar}  onPress={handleDelete}>{button_text.delete}</Icon.Button>
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


export default AgregarIngreso