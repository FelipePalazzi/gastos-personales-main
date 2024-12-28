import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView} from 'react-native'
import useCategoriaGasto from '../../hooks/useCategoriaGasto'
import useResponsableIngreso from '../../hooks/useResponsableIngreso'
import {Picker} from '@react-native-picker/picker'
import theme from '../../styles/theme'
import { ActivityIndicator ,Dialog, Portal, TextInput,} from 'react-native-paper'
import { alerts,button_text, atributos, symbols,pagina, clasesEntidad } from '../../constants'
import { styleForm } from '../../styles/styles.js'
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const pickerDataHooks = {
    useCategoriaGasto: useCategoriaGasto,
    useResponsableIngreso: useResponsableIngreso,
  };
  
const CreacionEntidades = ({ route, navigation }) => {
    const route = useRoute()
    const { entityType, key_id } = route.params;
    const schema = clasesEntidad[entityType];
    const [formData, setFormData] = useState({ key_id }); 
  
    const pickerData = schema.fields.reduce((acc, field) => {
      if (field.type === "picker" && field.pickerDataHook) {
        const fetchHook = pickerDataHooks[field.pickerDataHook];
        acc[field.name] = fetchHook ? fetchHook() : [];
      }
      return acc;
    }, {});
  
    const handleChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };
  
    const handleSubmit = async () => {
      try {
      const token = await AsyncStorage.getItem('userToken');
        const url = entityType === "keys"
        ? `${PAGINA_URL}${symbols.barra}${entityType}`
        : `${PAGINA_URL}${symbols.barra}${entityType}${symbols.barra}${key_id}`; 
        const response = await fetch(url, {
          method: "POST",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData),
        }) 
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
  
    if (!schema) {
      return <Text>Tipo de entidad no soportado</Text>;
    }
  
    return (
      <View style={styleForm.container}>
        <Text style={styleForm.title}>{schema.title}</Text>
        {schema.fields.map((field) => {
          if (field.type === "picker") {
            const data = pickerData[field.name] || [];
            return (
              <View key={field.name} style={styleForm.picker}>
                <Text style={styleForm.text}>{field.label}</Text>
                <Picker
                  selectedValue={formData[field.name]}
                  onValueChange={(value) => handleChange(field.name, value)}
                  style={styleForm.picker}
                >
                  <Picker.Item label="Seleccione una opción" value="" />
                  {data.map((item) => (
                    <Picker.Item key={item.id} label={item.nombre} value={item.id} />
                  ))}
                </Picker>
              </View>
            );
          }
  
          return (
            <View key={field.name} style={styleForm.container}>
              <Text style={styleForm.text}>{field.label}</Text>
              <TextInput
                style={styleForm.text_input}
                onChangeText={(value) => handleChange(field.name, value)}
                placeholder={field.label}
                keyboardType={field.type === "number" ? "numeric" : "default"}
                multiline={field.type === "textarea"}
              />
            </View>
          );
        })}
        <Button title="Enviar" onPress={handleSubmit} />
      </View>
    );
  };

  export default CreacionEntidades