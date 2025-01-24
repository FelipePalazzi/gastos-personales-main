import { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../../../theme/theme.js';
import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import { styleComun } from '../../../styles/styles.js';
import MovimientoList from '../../Movimientos/MovimientoList.jsx';
import PickerModal from '../../Keys/PickerModal.jsx';
import CustomTab from './CustomTab.jsx';
import { useNavigation, useRoute } from '@react-navigation/native';
import TutorialDialog from '../../Comunes/Dialogs/TutorialDialog.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Resumen from '../../Resumen/Resumen.jsx';

function HomeTab({ keyId, nombreKey, navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tutorialDialog, setTutorialDialog] = useState(false);

  const navigate = useNavigation()

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    });

    return unsubscribe;
  }, [navigation]);

  const screens = [
    <MovimientoList keyId={keyId} routeParams={{ tipo: 'salidas' }} />,
    <Resumen/>,
    <MovimientoList keyId={keyId} routeParams={{ tipo: 'entradas' }} />,
  ];

  const screenTitles = [
    'Salidas',
    'Resumen',
    'Entradas',
  ];
  const icons = ['trending-down', 'hand-coin', 'trending-up'];

  useEffect(() => {
    const checkTutorialStatus = async () => {
      const tutorialStatus = await AsyncStorage.getItem('tutorialShown');
      if (tutorialStatus === 'true') {
        setTutorialDialog(true);
      }
    };
  
    checkTutorialStatus();
  }, []);

  return (
    <>
      <View style={{ flexDirection: 'row', backgroundColor: theme.colors.primary, paddingTop: 45, paddingBottom: 8, alignItems: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              marginLeft: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigate.openDrawer()}
          >
            <Icon name="menu" size={25} color={theme.colors.white}  style={{paddingRight:10}}/>
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
        <View style={{ alignItems: 'center', position:'absolute', right:10, top:38, zIndex:2 }}>
          <TouchableOpacity
            style={{
              marginLeft: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setTutorialDialog(true)}
          >
            <Icon name="information-outline" size={25} color={theme.colors.white} style={{paddingHorizontal:10,paddingVertical:10}}/>
          </TouchableOpacity>
        </View>
      </View>
  
      <PickerModal modalVisible={modalVisible} setModalVisible={setModalVisible} navigation={navigation} />
      <CustomTab screens={screens} screenTitles={screenTitles} icons={icons} />
      <TutorialDialog visible={tutorialDialog} setVisible={setTutorialDialog} />
    </>
  );
}  

export default HomeTab