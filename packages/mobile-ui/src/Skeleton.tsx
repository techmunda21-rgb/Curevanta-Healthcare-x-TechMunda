import { colors, motion, radius } from "@curevanta/design-tokens";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, type ViewStyle } from "react-native";

type SkeletonProps = {
  width?: number | `${number}%`;
  height?: number;
  style?: ViewStyle;
  reduceMotion?: boolean;
};

export function Skeleton({
  width = "100%",
  height = 16,
  style,
  reduceMotion = false,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    if (reduceMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: motion.slow,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: motion.slow,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, reduceMotion]);

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, opacity: reduceMotion ? 0.55 : opacity },
        style,
      ]}
    />
  );
}

export function HomeSkeleton({ reduceMotion }: { reduceMotion?: boolean }) {
  return (
    <View style={{ gap: 16 }}>
      <Skeleton height={28} width="55%" reduceMotion={reduceMotion} />
      <Skeleton height={72} reduceMotion={reduceMotion} />
      <Skeleton height={120} reduceMotion={reduceMotion} />
      <Skeleton height={88} reduceMotion={reduceMotion} />
      <Skeleton height={88} reduceMotion={reduceMotion} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
  },
});
