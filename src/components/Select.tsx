import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { tv } from "tailwind-variants";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { cssInterop } from "nativewind";

cssInterop(MCI, {
  className: {
    target: "style",
  },
});

const select = tv({
  slots: {
    trigger: "flex-row items-center justify-between h-12 rounded-md border px-4",
    triggerText: "font-text-md text-text-md",
    dropdown: "absolute bottom-full mb-2 w-full rounded-md border bg-gray-700 border-gray-500 overflow-hidden",
    item: "flex-row items-center gap-3 px-4 py-3",
    avatar: "h-8 w-8 items-center justify-center rounded-full bg-gray-600",
    avatarText: "font-text-xs text-text-xs text-gray-100",
    itemName: "font-label-md text-label-md text-gray-100",
    errorText: "mt-1 font-text-xs text-text-xs text-danger-light",
    chip: "flex-row items-center gap-2 rounded-md bg-gray-600 border border-gray-500 px-3 py-1.5",
    chipText: "font-text-sm text-text-sm text-gray-100",
    chipRemove: "h-4 w-4 items-center justify-center",
  },
  variants: {
    isOpen: {
      true: { trigger: "border-gray-100" },
      false: {},
    },
    hasError: {
      true: { trigger: "border-danger-light" },
      false: { trigger: "border-gray-500" },
    },
    isSelected: {
      true: { item: "bg-gray-600" },
      false: {},
    },
  },
});

export type SelectOption = {
  id: string;
  name: string;
  initials: string;
};

type SelectProps = {
  options: SelectOption[];
  value: SelectOption[];
  onChange: (options: SelectOption[]) => void;
  placeholder?: string;
  error?: string;
};

export function Select({ options, value, onChange, placeholder = "Selecionar", error }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const styles = select({ isOpen, hasError: !!error });

  function handleToggle() {
    setIsOpen((prev) => !prev);
  }

  function handleSelect(option: SelectOption) {
    const exists = value.some((v) => v.id === option.id);
    const newValue = exists ? value.filter((v) => v.id !== option.id) : [...value, option];
    onChange(newValue);
  }

  function handleRemove(option: SelectOption) {
    onChange(value.filter((v) => v.id !== option.id));
    handleToggle();
  }

  function handleBackdropPress() {
    setIsOpen(false);
  }

  const displayText =
    value.length === 0 ? placeholder : value.length === 1 ? value[0].name : `${value.length} selecionados`;

  return (
    <View>
      {isOpen && (
        <>
          <Pressable className="absolute inset-0" onPress={handleBackdropPress} />
          <View className={styles.dropdown()}>
            {options.map((option) => {
              const isSelected = value.some((v) => v.id === option.id);
              const itemStyles = select({ isSelected });

              return (
                <Pressable
                  key={option.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  className={itemStyles.item()}
                  onPress={() => handleSelect(option)}
                >
                  <View className={itemStyles.avatar()}>
                    <Text className={itemStyles.avatarText()}>{option.initials}</Text>
                  </View>
                  <Text className={itemStyles.itemName()}>{option.name}</Text>
                  {isSelected && (
                    <View className="ml-auto">
                      <MCI name="check" size={18} className="color-green-base" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        className={styles.trigger()}
        onPress={handleToggle}
      >
        <Text className={`${styles.triggerText()} ${value.length > 0 ? "text-gray-100" : "text-gray-400"}`}>
          {displayText}
        </Text>
        <MCI name="chevron-down" size={20} className="color-gray-200" />
      </Pressable>

      {value.length > 0 && (
        <View className="mt-5 gap-3">
          {value.map((option) => (
            <View key={option.id} className="flex-row items-center justify-between rounded-md px-4 py-3">
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-gray-600">
                  <Text className="font-text-xs text-text-xs text-gray-100">{option.initials}</Text>
                </View>
                <Text className="font-label-sm text-label-sm text-gray-100">{option.name}</Text>
              </View>
              <Pressable className="p-1" onPress={() => handleRemove(option)}>
                <MCI name="delete-outline" size={18} className="color-danger-light" />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {error ? <Text className={styles.errorText()}>{error}</Text> : null}
    </View>
  );
}
