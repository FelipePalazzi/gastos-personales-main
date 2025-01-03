import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import useCategoriaGasto from '../../../hooks/useCategoriaGasto';
import useResponsableIngreso from '../../../hooks/useResponsableIngreso';
import { symbols, clasesEntidad, button_text } from '../../../constants';
import { styleForm, } from '../../styles/styles';
import theme from '../../theme/theme'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Picker } from '@react-native-picker/picker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
import useTipoGasto from '../../../hooks/useTipoGasto';
import useMonedaIngreso from '../../../hooks/useMonedaIngreso';
import useGetKeys from '../../../hooks/useGetKeys.js';
import {styleEntidades} from '../../styles/styles.js';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const pickerDataHooks = {
  useCategoriaGasto: useCategoriaGasto,
  useResponsableIngreso: useResponsableIngreso,
};

const pickerDataModifyDelete = {
  categoriagasto: useCategoriaGasto,
  responsableIngreso: useResponsableIngreso,
  tipogasto: useTipoGasto,
  monedaingreso: useMonedaIngreso,
  getkeys: useGetKeys,
};

const CreacionEntidades = ({ navigation }) => {
  const route = useRoute();
  const { labelHeader, entityType, keyid, modificar, eliminar } = route.params;
  const schema = clasesEntidad[entityType];
  const [formData, setFormData] = useState({ keyid });
  const [pickerData, setPickerData] = useState({});
  const [pickerDataModifyDeleteState, setPickerDataModifyDeleteState] = useState({});
  const [loading, setLoading] = useState(true);
  const { categoriaGastos } = useCategoriaGasto(keyid);
  const { responsableIngresos } = useResponsableIngreso(keyid);
  const { tipogastos } = useTipoGasto(keyid);
  const { monedaIngresos } = useMonedaIngreso(keyid);
  const { getkeys, loadings, fetchGetKeys } = useGetKeys();
  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {
    const loadKeys = async () => {
      await fetchGetKeys();
    };
    loadKeys();
  }, []);

  useEffect(() => {
    if (getkeys.length > 0) {
      const newPickerData = { ...pickerDataModifyDelete };
      newPickerData['keys'] = getkeys;
      setPickerDataModifyDeleteState(newPickerData);
    }
  }, [getkeys]);

  useEffect(() => {
    const fetchPickerData = async () => {
      const newPickerData = {};

      for (const field of schema.fields) {
        if (field.type === "picker" && field.pickerDataHook) {
          const fetchHook = pickerDataHooks[field.pickerDataHook];
          if (fetchHook) {
            try {
              if (field.pickerDataHook === "useCategoriaGasto") {
                newPickerData[field.name] = categoriaGastos;
              } else if (field.pickerDataHook === "useResponsableIngreso") {
                newPickerData[field.name] = responsableIngresos;
              } else if (field.pickerDataHook === "useTipoGasto") {
                newPickerData[field.name] = tipogastos;
              } else if (field.pickerDataHook === "useMonedaIngreso") {
                newPickerData[field.name] = monedaIngresos;
              } else if (field.pickerDataHook === "useGetKeys") {
                newPickerData[field.name] = getkeys;
              }
            } catch (error) {
              console.error(`Error en fetchHook para ${field.name}:`, error);
              newPickerData[field.name] = [];
            }
          }
        }
      }

      setPickerData(newPickerData);

      if (modificar || eliminar) {
        const newPickerModifyDelete = {};
        try {
          if (entityType === "categoriagasto") {
            newPickerModifyDelete["categoriagasto"] = categoriaGastos;
          } else if (entityType === "responsableIngreso") {
            newPickerModifyDelete["responsableIngreso"] = responsableIngresos;
          } else if (entityType === "tipogasto") {
            newPickerModifyDelete["tipogasto"] = tipogastos;
          } else if (entityType === "monedaingreso") {
            newPickerModifyDelete["monedaingreso"] = monedaIngresos;
          } else if (entityType === "keys") {
            newPickerModifyDelete["keys"] = getkeys;
          } else {
          }
        } catch (error) {
          console.error(`Error en fetchHook para ${field.name}:`, error);
          newPickerModifyDelete[field.name] = [];
        }
        setPickerDataModifyDeleteState(newPickerModifyDelete);

      }

      setLoading(false);
    };

    fetchPickerData();

  }, [
    categoriaGastos,
    responsableIngresos,
    tipogastos,
    monedaIngresos,
    getkeys,
    schema.fields,
    keyid,
    modificar,
    eliminar,
    entityType
  ]);

  useEffect(() => {
    if (pickerDataModifyDeleteState?.keys && pickerDataModifyDeleteState.keys.length > 0) {
      setSelectedItem(pickerDataModifyDeleteState.keys[0].key_id);
    }
  }, [pickerDataModifyDeleteState]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = entityType === "keys"
        ? `${PAGINA_URL}${symbols.barra}${entityType}`
        : `${PAGINA_URL}${symbols.barra}${entityType}${symbols.barra}${keyid}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Datos enviados correctamente");
        navigation.goBack();
      } else {
        alert("Error al enviar los datos");
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con la API");
    }
  };

  const handleModify = async () => {
    if (!selectedItem) {
      alert('Por favor, selecciona un elemento.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = entityType === "keys"
        ? `${PAGINA_URL}${symbols.barra}${entityType}`
        : `${PAGINA_URL}${symbols.barra}${entityType}${symbols.barra}${keyid}${symbols.barra}${selectedItem}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });

      if (response.ok) {
        alert('Entidad modificada correctamente');
        navigation.goBack();
      } else {
        alert('Error al modificar la entidad');
      }
    } catch (error) {
      console.error(error);
      alert('Error al conectar con la API');
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) {
      alert('Por favor, selecciona un elemento.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = entityType === "keys"
        ? `${PAGINA_URL}${symbols.barra}${entityType}`
        : `${PAGINA_URL}${symbols.barra}${entityType}${symbols.barra}${keyid}${symbols.barra}${selectedItem}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (response.ok) {
        alert('Entidad eliminada correctamente');
        navigation.goBack();
      } else {
        alert('Error al eliminar la entidad');
      }
    } catch (error) {
      console.error(error);
      alert('Error al conectar con la API');
    }
  };



  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!schema) {
    return <Text>Tipo de entidad no soportado</Text>;
  }

  return (
    <View style={styleEntidades.scroll}>
      <View style={[styleEntidades.backgroundContainer, {marginTop:10}]}>
        {(modificar || eliminar) && (
          <View style={styleEntidades.container}>
            <View style={styleEntidades.rowContainer}>
              <Text style={styleEntidades.text}>{modificar && "Elemento a modificar" || "Elemento a eliminar"}</Text>
              <Picker
                selectedValue={selectedItem}
                onValueChange={(value) => setSelectedItem(value)}
                style={styleEntidades.picker}
                mode={theme.picker.modo}
                dropdownIconColor={theme.colors.textSecondary}
              >
                {Object.keys(pickerDataModifyDeleteState).map((key) => {
                  const items = pickerDataModifyDeleteState[key];
                  if (Array.isArray(items) && items.length > 0) {
                    return items.map((item) => (
                      <Picker.Item
                        key={item.id || item.key_id}
                        label={item.Nombre || item.descripcion || item.nombre}
                        value={item.id || item.key_id}
                      />
                    ));
                  }
                  return null; 
                })}
              </Picker>
            </View>
            {entityType === 'keys' && selectedItem && (
              <View style={styleEntidades.rowContainer} >
                <Text style={styleEntidades.text}>{modificar && "Descripcion a modificar" || "Descripcion a eliminar"}</Text>
                <TextInput
                  mode='outlined'
                  disabled
                  style={styleEntidades.text_input_wide}
                  value={pickerDataModifyDeleteState.keys.find(item => item.key_id === selectedItem).Descripcion || ''}
                  outlineStyle={{ borderColor: theme.colors.primary }}
                  multiline
                />
              </View>
            )}
          </View>
        )}
        {!eliminar &&
          schema.fields.map((field) => {
            if (field.type === "picker") {
              return (
                <View style={styleEntidades.rowContainer} key={field.name}>
                  <Text style={styleEntidades.text}>{field.label}</Text>
                  <Picker
                    selectedValue={formData[field.name]}
                    onValueChange={(value) => handleChange(field.name, value)}
                    style={styleEntidades.picker}
                    mode={theme.picker.modo}
                    dropdownIconColor={theme.colors.textSecondary}
                  >
                    {pickerData[field.name]?.map((item) => (
                      <Picker.Item 
                      key={item.id}
                      label={field.pickerDataHook === 'useCategoriaGasto' ? item.descripcion : item.nombre}
                      value={item.id} />
                    ))}
                  </Picker>
                </View>
              );
            }
            return (
              <View style={styleEntidades.rowContainer} key={field.name}>
                <Text style={styleEntidades.text}>{field.label}</Text>
                <TextInput
                  mode={theme.text_input}
                  onChangeText={(value) => handleChange(field.name, value)}
                  placeholder={field.label}
                  style={styleEntidades.text_input_wide}
                  keyboardType={field.type === "number" ? "numeric" : "default"}
                  multiline={field.type === "textarea"}
                  outlineStyle={{ borderColor: theme.colors.primary }}
                />
              </View>
            );
          })}
      </View>
      <View style={styleEntidades.button}>
        {!modificar && !eliminar && (
          <Icon.Button
            backgroundColor={theme.colors.agregar}
            name={theme.icons.save}
            onPress={handleSubmit}
          >
            {button_text.sumbit}
          </Icon.Button>
        )}
        {modificar && (
          <Icon.Button
            backgroundColor={theme.colors.agregar}
            name={theme.icons.save}
            onPress={handleModify}
          >
            Modificar
          </Icon.Button>
        )}
        {eliminar && (
          <Icon.Button
            backgroundColor={theme.colors.delete}
            name={theme.icons.borrar}
            onPress={handleDelete}
          >
            Eliminar
          </Icon.Button>
        )}
      </View>
    </View>
  );
};

export default CreacionEntidades;
