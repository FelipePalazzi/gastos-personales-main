import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../../theme/theme.js';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styleLista, styleForm } from '../../styles/styles.js';
import { Picker } from '@react-native-picker/picker'
import Submenu from './Submenu.jsx';

function CustomDrawerContent({ keyId, setKeyId, keys }) {
    const navigation = useNavigation();
  
    const handleKeyId = (itemValue) => {
      setKeyId(itemValue); // Establece keyId en el estado
      navigation.setParams({ keyId: itemValue }); // Asegúrate de que se actualice el parámetro
    };
    const truncateLabel = (name, description, maxLength) => {
      const combined = `${name} - ${description}`;
      if (combined.length > maxLength) {
        return `${combined.slice(0, maxLength - 3)}...`; // Resta 3 para el ellipsis
      }
      return combined;
    };
  
    const menuItems = [
      { label: "Categoria", entityType: "categoriagasto" },
      { label: "Tipo de Gasto", entityType: "tipogasto" },
      { label: "Moneda", entityType: "monedaingreso" },
      { label: "Responsable", entityType: "responsableIngreso" },
      { label: "Categoria de Entrada y Salida", entityType: "keys" },
    ];
  
    return (
      <DrawerContentScrollView>
        <View
          style={[
            styleLista.button,
            {
              marginBottom: 0,
              backgroundColor: theme.colors.pieInner,
              paddingVertical: 26,
              marginTop: 5,
            },
          ]}
        >
          <Text style={[styleLista.textTitleTable, { color: theme.colors.white, fontSize: 20 }]}>
            Menu
          </Text>
        </View>
        <View
          style={{
            marginBottom: 0,
            backgroundColor: theme.colors.pieBackground,
            paddingVertical: 20,
            marginTop: 0,
            paddingBottom: 25,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={[styleLista.textTitleTable, { color: theme.colors.white, fontSize: 20, marginBottom: 10 }]}>
            Categoria de Entradas y Salidas:
          </Text>
          <Picker
            selectedValue={keyId}
            onValueChange={handleKeyId}
            style={[styleForm.picker, { marginLeft: 15, backgroundColor: theme.colors.card }]}
            mode={'dropdown'}
            dropdownIconColor={theme.colors.textSecondary}
            numberOfLines={2}
          >
            {keys.map((key, index) => (
              <Picker.Item
                key={key.id_key} // Usa key_id como clave
                label={truncateLabel(key.nombre, key.descripcion, 200)} // Muestra el nombre y la descripción
                value={key.id_key} // Usa key_id como valor
                style={{
                  backgroundColor: theme.colors.card,
                  color: index % 2 === 0 ? theme.colors.pieBackground : theme.colors.pieInner // Alterna entre primary y secondary
                }}
              />
            ))}
          </Picker>
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