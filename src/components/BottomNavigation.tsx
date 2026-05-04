import { Pressable, Text, View } from "react-native";
import { tv } from "tailwind-variants";

import { ListIcon, PieIcon, UsersIcon } from "./icons";

type BottomNavigationValue = "activities" | "summary" | "participants";

type BottomNavigationItem = {
  value: BottomNavigationValue;
  label: string;
};

type BottomNavigationProps = {
  value: BottomNavigationValue;
  onChange?: (value: BottomNavigationValue) => void;
  items?: BottomNavigationItem[];
  className?: string;
};

const defaultItems: BottomNavigationItem[] = [
  { value: "activities", label: "Atividades" },
  { value: "summary", label: "Resumo" },
  { value: "participants", label: "Participantes" },
];

const item = tv({
  slots: {
    container: "flex-1 items-center justify-center gap-2",
    label: "font-text-sm text-text-sm",
  },
  variants: {
    active: {
      true: {
        label: "text-gray-200",
      },
      false: {
        label: "text-gray-400",
      },
    },
  },
});

function NavigationIcon({ value, active }: { value: BottomNavigationValue; active: boolean }) {
  const activeColor = value === "summary" ? "border-green-base bg-green-base" : "bg-green-base";
  const inactiveColor = value === "summary" ? "border-gray-400 bg-transparent" : "bg-gray-400";

  if (value === "activities") {
    return <ListIcon className={active ? activeColor : inactiveColor} />;
  }

  if (value === "summary") {
    return <PieIcon className={active ? activeColor : inactiveColor} />;
  }

  return <UsersIcon className={active ? "border-green-base" : "border-gray-400"} />;
}

export function BottomNavigation({
  value,
  onChange,
  items = defaultItems,
  className,
}: BottomNavigationProps) {
  return (
    <View className={`h-24 flex-row bg-gray-700 px-6 py-4 ${className ?? ""}`}>
      {items.map((navItem) => {
        const active = navItem.value === value;
        const styles = item({ active });

        return (
          <Pressable
            key={navItem.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            className={styles.container()}
            onPress={() => onChange?.(navItem.value)}
          >
            <NavigationIcon value={navItem.value} active={active} />
            <Text className={styles.label()}>{navItem.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
