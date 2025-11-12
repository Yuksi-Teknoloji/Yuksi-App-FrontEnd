import React from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';

const BLUR_OFFSETS = [
  {x: 0, y: 0, a: 0.20},
  {x: 1, y: 0, a: 0.16},
  {x: -1, y: 0, a: 0.16},
  {x: 0, y: 1, a: 0.16},
  {x: 0, y: -1, a: 0.16},
  {x: 1, y: 1, a: 0.12},
  {x: -1, y: -1, a: 0.12},
];

const VehicleSlideItemBase = ({item, blurOpacity, showBlur}) => {
  const {IconComponent} = item;
  return (
    <View style={styles.iconWrapper}>
      <View style={styles.imageBox}>
        {/* Sharp icon layer (fades out as blur increases) */}
        <Animated.View style={{opacity: blurOpacity ? Animated.subtract(1, blurOpacity) : 1}}>
          <IconComponent width={320} height={250} />
        </Animated.View>

        {/* Faux blur layer: stack multiple slightly offset copies of the same SVG */}
        {showBlur && blurOpacity ? (
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, {opacity: blurOpacity}]}> 
            {BLUR_OFFSETS.map((o, idx) => (
              <View key={idx} style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', opacity: o.a}}>
                <View style={{transform: [{translateX: o.x}, {translateY: o.y}]}}>
                  <IconComponent width={320} height={250} />
                </View>
              </View>
            ))}
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
};

const VehicleSlideItem = React.memo(VehicleSlideItemBase, (prev, next) => {
  return (
    prev.item?.id === next.item?.id &&
    prev.showBlur === next.showBlur &&
    prev.blurOpacity === next.blurOpacity
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
  },
  iconWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  imageBox: {
    width: 320,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'Urbanist',
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#374151',
    fontFamily: 'Urbanist',
    lineHeight: 20,
  },
});

export default VehicleSlideItem;
