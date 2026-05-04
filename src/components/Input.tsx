import { useState } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { tv } from "tailwind-variants";

const input = tv({
  slots: {
    field:
      "h-12 rounded-md border border-gray-500 bg-gray-700 px-4 font-text-md text-text-md text-gray-100",
    list: "overflow-hidden rounded-lg border border-gray-500 bg-gray-700 p-4",
    option: "flex-row items-center gap-3 py-2",
    avatar: "h-8 w-8 items-center justify-center rounded-full bg-gray-600",
    initials: "font-text-xs text-text-xs text-gray-100",
    optionText: "font-label-md text-label-md text-gray-100",
  },
  variants: {
    focused: {
      true: {
        field: "border-gray-100",
      },
      false: {},
    },
  },
});

type Suggestion = {
  id: string;
  name: string;
  initials: string;
};

type InputProps = TextInputProps & {
  suggestions?: Suggestion[];
  containerClassName?: string;
};

export function Input({ suggestions, containerClassName, className, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  const styles = input({ focused });

  return (
    <View className={`gap-2 ${containerClassName ?? ""}`}>
      <TextInput
        className={styles.field({ className })}
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

      {suggestions?.length ? (
        <View className={styles.list()}>
          {suggestions.map((suggestion) => (
            <View key={suggestion.id} className={styles.option()}>
              <View className={styles.avatar()}>
                <Text className={styles.initials()}>{suggestion.initials}</Text>
              </View>
              <Text className={styles.optionText()}>{suggestion.name}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
