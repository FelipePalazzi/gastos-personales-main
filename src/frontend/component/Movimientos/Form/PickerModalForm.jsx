import React from 'react';
import { Modal, View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur'; // Asegúrate de tener la librería instalada
import  theme  from '../../theme/theme.js'; // Ajusta según tu archivo de tema
import { styleBusquedaAvanzada } from '../../styles/styles.js';

const PickerModalForm = ({ data, modalVisible, setModalVisible, handleData }) => {

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
              data={data}
              keyExtractor={(item) => item[`id_${data}`]}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    handleData(item[`id_${data}`])
                    setModalVisible(false)
                  }}
                >
                  <Text style={styles.itemText}>
                    item[data]
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

export default PickerModalForm;
