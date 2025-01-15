import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { symbols, clasesEntidad, button_text, alerts } from '../../../constants';
import { styleForm, } from '../../styles/styles';
import theme from '../../theme/theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
import { styleEntidades, styleComun, styleLoading, styleBusquedaAvanzada, screenWidth } from '../../styles/styles.js';
import { getEntidades } from './entidadesConfig';
import { useAuth } from '../../helpers/AuthContext';
import useCombinedData from '../../hooks/useCombinedData';
import FaltanDatos from '../Comunes/Dialogs/FaltanDatos.jsx';
import Correcto from '../Comunes/Dialogs/Correcto.jsx';
import Delete from '../Comunes/Dialogs/Delete.jsx';
import SearchDropdown from '../Comunes/Busqueda/SearchDropdown';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const CreacionEntidades = ({ navigation }) => {
  const route = useRoute();
  const { labelHeader, entityType, keyId, modificar, eliminar, routeName } = route.params;
  const { accessToken, refreshToken } = useAuth()
  const [item, setItem] = useState({ activo: true });
  const [itemid, setItemid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(false);
  const [changeItem, setChangeItem] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleOK, setvisibleOK] = useState(false);
  const [visibleDelete, setvisibleDelete] = useState(false);
  const [visibleOKDelete, setvisibleOKDelete] = useState(false);
  const [message, setMessage] = useState([]);
  const { categoria, subcategoria, responsable, moneda, metodopago, submetodopago } = useCombinedData(keyId);
  const [categorias, setCategorias] = React.useState([]);
  const [subcategorias, setSubcategorias] = React.useState([]);
  const [responsables, setResponsables] = React.useState([]);
  const [monedas, setMonedas] = React.useState([]);
  const [metodopagos, setMetodopagos] = React.useState([]);
  const [submetodopagos, setSubmetodopagos] = React.useState([]);

  React.useEffect(() => {
    setCategorias(categoria.map(item => ({ id: item.id_categoria, nombre: item.categoria, activo:item.categoria_activo })));
    setSubcategorias(subcategoria.map(item => ({
      id: item.id_subcategoria,
      nombre: item.subcategoria,
      id_categoria: item.id_categoria,
      id_responsable: item.id_responsable,
      activo:item.subcategoria_activo
    })));
    setResponsables(responsable.map(item => ({ id: item.id_responsable, nombre: item.responsable, activo:item.responsable_activo })));
    setMonedas(moneda.map(item => ({ id: item.id_moneda, nombre: item.codigo_moneda, activo:item.activo })));
    setMetodopagos(metodopago.map(item => ({ id: item.id_metodopago, nombre: item.metodopago, activo:item.activo })));
    setSubmetodopagos(submetodopago.map(item => ({
      id: item.id_submetodo_pago,
      nombre: item.submetodo_pago,
      id_metodopago: item.id_metodopago, activo:item.activo
    })));
  }, [keyId, categoria, subcategoria, responsable, moneda, metodopago, submetodopago]);

  const entidades = useMemo(() => getEntidades({ categorias, subcategorias, responsables, monedas, metodopagos, submetodopagos }), [
    categorias,
    subcategorias,
    responsables,
    monedas,
    metodopagos,
    submetodopagos,
  ]);

  React.useEffect(() => {
    if (item.subcategoria) {
      const selectedSub = subcategorias.find(sub => sub.id === item.subcategoria);
      if (selectedSub) {
        updateItemProperty('categoria', selectedSub.id_categoria);
        updateItemProperty('responsable', selectedSub.id_responsable);
      }
    }
  }, [item.subcategoria]);

  React.useEffect(() => {
    if (item.submetodopago) {
      const selectedSub = submetodopagos.find(sub => sub.id === item.submetodopago);
      if (selectedSub) {
        updateItemProperty('metodopago', selectedSub.id_metodopago);
      }
    }
  }, [item.submetodopago]);


  const handleChange = (field, value) => {
    setItem((prev) => ({ ...prev, [field]: value }))
    setSelectedItem(true);
  };

  const updateItemProperty = (key, value) => {
    setItem(prevItem => ({
      ...prevItem,
      [key]: value,
    }));
    setChangeItem(true);
  };
  const renderEntity = (atributo) => {
    const { key, label, data } = atributo;
    if (key === entityType) {
      return (
        <View key={key}>
          {(modificar || eliminar) &&
            <SearchDropdown
            options={data
              .filter(option => eliminar || option.activo)
              .map(option => option.nombre)}   
              placeholder={label}
              value={data.find(option => option.id === item.categoria)?.nombre}
              onSelect={(selectedName) => {
                const selectedOption = data.find(option => option.nombre === selectedName);
                if (selectedOption) {
                  setItemid(selectedOption.id); 
                  handleChange('nombre', selectedOption.nombre); 
                  handleChange('activo', selectedOption.activo); 
                }
              }}              
              onClear={() => { handleChange(key, null) }}
              filterKey={key}
              setFilter={setItem}
              icon={'tag'}
            />}
          {!eliminar &&
            <TextInput
              mode='outlined'
              value={item.nombre || ''}
              onChangeText={(value) => updateItemProperty('nombre', value)}
              placeholder={`${label}${symbols.space}${button_text.opcional}`}
              style={{
                marginRight: 0,
                width: screenWidth - 40,
                backgroundColor: item[key] ? theme.colors.primary : theme.colors.white,
                height: 38,
                paddingVertical: 10,
                color: theme.colors.white
              }}
              outlineStyle={{ borderColor: eliminar ? theme.colors.disabled : theme.colors.primary, borderRadius: 27 }}
              disabled={eliminar}
              label={label}
              textColor={item[key] ? theme.colors.white : theme.colors.primary}
              outlineColor={item[key] ? theme.colors.white : theme.colors.primary}
              activeOutlineColor={item[key] ? theme.colors.white : theme.colors.primary}
              theme={{ colors: { onSurfaceVariant: item[key] ? theme.colors.white : theme.colors.primary } }}
            />}
        </View>
      );
    }
    return null
  }

  const handleSubmit = async () => {
    if (!changeItem){
     setMessage('No se ingreso ningun valor')
     setVisible(true)
     return
    }
    try {
      const url = `${PAGINA_URL}${symbols.barra}${routeName}${symbols.barra}${keyId}`
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'refresh-token': refreshToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        setMessage(`Se creo correctamente`)
        setvisibleOK(true)
      } else {
        alert("Error al enviar los datos");
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con la API");
    }
  };

  const handleModify = async () => {
    if (!selectedItem && !changeItem) {
      setMessage('No se ingreso ningun valor')
      setVisible(true)
      return;
    }
    try {
      const url = `${PAGINA_URL}${symbols.barra}${routeName}${symbols.barra}${keyId}${symbols.barra}${itemid}`
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'refresh-token': refreshToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        setMessage(`Se Modifico correctamente`)
        setvisibleOK(true)
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
      setMessage('Selecciona un valor')
      setVisible(true)
      return;
    }
    try {
      const url = `${PAGINA_URL}${symbols.barra}${routeName}${symbols.barra}${keyId}${symbols.barra}${itemid}`
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'refresh-token': refreshToken
        },
      });

      if (response.ok) {
        setvisibleDelete(false)
        setMessage(`Se ${item.activo ? 'Archivo' : 'Desarchivo'} correctamente`)
        setvisibleOKDelete(true)
      } else {
        alert('Error al eliminar la entidad');
      }
    } catch (error) {
      console.error(error);
      alert('Error al conectar con la API');
    }
  };

  return (
    <>
      {!loading ? (
        <View style={styleLoading.loadingContainer}>
          <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
          <Text style={styleLoading.loadingText}>{alerts.cargando} datos...</Text>
        </View>
      ) : (
        <>
          {/* Contenido de la lista */}
          <FlatList
            data={entidades}
            renderItem={({ item }) => renderEntity(item)}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={true}
            style={{ flex: 1, margin: 20 }}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handed"
          />
          {/* Vistas modales */}
          <FaltanDatos visible={visible} setVisible={setVisible} message={message} />
          <Correcto visible={visibleOK} setVisible={setvisibleOK} navigation={navigation} goBack={true} message={message}/>
          <Delete
            visible={visibleDelete}
            setVisible={setvisibleDelete}
            handleDelete={handleDelete}
            visibleOk={visibleOKDelete}
            setVisibleOk={setvisibleOKDelete}
            archivar={item.activo}
            navigation={navigation}
            goBack={true}
          />

          {/* Botones de acción */}
          <View style={styleForm.rowButton}>
            <View style={styleForm.button}>
              <Icon.Button backgroundColor={theme.colors.white} color={theme.colors.primary} name={theme.icons.close} onPress={() => navigation.goBack({ refresh: true })}>
                {button_text.cancel}
              </Icon.Button>
            </View>
            {!eliminar && (
              <View style={styleForm.button}>
                <Icon.Button backgroundColor={theme.colors.primary} color={theme.colors.white} name={theme.icons.save} onPress={modificar ?  handleModify :  handleSubmit}>
                  {button_text.sumbit}
                </Icon.Button>
              </View>
            )}
            {eliminar && (
              <View style={styleForm.button}>
                <Icon.Button backgroundColor={theme.colors.primary} color={theme.colors.white} name={theme.icons.borrar} onPress={() => setvisibleDelete(true)}>
                  {item.activo ? button_text.archivar : button_text.desarchivar}
                </Icon.Button>
              </View>
            )}
          </View>
        </>
      )}
    </>

  );
};

export default CreacionEntidades;
