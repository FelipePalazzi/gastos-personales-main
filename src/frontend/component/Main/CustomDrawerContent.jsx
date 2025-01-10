import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../../theme/theme.js';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styleLista, styleForm, styleComun, styleDrawer } from '../../styles/styles.js';
import { Picker } from '@react-native-picker/picker'
import Submenu from './Submenu.jsx';

function CustomDrawerContent({ keyId }) {
  const navigation = useNavigation();

  const menuItems = [
    { label: "Categoria", entityType: "categoria" },
    { label: "Tipo de Gasto", entityType: "subcategoria" },
    { label: "Moneda", entityType: "moneda" },
    { label: "Responsable", entityType: "responsable" },
    { label: "Categoria de Entrada y Salida", entityType: "keys" },
  ];

  return (
    <DrawerContentScrollView>
      <View style={styleDrawer.container}>
        <Text style={styleComun.title}>Menu</Text>
      </View>
      <Submenu
        label="Opciones de Creación"
        iconName="add-circle-outline"
        submenutype="crear"
        navigation={navigation}
        keyId={keyId}
        menuItems={menuItems}
      />
      <Submenu
        label="Opciones de Modificación"
        iconName="create-outline"
        submenutype="modificar"
        navigation={navigation}
        keyId={keyId}
        menuItems={menuItems}
      />
      {/*
        <Submenu
          label="Opciones de Eliminación"
          iconName="trash-outline"
          submenutype="eliminar"
          navigation={navigation}
          keyId={keyId}
          menuItems={menuItems}
        />
            */}

      {/* Proximamente agregar usuarios
  <DrawerItem
            label="Agregar Usuario a colaborar"
            onPress={() => navigation.navigate('Login')}
            icon={({}) => <Ionicons name="add" size={theme.fontSizes.body} color={theme.colors.white} />}
            style={{backgroundColor:theme.colors.pieInner, marginTop: 15}}
            labelStyle={{color:theme.colors.white}}
            />
            */}

      <DrawerItem
        label="Volver al Inicio"
        onPress={() => navigation.navigate('Login')}
        icon={({ }) => <Ionicons name="log-out-outline" size={theme.fontSizes.body} color={theme.colors.white} />}
        style={{ backgroundColor: theme.colors.pieInner, marginTop: 10 }}
        labelStyle={{ color: theme.colors.white }}
      />

    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent