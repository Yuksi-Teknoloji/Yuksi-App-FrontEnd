import React from 'react';
import {Animated, TouchableOpacity, StyleSheet} from 'react-native';

const OutlineSwitch = ({ value, onValueChange }) => {
  const anim = React.useRef(new Animated.Value(value ? 1 : 0)).current;
  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 20] });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange?.(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      style={styles.track}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#FF5B04',
    backgroundColor: 'transparent',
    paddingHorizontal: 2,
    justifyContent: 'center',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF5B04',
    backgroundColor: 'transparent',
  },
});

export default OutlineSwitch;
