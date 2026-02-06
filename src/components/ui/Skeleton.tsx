import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

export type SkeletonProps = {
  width?: number | `${number}%` | "auto";
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  baseColor?: string;
  minOpacity?: number;
  maxOpacity?: number;
  durationMs?: number;
};

export default function Skeleton({
  width = "100%",
  height = 12,
  radius = 12,
  style,
  baseColor = "rgba(255,255,255,0.14)",
  minOpacity = 0.35,
  maxOpacity = 0.85,
  durationMs = 900,
}: SkeletonProps): React.JSX.Element {
  const resolvedWidth = width as number | `${number}%` | "auto";
  const opacity = useRef(new Animated.Value(minOpacity)).current;

  const anim = useMemo(
    () =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: maxOpacity,
            duration: durationMs,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: minOpacity,
            duration: durationMs,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ),
    [durationMs, maxOpacity, minOpacity, opacity],
  );

  useEffect(() => {
    anim.start();
    return () => {
      anim.stop();
    };
  }, [anim]);

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width: resolvedWidth,
          height,
          borderRadius: radius,
          backgroundColor: baseColor,
          opacity,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
});
