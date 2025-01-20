import React, { useCallback } from 'react';
import { Modal, View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import theme from '../../theme/theme.js';
import { screenWidth, styleBusquedaAvanzada } from '../../styles/styles.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import SearchDropdown from '../Comunes/Busqueda/SearchDropdown.jsx';
import CodigoInvitacion from '../Invitaciones/Dialogs/CodigoInvitacion.jsx';

const PickerModal = ({ keys, modalVisible, setModalVisible, handleKeyId, navigation, keyId, nombreKey = 'Cargando...' }) => {
  const [query, setQuery] = React.useState('Activo')
  const [keyQuery, setKeyQuery] = React.useState([])
  const [visibleCodigo, setVisibleCodigo] = React.useState(false);

  const truncateLabel = (nombre, descripcion, maxLength) => {
    const combinedText = `${nombre} - ${descripcion}`;
    return combinedText.length > maxLength ? `${combinedText.substring(0, maxLength)}...` : combinedText;
  };
  React.useEffect(() => {
    const filteredKeys = keys.filter(key => {
      if (query === '') {
        return true;
      }
      return query === 'Activo' ? key.activo === true : key.activo === false;
    });
    setKeyQuery(filteredKeys);
  }, [query, keys]);

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

      <Modal
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
              <View style={{ marginBottom: 10, flexDirection: 'row', width: screenWidth }}>
                <Icon.Button
                  backgroundColor={theme.colors.white}
                  color={theme.colors.primary}
                  name={theme.icons.volver} // Icono de cerrar
                  onPress={() => setModalVisible(false)}
                  style={{ paddingHorizontal: 20 }}
                />
                <Text style={[styleBusquedaAvanzada.title, { marginBottom: 0, color: theme.colors.primary, marginTop:5 }]}>{`Cuenta Activa: `}</Text>
                <Text style={[styleBusquedaAvanzada.title, { marginBottom: 0, color: theme.colors.primary, fontStyle: 'italic' , marginTop:5}]}>{`${nombreKey}`}</Text>
              </View>
              <SearchDropdown
                options={[{ nombre: 'Activo', activo: true }, { nombre: 'Archivado', activo: true }]}
                placeholder={'Estado'}
                onSelect={(value) => {
                  setQuery(value.nombre);
                }}
                value={query}
                onClear={() => {
                  setQuery('');
                }}
              />
              <FlatList
                data={keyQuery}
                keyExtractor={(item) => item.id_key.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                      handleKeyId(item.id_key);
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
                  onPress={() => (setModalVisible(false), navigation.navigate('AMBKeys', {
                    labelHeader: 'Creacion de nueva cuenta',
                  }))}
                >
                  Opciones
                </Icon.Button>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>

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
