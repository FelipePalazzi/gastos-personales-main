import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView,BackHandler} from 'react-native'
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
import moment from 'moment'
import 'moment/locale/es'
import { alerts,button_text, atributos, symbols,pagina } from '../constants'
import { styleForm } from '../styles/styles.js'
import {PAGINA_URL} from '@env'

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
  const [visibleBack, setVisibleBack] = useState(false);
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
    const response = await fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${id}`)
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
      const response = await fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_gasto}`, {
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
      await fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${gasto.id}`, {
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
                navigate(`${symbols.barra}${pagina.pagina_gasto}`, { replace: true })}>
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
    <Text style={styleForm.text}>{`${atributos.tipo_gasto}${symbols.colon}`}</Text>
    <Picker
    enabled={!deleteMode}
        selectedValue={tipogasto}
        onValueChange={handleTipogastoChange}
        style={styleForm.picker}
        mode={theme.picker.modo}
        dropdownIconColor={deleteMode? theme.colors.disabled : theme.colors.textSecondary}
      >
        <Picker.Item label={`${button_text.select} ${atributos.tipo_gasto}`} value="" color={theme.colors.gray}/>
        {tipogastos.map((tg) => (
          <Picker.Item key={tg.id} label={tg.descripcion} value={tg.id} color={!deleteMode? theme.colors.black :theme.colors.gray}/>
        ))}
      </Picker>
  </View>

<View style={styleForm.rowContainer}>
    <Text style={styleForm.text}>{`${atributos.responsable}${symbols.colon}`}</Text>
    <Picker
    enabled={!deleteMode}
        selectedValue={responsable}
        onValueChange={(text) => setResponsable(text)}
        style={styleForm.picker}
        mode={theme.picker.modo}
        dropdownIconColor={deleteMode? theme.colors.disabled :theme.colors.textSecondary}
      >
        <Picker.Item label={`${button_text.select} ${atributos.responsable}`} value='' color={theme.colors.gray}/>
        {responsableIngresos.map((r) => (
          <Picker.Item key={r.id} label={r.nombre} value={r.id} color={!deleteMode? theme.colors.black :theme.colors.gray}/>
        ))}
      </Picker>
  </View>

  <View style={styleForm.rowContainer}>
    <Text style={styleForm.text}>{`${atributos.tipo_cambio}${symbols.colon}`}</Text>
    <TextInput
    disabled={deleteMode}
    mode='outlined'
      value={tipocambio}
      onChangeText={handletipoCambioChange}
      placeholder={atributos.tipo_cambio}
      keyboardType="numeric"
      style={styleForm.text_input}
      outlineStyle={deleteMode? { borderColor: theme.colors.disabled } : { borderColor: theme.colors.primary }}
    />
  </View>



  <View style={styleForm.rowContainer}>
    <Text style={styleForm.text}>{`${atributos.total_arg}${symbols.colon}`}</Text>
    <TextInput
    disabled={deleteMode}
    mode='outlined'
      value={totalar}
      onChangeText={handleTotalarChange}
      placeholder={atributos.total_arg}
      keyboardType="numeric"
      style={styleForm.text_input}
      outlineStyle={deleteMode? { borderColor: theme.colors.disabled } : { borderColor: theme.colors.primary }}
    />
  </View>


  <View style={styleForm.rowContainer}>
    <Text style={styleForm.text}>{`${atributos.total_uyu}${symbols.colon}`}</Text>
   {totalar? 
  (tipocambio?  <TextInput style={styleForm.text_input} mode='outlined' disabled>{total}</TextInput> : <TextInput style={styleForm.text_input} mode='outlined' disabled >{`${button_text.ingresar}${symbols.space}${atributos.tipo_cambio}`}</TextInput>) 
  : 
  (tipocambio? <TextInput style={styleForm.text_input} mode='outlined' disabled>{`${button_text.ingresar}${symbols.space}${atributos.total_arg}`}</TextInput> 
  : <TextInput style={styleForm.text_input}  mode='outlined' disabled>{`${button_text.ingresar}${symbols.space}${atributos.total_arg}${symbols.and}${atributos.tipo_cambio}`}</TextInput>)
}
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



<View>

      <View style={styleForm.rowContainer}>
        <Text style={styleForm.text}>{`${atributos.categoria}${symbols.colon}`}</Text>
          {categoria ? <TextInput style={styleForm.text_input} mode='outlined' disabled>{categoriaGastos.find((c) => c.id === categoria).descripcion}</TextInput> : 
          <TextInput style={styleForm.text_input} mode='outlined' disabled>{`${button_text.select}${symbols.space}${atributos.tipo_gasto}`}</TextInput>}
      </View>
    </View>

    </View>
{/* Mensaje de faltan datos */}
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Icon icon={theme.icons.alerta} />
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
      <Dialog visible={visibleOK} onDismiss={() => setvisibleOK(false)}>
        <Dialog.Icon icon={theme.icons.okAlert} />
        <Dialog.Title style={styleForm.title}>{alerts.guardado_exito}</Dialog.Title>
        <Dialog.Actions>
              <Icon.Button name={theme.icons.ok} onPress={() => navigate(`${symbols.barra}${pagina.pagina_gasto}`, { replace: true })}>{button_text.ok}</Icon.Button>
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
          const response = await fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${id}`, {
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
              <Icon.Button name={theme.icons.ok} onPress={() => navigate(`${symbols.barra}${pagina.pagina_gasto}`, { replace: true })}>{button_text.ok}</Icon.Button>
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

export default AgregarGasto