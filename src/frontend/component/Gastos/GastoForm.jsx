import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView} from 'react-native'
import useTipoGasto from '../../../hooks/useTipoGasto'
import useCategoriaGasto from '../../../hooks/useCategoriaGasto'
import useResponsableIngreso from '../../../hooks/useResponsableIngreso'
import {Picker} from '@react-native-picker/picker'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import Icon from 'react-native-vector-icons/FontAwesome'
import theme from '../../theme/theme'
import { ActivityIndicator ,Dialog, Portal, TextInput,} from 'react-native-paper'
import moment from 'moment'
import 'moment/locale/es'
import { alerts,button_text, atributos, symbols,pagina } from '../../../constants'
import { styleForm } from '../../styles/styles.js'
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const AgregarGasto = ({ navigation }) => {
  const route = useRoute();
  const {gastoParam,deleteMode, keyid, labelHeader} = route.params;
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);
  const { tipogastos } = useTipoGasto(keyid)
  const {responsableIngresos} = useResponsableIngreso(keyid)
  const {categoriaGastos} = useCategoriaGasto(keyid)  
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(moment())
  const [visible, setVisible] = useState(false);
  const [visibleOK, setvisibleOK] = useState(false);
  const [visibleDelete, setvisibleDelete] = useState(false);
  const [visibleOKDelete, setvisibleOKDelete] = useState(false);
  const [message, setMessage] = useState([]);

  useEffect(() => {
    if (gastoParam && tipogastos.length > 0 && responsableIngresos.length > 0) {
      delete gastoParam.categoria
      setItem(gastoParam);
  
      const tipogastoSeleccionado = tipogastos.find(
        (tg) => tg.descripcion === gastoParam?.tipogasto
      );
      if (tipogastoSeleccionado) {
        updateItemProperty("tipogasto", tipogastoSeleccionado.id);
      } else {
        updateItemProperty("tipogasto", "");
      }
  
      const responsableSeleccionado = responsableIngresos.find(
        (r) => r.nombre === gastoParam.responsable
      );
      updateItemProperty("responsable", responsableSeleccionado ? responsableSeleccionado.id : "");
      updateItemProperty("fecha", gastoParam.fecha ? moment.utc(gastoParam.fecha).format('YYYY-MM-DD HH:mm:ss') : selectedDate.format('YYYY-MM-DD HH:mm:ss'));
      updateItemProperty("descripcion", gastoParam.descripcion ? gastoParam.descripcion : '');
      updateItemProperty('total', gastoParam.total ? gastoParam.total.toFixed(2) : 0);
      updateItemProperty('totalar', gastoParam.totalar ? gastoParam.totalar.toFixed(0) : 0);
      updateItemProperty('tipocambio', gastoParam.tipocambio ? gastoParam.tipocambio.toFixed(4) : 0);
      if (gastoParam && Object.keys(gastoParam).length > 0) {
        const allFieldsFilled = [
          gastoParam.tipogasto || '', 
          gastoParam.responsable || '',
          gastoParam.fecha || '',
          gastoParam.descripcion || '',
          gastoParam.total || 0, 
          gastoParam.totalar || 0,
          gastoParam.tipocambio || 0
      ].every(field => field !== null && field !== undefined && field !== "");
    
        if (!allFieldsFilled) {
            setLoading(false);
        }
    } else {
        setLoading(false);
    }
    }
  }, [gastoParam, tipogastos, responsableIngresos, categoriaGastos]);

  const updateItemProperty = (key, value) => {
    setItem(prevItem => ({
      ...prevItem,
      [key]: value,
    }));
  };

  const handletipoCambioChange = (text) => {
    updateItemProperty('tipocambio', text)
    if (item.totalar && item.tipocambio) {
      const total = item.totalar * text
      updateItemProperty('total', total.toFixed(2));
    } else {
      updateItemProperty('total', 0);
    }
  }
  const handleTotalarChange = (text) => {
    updateItemProperty('totalar', text || null);
    if (text && item.tipocambio) {
      const total = text * item.tipocambio;
      updateItemProperty('total', total.toFixed(2));
    } else {
      updateItemProperty('total', 0);
    }
  };

  const handleTipogastoChange = (itemValue) => {
    updateItemProperty('tipogasto', itemValue);
    const tipogastoSeleccionado = tipogastos.find((tg) => tg.id === itemValue)
    if (tipogastoSeleccionado) {
      updateItemProperty('responsable', tipogastoSeleccionado.responsable)
    } else {
      updateItemProperty('responsable', '')
    }
  }

  const showDatePicker = () => {
    setDatePickerVisible(true)
  }
  
  const hideDatePicker = () => {
    setDatePickerVisible(false)
  }

  const handleConfirm = (date) => {
    const utcDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
    hideDatePicker();
    setSelectedDate(utcDate);
    updateItemProperty('fecha', utcDate);
  };

  const createGasto = async (gasto) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${keyid}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gasto)
      })
      const data = await response.json()
      setvisibleOK(true);
    } catch (error) {
      console.error(error)
    }
  }

  const updateGasto = async (gasto) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
     const response = await fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${keyid}${symbols.barra}${gasto.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gasto),
      })
      const data = await response.json()
      setvisibleOK(true);
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    const missingFields = [];
    
    if (!item.tipogasto) {
      missingFields.push(atributos.tipo_gasto);
    }
        
    if (!item.responsable) {
      missingFields.push(atributos.responsable);
    }
    if (!item.tipocambio) {
      missingFields.push(atributos.tipo_cambio);
    }

    if (!item.totalar) {
      missingFields.push(atributos.total_arg);
    }
    
    if (!item.total) {
      missingFields.push(atributos.total_uyu);
    }

    
    if (missingFields.length > 0) {
      const message = missingFields.map((field) => `\n\n→ ${field}`).join('\n');
      setMessage(message)
      setVisible(true);
      return;
    }

    if (item.id) {
      await updateGasto(item)
    } else {
      await createGasto(item)
    }
  }

  const handleDelete = async () => {
    if (item.id) {
      setvisibleDelete(true);
    }
  }

  return (
    <>
    <ScrollView  showsVerticalScrollIndicator={true}
    vertical
    style={styleForm.scroll}
    scrollEventThrottle={theme.scroll.desplazamiento}
    >
    <View >
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
        <Text style={[styleForm.dateText, { color: !deleteMode? theme.colors.black : theme.colors.gray }]}>{item.fecha ? moment(item.fecha).format('LL') : 'Fecha no disponible'}</Text>
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
        selectedValue={item.tipogasto}
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
        selectedValue={item.responsable}
        onValueChange={(text) => updateItemProperty('responsable', text)}
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
      value={item.tipocambio}
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
      value={item.totalar}
      onChangeText={(text) => handleTotalarChange(parseFloat(text) || 0)}
      placeholder={atributos.total_arg}
      keyboardType="numeric"
      style={styleForm.text_input}
      outlineStyle={deleteMode? { borderColor: theme.colors.disabled } : { borderColor: theme.colors.primary }}
    />
  </View>


  <View style={styleForm.rowContainer}>
    <Text style={styleForm.text}>{`${atributos.total_uyu}${symbols.colon}`}</Text>
   {item.totalar? 
  (item.tipocambio?  <TextInput style={styleForm.text_input} mode='outlined' disabled>{item.total}</TextInput> : <TextInput style={styleForm.text_input} mode='outlined' disabled >{`${button_text.ingresar}${symbols.space}${atributos.tipo_cambio}`}</TextInput>) 
  : 
  (item.tipocambio? <TextInput style={styleForm.text_input} mode='outlined' disabled>{`${button_text.ingresar}${symbols.space}${atributos.total_arg}`}</TextInput> 
  : <TextInput style={styleForm.text_input}  mode='outlined' disabled>{`${button_text.ingresar}${symbols.space}${atributos.total_arg}${symbols.and}${atributos.tipo_cambio}`}</TextInput>)
}
  </View>


  <View style={styleForm.rowContainer}>
      <Text style={styleForm.text}>{`${atributos.descripcion}${symbols.colon}`}</Text>
      <TextInput
      disabled={deleteMode}
      mode='outlined'
        value={item.descripcion}
        onChangeText={(text) => updateItemProperty('descripcion', text)}
        placeholder={`${atributos.descripcion}${symbols.space}${button_text.opcional}`}
        style={styleForm.text_input}
        outlineStyle={deleteMode? { borderColor: theme.colors.disabled } : { borderColor: theme.colors.primary }}
      />
  </View>



<View>

<View style={styleForm.rowContainer}>
    <Text style={styleForm.text}>{`${atributos.categoria}${symbols.colon}`}</Text>
    {item.categoria ? (<TextInput style={styleForm.text_input} mode='outlined' disabled>
            {categoriaGastos.find((c) => c.id === item.categoria)  ? categoriaGastos.find((c) => c.id === item.categoria).descripcion  : item.categoria }
        </TextInput>
    ) : (
        <TextInput style={styleForm.text_input} mode='outlined'  disabled>
            {`${button_text.select}${symbols.space}${atributos.tipo_gasto}`}
        </TextInput>
    )}
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
              <Icon.Button name={theme.icons.ok} onPress={() => navigation.navigate('Gastos', { refresh: true })}>{button_text.ok}</Icon.Button>
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
          const response = await fetch(`${PAGINA_URL}${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${item.id}`, {
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
              <Icon.Button name={theme.icons.ok} onPress={() => navigation.navigate(`Gastos`)}>{button_text.ok}</Icon.Button>
            </Dialog.Actions>
      </Dialog>
      </Portal>
    </View>

    <View style={styleForm.rowButton}>
      <View style={styleForm.button}>
      <Icon.Button backgroundColor={theme.colors.cancelar} name={theme.icons.close}  onPress={() => navigation.navigate('Gastos', { refresh: true })}>{button_text.cancel}</Icon.Button>
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