import { Pressable, Text, View } from "react-native";
import { tv } from "tailwind-variants";

type StatusSelectValue = "pending" | "paid";

type StatusSelectProps = {
  value: StatusSelectValue;
  onChange?: (value: StatusSelectValue) => void;
  className?: string;
};

const option = tv({
  slots: {
    button: "rounded-md px-3 py-1.5",
    label: "font-text-xs text-text-xs",
  },
  variants: {
    status: {
      pending: {},
      paid: {},
    },
    active: {
      true: {},
      false: {
        label: "text-gray-300",
      },
    },
  },
  compoundVariants: [
    {
      status: "pending",
      active: true,
      class: {
        button: "bg-danger-low",
        label: "text-danger-light",
      },
    },
    {
      status: "paid",
      active: true,
      class: {
        button: "bg-background-sectionLow",
        label: "text-background-section",
      },
    },
  ],
});

export function StatusSelect({ value, onChange, className }: StatusSelectProps) {
  return (
    <View className={`self-start flex-row rounded-lg border border-gray-500 bg-gray-700 p-1 ${className ?? ""}`}>
      {[
        ["pending", "Pendente"],
        ["paid", "Pago"],
      ].map(([status, label]) => {
        const styles = option({
          status: status as StatusSelectValue,
          active: value === status,
        });

        return (
          <Pressable
            key={status}
            accessibilityRole="button"
            accessibilityState={{ selected: value === status }}
            className={styles.button()}
            onPress={() => onChange?.(status as StatusSelectValue)}
          >
            <Text className={styles.label()}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
