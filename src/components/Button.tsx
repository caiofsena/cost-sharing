import { Pressable, Text, type PressableProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { PlusIcon } from "./icons";

const button = tv({
  slots: {
    base: "flex-row items-center justify-center rounded-full border",
    label: "font-label-sm text-label-sm",
    icon: "",
  },
  variants: {
    intent: {
      primary: {
        base: "border-green-light bg-green-base",
        label: "text-gray-800",
        icon: "bg-gray-800",
      },
      secondary: {
        base: "border-gray-500 bg-gray-500",
        label: "text-gray-200",
        icon: "bg-gray-300",
      },
      danger: {
        base: "border-gray-500 bg-gray-500",
        label: "text-danger-light",
        icon: "bg-danger-light",
      },
      text: {
        base: "border-transparent bg-transparent",
        label: "text-green-base",
        icon: "bg-green-base",
      },
    },
    size: {
      md: {
        base: "h-12 gap-3 px-4",
      },
      icon: {
        base: "h-12 w-12 px-0",
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
    label?: string;
  };

export function Button({
  intent = "primary",
  size = "md",
  label = "Label",
  className,
  disabled,
  ...props
}: ButtonProps) {
  const styles = button({ intent, size });
  const iconColor = styles.icon();
  const isTextOnly = intent === "text";

  return (
    <Pressable
      accessibilityRole="button"
      className={styles.base({
        className: [disabled ? "opacity-50" : "active:opacity-80", className].filter(Boolean).join(" "),
      })}
      disabled={disabled}
      {...props}
    >
      {!isTextOnly && <PlusIcon className={iconColor} />}
      <Text className={styles.label()}>{label}</Text>
    </Pressable>
  );
}
