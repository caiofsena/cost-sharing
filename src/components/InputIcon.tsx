import type { ReactNode } from "react";
import { useState } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { tv } from "tailwind-variants";

const inputIcon = tv({
  slots: {
    container: "flex-row items-center rounded-md border bg-gray-800",
    iconWrapper: "pl-4",
    field: "flex-1 h-12 pr-4 ml-3 font-text-md text-text-md text-gray-100",
    errorText: "mt-1 font-text-xs text-text-xs text-danger-light",
  },
  variants: {
    focused: {
      true: {
        container: "border-gray-100",
      },
      false: {},
    },
    hasError: {
      true: {
        container: "border-danger-light",
      },
      false: {
        container: "border-gray-500",
      },
    },
  },
});

type InputIconProps = TextInputProps & {
  leftIcon: ReactNode;
  error?: string;
};

export function InputIcon({ leftIcon, error, className, ...props }: InputIconProps) {
  const [focused, setFocused] = useState(false);
  const styles = inputIcon({ focused, hasError: !!error });

  return (
    <View>
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
      {error ? <Text className={styles.errorText()}>{error}</Text> : null}
    </View>
  );
}
