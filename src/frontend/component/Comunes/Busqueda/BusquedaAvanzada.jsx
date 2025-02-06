import React from 'react';
import { View, Text, Modal, Pressable, ScrollView, KeyboardAvoidingView } from 'react-native';
import theme from '../../../theme/theme.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons.js'
import { BlurView } from '@react-native-community/blur';
import { styleBusquedaAvanzada } from '../../../styles/styles.js';
import SearchDropdown from './SearchDropdown.jsx';
import moment from 'moment'
import 'moment/locale/es'
import DatePickerSearchBar from './DatePickerSearchBar.jsx';
import CurrencyInput from '../CurrencyInput.jsx';
import TextInputCustom from '../TextInputCustom.jsx';

const BusquedaAvanzada = ({ onApplyFilters, atributosSearch, appliedFilters, keyId }) => {
  const [modalVisible, setModalVisible] = React.useState(false);

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

  React.useEffect(() => {
    const fechaDesde = filters['fechaDesde'];
    const fechaHasta = filters['fechaHasta'];

    if (fechaDesde && fechaHasta && moment(fechaDesde).isAfter(moment(fechaHasta))) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        fechaDesde: fechaHasta,
        fechaHasta: fechaDesde,
      }));
    }
  }, [filters['fechaDesde'], filters['fechaHasta']]);

  const renderInput = (atributo) => {
    const { key, label, renderType, data, icon } = atributo;

    switch (renderType) {
      case 'textInput':
        return (
          <TextInputCustom
            key={key}
            label={label}
            placeholder={label}
            value={filters[key]}
            onChangeText={(value) => handleInputChange(key, value)}
            onPressClose={() => handleInputChange(key, '')}
          />
        );
      case 'searchDropdown':
        return (
          <SearchDropdown
            key={key}
            options={data
              .map(option => ({ nombre: option.nombre, activo: option.activo }))}
            placeholder={label}
            onSelect={(value) => handleInputChange(key, value.nombre)}
            value={filters[key]}
            filterKey={key}
            setFilter={setFilters}
            onClear={() => handleInputChange(key, '')}
            icon={icon}
          />
        );
      case 'datePicker':
        return (
          <DatePickerSearchBar
            key={key}
            value={filters[key]}
            onSelect={(date) => {
              handleInputChange(key, moment(date).format('YYYY-MM-DD HH:mm:ss'));
            }}
            onClear={() => handleInputChange(key, '')}
            placeholder={label}
          />
        );
      case 'monedaInput':
        return (
          filters.monedaFiltro && <CurrencyInput
            placeholder={`Ingresar Monto ${filters.monedaFiltro} ${label}...`}
            key={key}
            value={filters[key]}
            onChange={(value) => handleInputChange(key, value)}
            label={`Monto ${filters.monedaFiltro} ${label}`}
            style={{ width: '100%', marginLeft: 0, marginTop: -5, marginBottom: 10 }}
          />
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
          name={'magnify'}
          onPress={() => setModalVisible(true)}
          style={{
            paddingHorizontal: 50,
          }}
          color={theme.colors.primary}
          iconStyle={{ marginRight: 10 }}
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
            <KeyboardAvoidingView
              behavior={'padding'}
              keyboardVerticalOffset={10} // Ajusta según tu diseño
            >
              <View style={styleBusquedaAvanzada.modalContent}>
                <Text style={styleBusquedaAvanzada.title}>Búsqueda Avanzada</Text>
                <ScrollView
                  style={{ flex: 1, marginHorizontal: -10 }}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
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
            </KeyboardAvoidingView>
          </View>
        </BlurView>
      </Modal>
    </>
  );
};

export default BusquedaAvanzada