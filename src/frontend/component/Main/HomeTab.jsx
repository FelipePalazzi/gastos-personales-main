import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../../theme/theme.js';
import { View, Text, TouchableOpacity } from 'react-native';
import { styleComun } from '../../styles/styles.js';
import MovimientoList from '../Movimientos/MovimientoList.jsx';
import PickerModal from './PickerModal.jsx';
import CustomTab from './CustomTab';
import LoadingScreen from '../Comunes/Loading/LoadingScreen.jsx';

function HomeTab({ keyId, handleKeyId, keys, nombreKey, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const screens = [
    <MovimientoList keyId={keyId} routeParams={{ tipo: 'salidas' }} />,
    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 300 }}><Text style={{ color: theme.colors.pieInner, fontSize: theme.fontSizes.body, fontWeight: theme.fontWeights.bold }}>Proximamente Resumenes</Text></View>,
    <MovimientoList keyId={keyId} routeParams={{ tipo: 'entradas' }} />,
  ];

  const screenTitles = [
    'Salidas',
    'Resumen',
    'Entradas',
  ];

  const icons = ['trending-down', 'hand-coin', 'trending-up'];

  return (
    keyId && nombreKey && <>
      <View style={{ flexDirection: 'row', backgroundColor: theme.colors.primary, paddingTop: 45, paddingBottom: 8, alignItems: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              marginLeft: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.openDrawer()}
          >
            <Icon name="menu" size={40} color={theme.colors.white} />

          </TouchableOpacity>
        </View>

        <View style={styleComun.keys.container}>
          <TouchableOpacity
            style={styleComun.keys.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styleComun.keys.buttonText}>
              {nombreKey}
            </Text>
            <Icon name="menu-down" size={20} color={theme.colors.white} style={{ marginLeft: 10 }} />
          </TouchableOpacity>

        </View>
      </View>
      {keys && <PickerModal keys={keys} modalVisible={modalVisible} setModalVisible={setModalVisible} handleKeyId={handleKeyId} navigation={navigation} keyId={keyId} nombreKey={nombreKey} />}


      <CustomTab screens={screens} screenTitles={screenTitles} icons={icons} />
    </>
    || <LoadingScreen Nombre={'Datos...'} />
  );
}

export default HomeTab