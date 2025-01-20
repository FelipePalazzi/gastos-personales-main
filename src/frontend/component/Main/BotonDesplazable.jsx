import React, { useEffect, useRef } from 'react';
import { Dimensions, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Easing } from 'react-native';
const { width, height } = Dimensions.get('window');
import theme from '../../theme/theme';

const BotonDesplazable = ({ theme, activeIndex }) => {
  const translateX = useRef(new Animated.Value(width / 2 - 40)).current;

  const icons = ['trending-down', 'poll', 'trending-up'];

  useEffect(() => {
    const targetX = (width / 3) * activeIndex + width / 6 - 40;

    Animated.timing(translateX, {
      toValue: targetX,
      easing: Easing.ease,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [activeIndex]);

  return (
    <Animated.View
      style={[
        styles.buttonContainer,
        {
          transform: [{ translateX }],
          backgroundColor: theme.colors.primary,
          shadowColor: theme.colors.shadow,
        },
      ]}
    >
      <Animated.View>
        <Icon name={icons[activeIndex]} size={40} color={theme.colors.white} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    zIndex: 2,
    position: 'absolute',
    top: height - 80,
    left: 0,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: theme.colors.white,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 8,
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BotonDesplazable;
