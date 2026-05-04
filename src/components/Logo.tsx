import { Text, View } from "react-native";

export function Logo({ size = "lg" }: { size?: "sm" | "lg" }) {
  const sizes = {
    sm: { icon: "h-8 w-8", text: "text-xl" },
    lg: { icon: "h-14 w-14", text: "text-3xl" },
  };

  const current = sizes[size];

  return (
    <View className="items-center gap-3">
      <View className={`${current.icon} items-center justify-center`}>
        <View className="absolute h-5 w-5 rotate-45 rounded-sm bg-green-base" />
        <View className="absolute h-5 w-5 rotate-45 rounded-sm bg-green-light opacity-60" />
        <View className="absolute h-3 w-3 rotate-45 rounded-sm bg-gray-800" />
      </View>

      <View className="flex-row">
        <Text className={`${current.text} font-heading text-green-base`}>TaskCost</Text>
        <Text className={`${current.text} font-heading text-gray-100`}> Split</Text>
      </View>
    </View>
  );
}
