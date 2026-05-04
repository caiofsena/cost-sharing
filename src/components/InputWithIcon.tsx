import { useState } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { tv } from "tailwind-variants";

const inputWithIcon = tv({
  slots: {
    container: "flex-row items-center rounded-md border border-gray-500 bg-gray-800",
    iconWrapper: "pl-4",
    field: "flex-1 h-12 pr-4 font-text-md text-text-md text-gray-100",
  },
  variants: {
    focused: {
      true: {
        container: "border-gray-100",
      },
      false: {},
    },
  },
});

type InputWithIconProps = TextInputProps & {
  leftIcon: React.ReactNode;
};

export function InputWithIcon({ leftIcon, className, ...props }: InputWithIconProps) {
  const [focused, setFocused] = useState(false);
  const styles = inputWithIcon({ focused });

  return (
    <View className={styles.container({ className })}>
      <View className={styles.iconWrapper()}>{leftIcon}</View>
      <TextInput
        className={styles.field()}
        placeholderTextColor="#585860"
        onBlur={(event) => {
          setFocused(false);
          props.onBlur?.(event);
        }}
        onFocus={(event) => {
          setFocused(true);
          props.onFocus?.(event);
        }}
        {...props}
      />
    </View>
  );
}
