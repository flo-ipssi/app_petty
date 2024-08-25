import { FontAwesome } from '@expo/vector-icons';
import React, { FC, useCallback, useRef } from 'react';
import { Animated, StyleSheet, TouchableWithoutFeedback } from 'react-native';

interface Props {
  name: any,
  size: any,
  color: string,
  style?: any,
  onPress?(): any
}

const SwipeButton: FC<Props> = ({ name, size, color, style, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current

  const animateScale = useCallback((newValue: any) => {
    Animated.spring(scale, {
      toValue: newValue,
      friction: 4,
      useNativeDriver: true,
    }).start()
  }, [scale])

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={() => animateScale(0.6)}
      onPressOut={() => {
        animateScale(1)
      }}
      delayPressIn={0}
      delayPressOut={100}
    >
      <Animated.View style={[styles.container, {
        borderColor: color,
        transform: [{ scale }], ...style
      }]}>
        <FontAwesome name={name} size={size} color={color} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
    marginHorizontal: 15
  },
});

export default SwipeButton;
