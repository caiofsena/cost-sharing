import { Text, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

const badge = tv({
  slots: {
    container: "self-start rounded-md px-2 py-1",
    text: "font-text-xs text-text-xs",
  },
  variants: {
    status: {
      pending: {
        container: "bg-danger-low",
        text: "text-danger-light",
      },
      partial: {
        container: "bg-alert-low",
        text: "text-alert-light",
      },
      paid: {
        container: "bg-background-sectionLow",
        text: "text-background-section",
      },
    },
  },
  defaultVariants: {
    status: "pending",
  },
});

const labels = {
  pending: "Pendente",
  partial: "Parcial",
  paid: "Pago",
};

type BadgeVariants = VariantProps<typeof badge>;

type BadgeProps = ViewProps &
  BadgeVariants & {
    label?: string;
  };

export function Badge({ status = "pending", label, className, ...props }: BadgeProps) {
  const styles = badge({ status });

  return (
    <View className={styles.container({ className })} {...props}>
      <Text className={styles.text()}>{label ?? labels[status]}</Text>
    </View>
  );
}
