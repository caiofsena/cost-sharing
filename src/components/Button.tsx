import { Pressable, type PressableProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { cssInterop } from "nativewind";

cssInterop(MCI, {
  className: {
    target: "style",
  },
});

const button = tv({
  slots: {
    base: "flex-row items-center justify-center rounded-full border",
  },
  variants: {
    intent: {
      primary: {
        base: "border-green-light bg-green-base",
      },
      secondary: {
        base: "border-gray-500 bg-gray-500",
      },
      danger: {
        base: "border-gray-500 bg-gray-500",
      },
      text: {
        base: "border-transparent bg-transparent",
      },
    },
    size: {
      md: {
        base: "h-12 gap-3 px-4",
      },
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
});

type ButtonVariants = VariantProps<typeof button>;

type ButtonProps = PressableProps &
  ButtonVariants & {
    hasIconLeft?: boolean;
  };

export function Button({
  intent = "primary",
  size = "md",
  hasIconLeft = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const styles = button({ intent, size });

  return (
    <Pressable
      accessibilityRole="button"
      className={styles.base({
        className: [disabled ? "opacity-50" : "active:opacity-80", className].filter(Boolean).join(" "),
      })}
      disabled={disabled}
      {...props}
    >
      {hasIconLeft && <MCI name="plus" size={24} />}
      <>
        {children}
      </>
    </Pressable>
  );
}
