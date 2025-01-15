import React, { useEffect, useRef } from 'react';
import { Dimensions, Animated, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Easing } from 'react-native';
const { width, height } = Dimensions.get('window');

const BotonDesplazable = ({ theme, activeIndex }) => {
  // Animaciones para posición y escala del ícono
  const translateX = useRef(new Animated.Value(width / 2 - 40)).current; // Inicia en el centro

  // Íconos según el índice
  const icons = ['trending-down-outline', 'stats-chart', 'trending-up-outline'];

  useEffect(() => {
    // Calcular posición destino
    const targetX = (width / 3) * activeIndex + width / 6 - 40; // Ajuste dinámico

    // Animar movimiento del botón
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
      {/* Icono con animación de escala */}
      <Animated.View>
        <Ionicons name={icons[activeIndex]} size={40} color={theme.colors.white} />
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
    borderColor: '#fff',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 8,
    height: 80,
    width: 80,
    justifyContent: 'center', // Centrar contenido verticalmente
    alignItems: 'center', // Centrar contenido horizontalmente
  },
});

export default BotonDesplazable;
