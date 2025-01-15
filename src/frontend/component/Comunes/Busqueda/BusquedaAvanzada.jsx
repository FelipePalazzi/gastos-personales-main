import React from 'react';
import { View, Text, Modal, TextInput, Pressable, ScrollView } from 'react-native';
import theme from '../../../theme/theme.js';
import Icon from 'react-native-vector-icons/FontAwesome'
import { BlurView } from '@react-native-community/blur';
import { styleBusquedaAvanzada, styleComun } from '../../../styles/styles.js';
import SearchDropdown from './SearchDropdown.jsx';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import moment from 'moment'
import 'moment/locale/es'

const BusquedaAvanzada = ({ onApplyFilters, atributosSearch, appliedFilters, keyId }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [datePickerVisible, setDatePickerVisible] = React.useState(false);

  const [filters, setFilters] = React.useState({});

  const handleInputChange = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setModalVisible(false);
  };
  React.useEffect(() => {
    if (keyId && appliedFilters) {
      Object.keys(appliedFilters).forEach((key) => {
        if (appliedFilters[key]) {
          handleInputChange(key, appliedFilters[key]);
        }
      });
    }
  }, [keyId, appliedFilters]);

  const handleClear = () => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      Object.keys(appliedFilters).forEach((key) => {
        newFilters[key] = '';
      });
      onApplyFilters(newFilters);
      return newFilters;
    });
    setModalVisible(false);
  };


  const renderInput = (atributo) => {
    const { key, label, renderType, data } = atributo;

    switch (renderType) {
      case 'textInput':
        return (
          <TextInput
            key={key}
            placeholder={label}
            value={filters[key] || ''}
            onChangeText={(value) => handleInputChange(key, value)}
            style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
          />
        );
      case 'searchDropdown':
        return (
          <SearchDropdown
            key={key}
            options={data}
            placeholder={label}
            onSelect={(value) => handleInputChange(key, value)}
            value={filters[key]}
            filterKey={key}
            setFilter={setFilters}
          />
        );
      case 'datePicker':
        return (
          <View key={key} style={{ marginBottom: 10 }}>
            <Text>{label}</Text>
            <Pressable
              onPress={() => setDatePickerVisible(true)}
              style={{
                padding: 10,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: filters[key] ? '#000' : '#aaa' }}>
                {filters[key] ? moment(filters[key]).format('LL') : 'Seleccionar fecha'}
              </Text>
            </Pressable>
            <DateTimePickerModal
              isVisible={datePickerVisible}
              mode="date"
              onConfirm={(date) => {
                handleInputChange(key, date.toISOString());
                setDatePickerVisible(false);
              }}
              onCancel={() => setDatePickerVisible(false)}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
<View style={styleBusquedaAvanzada.container}>
  <Icon.Button
    backgroundColor={theme.colors.white}
    name={'search'}
    onPress={() => setModalVisible(true)}
    style={{
      paddingHorizontal: 50,
    }}
    color={theme.colors.primary}
    iconStyle={{ marginRight: 10 }} // Ajusta el margen del ícono
  >
    <Text style={{ fontSize: theme.fontSizes.busqueda_avanzada, fontWeight: 'bold', color: theme.colors.primary }}>
      Busqueda Avanzada
    </Text>
  </Icon.Button>
</View>

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
              <Text style={styleBusquedaAvanzada.title}>Búsqueda Avanzada</Text>
                <ScrollView
                style={{flex:1}}
                  contentContainerStyle={styleBusquedaAvanzada.scrollContainer}
                  nestedScrollEnabled={true}
                >
                  {atributosSearch.map((atributo) => renderInput(atributo))}
                </ScrollView>
              <View style={styleBusquedaAvanzada.buttonRow}>
              <Pressable
                style={styleBusquedaAvanzada.applyButton}
                onPress={handleApplyFilters}
              >
                <Text style={styleBusquedaAvanzada.applyButtonText}>Aplicar</Text>
              </Pressable>
              <Pressable
                style={styleBusquedaAvanzada.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styleBusquedaAvanzada.closeButtonText}>Cerrar</Text>
              </Pressable>
              <Pressable
                style={styleBusquedaAvanzada.closeButton}
                onPress={handleClear}
              >
                <Text style={styleBusquedaAvanzada.closeButtonText}>Borrar Filtros</Text>
              </Pressable>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>
    </>
  );
};

export default BusquedaAvanzada