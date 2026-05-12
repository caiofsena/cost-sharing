import { Text, View, type ViewProps } from "react-native";
import { tv } from "tailwind-variants";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { cssInterop } from "nativewind";

import { Badge } from "./Badge";

cssInterop(MCI, {
  className: {
    target: "style",
  },
});

const card = tv({
  base: "rounded-lg border border-gray-500 bg-gray-700 p-4",
});

type CardProps = ViewProps;

export function Card({ className, ...props }: CardProps) {
  return <View className={card({ className })} {...props} />;
}

type ActivityCardProps = {
  title: string;
  amount: string;
  date: string;
  participants: string;
  expenses: string;
  className?: string;
};

export function ActivityCard({
  title,
  amount,
  date,
  participants,
  expenses,
  className,
}: ActivityCardProps) {
  return (
    <Card className={`gap-4 ${className ?? ""}`}>
      <View className="flex-row items-center justify-between gap-4">
        <Text className="font-label-md text-label-md text-gray-100">{title}</Text>
        <Text className="font-text-sm text-text-sm text-gray-100">{amount}</Text>
      </View>

      <View className="h-px bg-gray-500" />

      <View className="flex-row flex-wrap items-center gap-3">
        <View className="flex-row items-center gap-1">
          <MCI name="calendar-outline" size={20} className="color-gray-400" />
          <Text className="font-text-sm text-text-sm text-gray-400">{date}</Text>
        </View>

        <View className="flex-row items-center gap-1">
          <MCI name="account-group" size={20} className="color-gray-400" />
          <Text className="font-text-sm text-text-sm text-gray-400">{participants}</Text>
        </View>

        <View className="flex-row items-center gap-1">
          <MCI name="currency-usd" size={20} className="color-gray-400" />
          <Text className="font-text-sm text-text-sm text-gray-400">{expenses}</Text>
        </View>
      </View>
    </Card>
  );
}

type ExpenseCardProps = {
  title: string;
  amount: string;
  perPerson: string;
  initials: string[];
  status?: "pending" | "partial" | "paid";
  className?: string;
};

export function ExpenseCard({
  title,
  amount,
  perPerson,
  initials,
  status = "pending",
  className,
}: ExpenseCardProps) {
  return (
    <Card className={`gap-7 ${className ?? ""}`}>
      <View className="flex-row justify-between gap-4">
        <Text className="flex-1 font-label-md text-label-md text-gray-100">{title}</Text>
        <View className="items-end">
          <Text className="font-text-md text-text-md text-gray-100">{amount}</Text>
          <Text className="font-text-xs text-text-xs text-gray-300">{perPerson}</Text>
        </View>
      </View>

      <View className="flex-row items-end justify-between gap-4 border-t border-gray-600 pt-3">
        <AvatarStack initials={initials} size="sm" />
        <Badge status={status} />
      </View>
    </Card>
  );
}

type ParticipantCardProps = {
  name: string;
  description: string;
  initials: string;
  className?: string;
};

export function ParticipantCard({ name, description, initials, className }: ParticipantCardProps) {
  return (
    <Card className={`flex-row items-center gap-4 ${className ?? ""}`}>
      <Avatar initials={initials} size="lg" />
      <View>
        <Text className="font-label-md text-label-md text-gray-100">{name}</Text>
        <Text className="font-text-sm text-text-sm text-gray-400">{description}</Text>
      </View>
    </Card>
  );
}

type AvatarProps = {
  initials: string;
  size?: "sm" | "md" | "lg";
};

function Avatar({ initials, size = "md" }: AvatarProps) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-11 w-11",
  };

  const textSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-label-sm",
  };

  return (
    <View className={`${sizes[size]} items-center justify-center rounded-full bg-gray-600`}>
      <Text className={`${textSizes[size]} font-label-sm text-gray-100`}>{initials}</Text>
    </View>
  );
}

function AvatarStack({ initials, size = "sm" }: { initials: string[]; size?: "sm" | "md" }) {
  return (
    <View className="flex-row">
      {initials.map((item, index) => (
        <View key={`${item}-${index}`} className={index > 0 ? "-ml-1" : ""}>
          <Avatar initials={item} size={size} />
        </View>
      ))}
    </View>
  );
}
