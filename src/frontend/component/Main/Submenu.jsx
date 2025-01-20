import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../../theme/theme';
import { styleForm } from '../../styles/styles';

const Submenu = ({ label, iconName, navigation, keyId, menuItems, }) => {
  const [isSubmenuVisible, setIsSubmenuVisible] = useState(false);

  return (
    <>
      <DrawerItem
        label={label}
        onPress={() => setIsSubmenuVisible(!isSubmenuVisible)}
        icon={() => <Icon name={iconName} size={theme.fontSizes.body} color={theme.colors.white} />}
        style={{ backgroundColor:theme.colors.primary, position: 'relative', zIndex: 1, marginTop: 10, marginBottom: 0, borderRadius: 0 }}
        labelStyle={{ color: theme.colors.white }}
      />
      {isSubmenuVisible && (
        <View
          style={[
            styleForm.container,
            {
              position: 'relative',
              top: -10,
              backgroundColor: theme.colors.white,
              marginLeft: 10,
              paddingVertical: 15,
              marginEnd: 10,
              borderRadius: 10,
            },
          ]}
        >
          <ScrollView>
            {menuItems.map((item) => (
              <DrawerItem
                key={item.entityType}
                onPress={() =>
                  (setIsSubmenuVisible(false), navigation.navigate('AMBEntidades', {
                    labelHeader: item.label,
                    entityType: item.entityType,
                    keyId: keyId,
                    routeName: item.routeName,
                  }))
                }
                icon={() => (
                  <Icon
                    name={'wrench'}
                    size={theme.fontSizes.body}
                    color={theme.colors.primary}
                  />
                )}
                style={{
                  marginTop: 5,
                  marginHorizontal: 5,
                }}
                labelStyle={{
                  color: theme.colors.primary,
                  fontSize: theme.fontSizes.normal,
                  textAlign: 'center',
                }}
                label={() => (
                  <Text
                    style={{
                      color: theme.colors.primary,
                      fontSize: theme.fontSizes.normal,
                      textAlign: 'center',
                    }}
                  >
                    {item.label}
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
