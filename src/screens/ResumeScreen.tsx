import { View, Text } from "react-native";

export default function ResumeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-gray-800">Resume</Text>
      <Text className="mt-2 text-gray-500">Manage your shared expenses</Text>
    </View>
  );
}
