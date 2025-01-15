import React from 'react';
import { Modal, View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur'; // Asegúrate de tener la librería instalada
import  theme  from '../../theme/theme.js'; // Ajusta según tu archivo de tema
import { styleBusquedaAvanzada } from '../../styles/styles.js';

const PickerModal = ({ keys, modalVisible, setModalVisible, handleKeyId }) => {
  const truncateLabel = (nombre, descripcion, maxLength) => {
    const combinedText = `${nombre} - ${descripcion}`;
    return combinedText.length > maxLength ? `${combinedText.substring(0, maxLength)}...` : combinedText;
  };

  return (
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
            <FlatList
              data={keys}
              keyExtractor={(item) => item.id_key.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    handleKeyId(item.id_key); // Set selected key
                    setModalVisible(false); // Close modal after selection
                  }}
                >
                  <Text style={styles.itemText}>
                    {truncateLabel(item.nombre, item.descripcion, 200)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </BlurView>
    </Modal>
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
    color: theme.colors.primary, // Adjust based on your theme
  },
});

export default PickerModal;
