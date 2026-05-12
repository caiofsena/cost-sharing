import { Pressable, Text, View } from "react-native";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signOut } from "@/store/authSlice";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  function handleSignOut() {
    dispatch(signOut());
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-800 px-6">
      <Text className="font-heading-lg text-heading-lg text-gray-100">Olá, {user?.name || "Usuário"}</Text>
      <Text className="mt-2 font-text-sm text-text-sm text-gray-400">{user?.email}</Text>

      <Pressable
        className="mt-10 h-12 items-center justify-center rounded-full bg-gray-600 border border-gray-500 active:opacity-80 px-8"
        onPress={handleSignOut}
      >
        <Text className="font-label-sm text-label-sm text-danger-light">Sair da conta</Text>
      </Pressable>
    </View>
  );
}
