import { View } from "react-native";

type IconProps = {
  className?: string;
};

export function PlusIcon({ className = "bg-gray-300" }: IconProps) {
  return (
    <View className="h-6 w-6 items-center justify-center">
      <View className={`absolute h-0.5 w-6 rounded-full ${className}`} />
      <View className={`absolute h-6 w-0.5 rounded-full ${className}`} />
    </View>
  );
}

export function ListIcon({ className = "bg-gray-400" }: IconProps) {
  return (
    <View className="h-6 w-6 justify-center gap-1.5">
      {[0, 1, 2].map((item) => (
        <View key={item} className="flex-row items-center gap-1.5">
          <View className={`h-1 w-1 rounded-full ${className}`} />
          <View className={`h-0.5 w-4 rounded-full ${className}`} />
        </View>
      ))}
    </View>
  );
}

export function PieIcon({ className = "border-gray-400 bg-transparent" }: IconProps) {
  const lineClassName = className.includes("green") ? "bg-green-base" : "bg-gray-400";

  return (
    <View className="h-6 w-6 items-center justify-center">
      <View className={`h-6 w-6 rounded-full border-2 ${className}`} />
      <View className={`absolute right-2.5 top-0 h-3 w-0.5 ${lineClassName}`} />
      <View className={`absolute right-0 top-3 h-0.5 w-3 ${lineClassName}`} />
    </View>
  );
}

export function UsersIcon({ className = "border-gray-400" }: IconProps) {
  return (
    <View className="h-6 w-7 items-center justify-center">
      <View className={`absolute left-2 top-1 h-2.5 w-2.5 rounded-full border-2 ${className}`} />
      <View className={`absolute bottom-1 left-1 h-3 w-5 rounded-t-full border-2 ${className}`} />
      <View className={`absolute right-0 top-2 h-2 w-2 rounded-full border-2 ${className}`} />
      <View className={`absolute bottom-1 right-0 h-2.5 w-4 rounded-t-full border-2 ${className}`} />
    </View>
  );
}

export function CalendarIcon({ className = "border-gray-400 bg-gray-400" }: IconProps) {
  return (
    <View className={`h-4 w-4 rounded-sm border ${className}`}>
      <View className="mt-1 h-px w-full bg-gray-400" />
      <View className="absolute left-1 -top-1 h-2 w-px bg-gray-400" />
      <View className="absolute right-1 -top-1 h-2 w-px bg-gray-400" />
    </View>
  );
}

export function CoinIcon({ className = "border-gray-400 text-gray-400" }: IconProps) {
  return (
    <View className={`h-4 w-4 items-center justify-center rounded-full border ${className}`}>
      <View className="h-2 w-px bg-gray-400" />
    </View>
  );
}

export function MailIcon({ className = "bg-gray-400" }: IconProps) {
  return (
    <View className="h-5 w-5 items-center justify-center">
      <View className={`h-3.5 w-5 rounded-sm border ${className}`}>
        <View className={`absolute left-0 top-0 h-0.5 w-2.5 rotate-45 origin-top-left ${className}`} />
        <View className={`absolute right-0 top-0 h-0.5 w-2.5 -rotate-45 origin-top-right ${className}`} />
      </View>
    </View>
  );
}

export function LockIcon({ className = "bg-gray-400" }: IconProps) {
  return (
    <View className="h-5 w-5 items-center justify-center">
      <View className={`absolute -top-1 h-2 w-3 rounded-t-full border-b-0 border-l border-r ${className}`} />
      <View className={`h-3 w-4 rounded-sm border ${className}`} />
      <View className={`absolute h-0.5 w-0.5 rounded-full ${className}`} />
    </View>
  );
}

export function UserIcon({ className = "border-gray-400" }: IconProps) {
  return (
    <View className="h-5 w-5 items-center justify-center">
      <View className={`absolute top-0 h-2 w-2 rounded-full border-2 ${className}`} />
      <View className={`absolute bottom-0 h-2.5 w-4 rounded-t-full border-2 ${className}`} />
    </View>
  );
}
