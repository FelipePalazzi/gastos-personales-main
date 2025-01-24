import React, { useCallback, useState, useEffect } from 'react';
import { Modal, View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import theme from '../../theme/theme.js';
import { screenWidth, styleBusquedaAvanzada } from '../../styles/styles.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import BusquedaAvanzada from '../Comunes/Busqueda/BusquedaAvanzada.jsx';
import CodigoInvitacion from '../Invitaciones/Dialogs/CodigoInvitacion.jsx';
import { getAtributosSearch } from './searchKeysConfig.js';
import useGetKeys from '../../hooks/useGetKeys.js';
import LoadingDialog from '../Comunes/Loading/LoadingDialog.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PickerModal = ({ modalVisible, setModalVisible, navigation }) => {
  const [visibleCodigo, setVisibleCodigo] = React.useState(false);
  const { getkeys: keys, loading, fetchGetKeys: fetchData } = useGetKeys()
  const [isLoading, setIsLoading] = useState(false);
  const [keyId, setKeyId] = useState(null);
  const [nombreKey, setNombreKey] = useState('Selecciona una Key');

  const handleKeyId = async (itemValue, itemNombre) => {
    setKeyId(itemValue);
    try {
      await AsyncStorage.setItem('keyId', itemValue.toString());
    } catch (error) {
      console.error('Error saving keyId:', error);
    }
    navigation.setParams({ keyId: itemValue, nombreKey: itemNombre });
  };

  useEffect(() => {
    const getKeyId = async () => {
      try {
        const storedKeyId = await AsyncStorage.getItem('keyId');
        if (!keyId && storedKeyId !== null) {
          setKeyId(storedKeyId);
        } else if (!storedKeyId && keys.length > 0) {
          const firstKey = keys[0];
          if (firstKey) {
            setKeyId(firstKey.id_key);
          }
        } else if (!storedKeyId) {
          setNombreKey('Seleccione una Cuenta...');
        }
      } catch (error) {
        console.error('Error fetching keyId:', error);
      }
    };

    getKeyId();
  }, []);

  useEffect(() => {
    if (keyId && keys.length > 0) {
      const key = keys.find((key) => Number(key.id_key) === Number(keyId));
      setNombreKey(key ? key.nombre : 'Key no encontrada. Seleccione otra');
      navigation.setParams({ keyId: keyId, nombreKey: key.nombre, codigo: key.codigo_invitacion});
    }
  }, [keyId, keys]);

  const handleApplyFilters = (filters) => {
    const query = new URLSearchParams({
      ...filters,
      activo: appliedFilters.activo === 'Activo' ? true : appliedFilters.activo === 'Archivado' ? false : null
    }).toString();
    setAppliedFilters(filters);
    setIsLoading(true);
    fetchData(query).finally(() => setIsLoading(false));
  };

  const atributosSearch = getAtributosSearch()

  const [appliedFilters, setAppliedFilters] = useState({ estado: 'Activo', activo: 'Activo' });

  const truncateLabel = (nombre, descripcion, maxLength) => {
    const combinedText = `${nombre} - ${descripcion}`;
    return combinedText.length > maxLength ? `${combinedText.substring(0, maxLength)}...` : combinedText;
  };

  const [codigo, setCodigo] = React.useState(keys.find((key) => Number(key.id_key) === Number(keyId))?.codigo_invitacion || '')

  React.useEffect(() => {
    const selectedKey = keys.find((key) => Number(key.id_key) === Number(keyId));
    setCodigo(selectedKey?.codigo_invitacion || '');
  }, [keyId, keys]);

  const handlePress = () => {
    setVisibleCodigo(false);
    setModalVisible(true);
  };

  return (
    <>
      <CodigoInvitacion visible={visibleCodigo} handlePress={handlePress} codigo={codigo} keyName={nombreKey} />

      {!isLoading ?
        (<Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <BlurView
            style={styleBusquedaAvanzada.blurView}
            blurType="light"
            blurAmount={15}
          >
            <View style={styleBusquedaAvanzada.overlay}>
              <View style={styleBusquedaAvanzada.modalContent}>
                <View style={{backgroundColor:theme.colors.primary, width:'112%', marginStart:-20, marginTop:-20, borderTopLeftRadius:15, borderTopRightRadius:15}}>
                  <View style={{ marginStart:20, marginTop:20, marginBottom: 10, flexDirection: 'row', width: screenWidth, height:40 }}>
                    <Icon.Button
                      backgroundColor={theme.colors.primary}
                      color={theme.colors.white}
                      name={theme.icons.volver}
                      onPress={() => setModalVisible(false)}
                      style={{ paddingHorizontal: 20, height:'100%' }}
                    />
                    <View style={{marginTop:-15, alignContent:'center', width:'55%'}}>
                    <Text style={[styleBusquedaAvanzada.title, { marginBottom: 0, color: theme.colors.white, marginTop: 5 }]}>{`Cuenta Activa: `}</Text>
                    <Text style={[styleBusquedaAvanzada.title, { marginBottom: 0, color: theme.colors.white, fontStyle: 'italic', marginTop: 5 }]}>{`${nombreKey}`}</Text>
                    </View>
                  </View>
                </View>
                <BusquedaAvanzada
                  onApplyFilters={handleApplyFilters}
                  atributosSearch={atributosSearch}
                  appliedFilters={appliedFilters}
                  keyId={keyId}
                />

                <FlatList
                  data={keys}
                  keyExtractor={(item) => item.id_key}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => {
                        handleKeyId(item.id_key, item.nombre);
                      }}
                    >
                      <Text style={styles.itemText}>
                        {truncateLabel(`${item.activo ? '' : '(Archivado) '}${item.nombre}`, item.descripcion, 200)}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                <View style={styleBusquedaAvanzada.buttonRow}>
                  <Icon.Button
                    backgroundColor={theme.colors.white}
                    color={theme.colors.primary}
                    name={'account-plus'}
                    onPress={() => (setModalVisible(false), setVisibleCodigo(true))}
                  >
                    Codigo de Invitacion
                  </Icon.Button>
                  <Icon.Button
                    backgroundColor={theme.colors.primary}
                    color={theme.colors.white}
                    name={theme.icons.options}
                    onPress={() => (setModalVisible(false), navigation.navigate('ABMKeys', {
                      labelHeader: 'Opciones de Cuentas',
                    }))}
                  >
                    Opciones
                  </Icon.Button>
                </View>
              </View>
            </View>
          </BlurView>
        </Modal>)
        : (<LoadingDialog />)}
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray,
  },
  itemText: {
    fontSize: theme.fontSizes.busqueda_avanzada,
    color: theme.colors.primary,
  },
});

export default PickerModal;
