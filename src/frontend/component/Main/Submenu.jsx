import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme/theme';
import { styleForm } from '../styles/styles';

const Submenu = ({ label, iconName, submenutype, navigation, keyId, menuItems,}) => {
  const [isSubmenuVisible, setIsSubmenuVisible] = useState(false);

  const getActionFlags = () => {
    switch (submenutype) {
      case 'crear':
        return { modificar: false, eliminar: false };
      case 'modificar':
        return { modificar: true, eliminar: false };
      case 'eliminar':
        return { modificar: false, eliminar: true };
      default:
        return { modificar: false, eliminar: false };
    }
  };

  const getLabelForItem = (submenutype, label) => {
    switch (submenutype) {
      case 'crear':
        return `Crear ${label}`;
      case 'modificar':
        return `Modificar ${label}`;
      case 'eliminar':
        return `Eliminar ${label}`;
      default:
        return label;
    }
  };

  const { modificar, eliminar } = getActionFlags();

  return (
    <>
      <DrawerItem
        label={label}
        onPress={() => setIsSubmenuVisible(!isSubmenuVisible)}
        icon={() => <Ionicons name={iconName} size={theme.fontSizes.body} color={theme.colors.white} />}
        style={{backgroundColor: theme.colors.pieInner, position: 'relative', zIndex: 1, marginTop: 10, marginBottom: 0,}}
        labelStyle={{ color: theme.colors.white }}
      />
      {isSubmenuVisible && (
        <View
          style={[
            styleForm.container,
            {
              position: 'relative',
              top: -10,
              backgroundColor: theme.colors.pieBackground,
              marginLeft: 10,
              paddingVertical: 15,
              marginEnd: 10,
            },
          ]}
        >
          <ScrollView>
            {menuItems.map((item) => (
              <DrawerItem
                key={item.entityType}
                onPress={() =>
                  navigation.navigate('CreacionEntidades', {
                    labelHeader:getLabelForItem(submenutype, item.label),
                    entityType: item.entityType,
                    keyid: keyId,
                    modificar: modificar,
                    eliminar: eliminar,
                  })
                }
                icon={() => (
                  <Ionicons
                    name={submenutype === 'crear' ? 'add' : submenutype === 'modificar' ? 'create' : 'trash'}
                    size={theme.fontSizes.body}
                    color={theme.colors.white}
                  />
                )}
                style={{
                  backgroundColor: theme.colors.pieInner,
                  marginTop: 5,
                  marginHorizontal: 5,
                }}
                labelStyle={{
                  color: theme.colors.white,
                  fontSize: theme.fontSizes.normal,
                  textAlign: 'center',
                }}
                label={() => (
                  <Text
                    style={{
                      color: theme.colors.white,
                      fontSize: theme.fontSizes.normal,
                      textAlign: 'center',
                    }}
                  >
                    {getLabelForItem(submenutype, item.label)}
                  </Text>
                )}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default Submenu;
