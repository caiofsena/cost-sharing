import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { cssInterop } from "nativewind";

import { expensesService } from "../services";

cssInterop(MCI, {
  className: {
    target: "style",
  },
});

type CreateExpenseScreenProps = {
  route: {
    params: {
      activityId: string;
    };
  };
  navigation: any;
};

export default function CreateExpenseScreen({ route, navigation }: CreateExpenseScreenProps) {
  const { activityId } = route.params;
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    setError("");

    if (!title.trim()) {
      setError("Informe o nome da despesa");
      return;
    }

    const amountInCents = Math.round(parseFloat(amount.replace(",", ".")) * 100);
    if (!amountInCents || amountInCents <= 0) {
      setError("Informe um valor válido");
      return;
    }

    setLoading(true);

    try {
      await expensesService.create(activityId, {
        title: title.trim(),
        amountInCents,
        participantsIds: [],
      });
      navigation.goBack();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao criar despesa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <View className="flex-row items-center gap-4 border-b border-gray-500 px-6 py-4">
        <Pressable onPress={() => navigation.goBack()} className="p-1">
          <MCI name="arrow-left" size={24} className="color-gray-100" />
        </Pressable>
        <Text className="flex-1 text-center font-heading-lg text-heading-lg text-gray-100">
          Nova Despesa
        </Text>
        <View className="w-8" />
      </View>

      <View className="flex-1 px-6 py-8">
        {error ? (
          <View className="mb-4 rounded-md bg-danger-low p-3">
            <Text className="text-center font-text-sm text-text-sm text-danger-light">
              {error}
            </Text>
          </View>
        ) : null}

        <View className="gap-6">
          <View>
            <Text className="mb-2 font-label-sm text-label-sm text-gray-300">
              Nome da despesa
            </Text>
            <TextInput
              className="h-12 rounded-md border border-gray-500 bg-gray-700 px-4 font-text-md text-text-md text-gray-100"
              placeholder="Ex: Aluguel"
              placeholderTextColor="#585860"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View>
            <Text className="mb-2 font-label-sm text-label-sm text-gray-300">
              Valor total
            </Text>
            <TextInput
              className="h-12 rounded-md border border-gray-500 bg-gray-700 px-4 font-text-md text-text-md text-gray-100"
              placeholder="R$ 0,00"
              placeholderTextColor="#585860"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        <Pressable
          className="mt-8 h-12 items-center justify-center rounded-full bg-green-base border border-green-light active:opacity-80"
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0B0B0E" />
          ) : (
            <Text className="font-label-md text-label-md text-gray-800">
              Criar despesa
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
