import type { ReactNode } from "react";
import { View, type ViewStyle } from "react-native";

type ContainerProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function Container({ children, style }: ContainerProps) {
  return <View style={[{ width: "100%" }, style]}>{children}</View>;
}
