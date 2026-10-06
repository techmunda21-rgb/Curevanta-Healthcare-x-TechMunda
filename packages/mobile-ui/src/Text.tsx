import { colors, typography, type TypographyRole } from "@curevanta/design-tokens";
import type { ReactNode } from "react";
import {
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from "react-native";

type TextProps = Omit<RNTextProps, "role"> & {
  children: ReactNode;
  variant?: TypographyRole;
  color?: string;
  align?: TextStyle["textAlign"];
};

export function Text({
  children,
  variant = "bodyMedium",
  color = colors.textPrimary,
  align,
  style,
  ...rest
}: TextProps) {
  const token = typography[variant];
  return (
    <RNText
      style={[
        {
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          fontWeight: token.fontWeight,
          color,
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

export function Heading({
  children,
  level = 1,
  ...rest
}: Omit<TextProps, "variant"> & { level?: 1 | 2 | 3 }) {
  const variant: TypographyRole =
    level === 1 ? "heading1" : level === 2 ? "heading2" : "heading3";
  return (
    <Text variant={variant} accessibilityRole="header" {...rest}>
      {children}
    </Text>
  );
}
