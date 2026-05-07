import { useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchGlobalBalance, fetchDetailedBalance } from "../store/balanceSlice";

export default function ResumeScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { globalBalance, detailedBalance, loading } = useAppSelector((state) => state.balance);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchGlobalBalance(user.id));
      dispatch(fetchDetailedBalance(user.id));
    }
  }, [dispatch, user?.id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-800">
        <ActivityIndicator size="large" color="#30A65D" />
      </SafeAreaView>
    );
  }

  const globalNet = (globalBalance?.globalNetBalanceInCents ?? 0) / 100;
  const globalFormatted = globalNet.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const totalOwes = (detailedBalance?.totalUserOwesInCents ?? 0) / 100;
  const totalOwed = (detailedBalance?.totalOwedToUserInCents ?? 0) / 100;

  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <View className="px-6 pt-4 pb-4">
        <Text className="font-heading-lg text-heading-lg text-gray-100">
          Resumo
        </Text>
        <Text className="font-text-sm text-text-sm text-gray-400">
          Visão geral das suas finanças
        </Text>
      </View>

      <View className="mx-6 mb-6 rounded-2xl bg-gray-700 border border-gray-500 p-6">
        <Text className="font-label-sm text-label-sm text-gray-400">
          Saldo global
        </Text>
        <Text
          className={`mt-2 font-heading-xl text-heading-xl ${globalNet >= 0 ? "text-green-base" : "text-danger-light"}`}
        >
          {globalNet >= 0 ? "+" : ""}
          {globalFormatted}
        </Text>
      </View>

      <View className="flex-row gap-4 px-6 mb-6">
        <View className="flex-1 rounded-xl bg-gray-700 border border-gray-500 p-4">
          <Text className="font-label-xs text-label-xs text-gray-400">
            Você deve
          </Text>
          <Text className="mt-1 font-label-md text-label-md text-danger-light">
            {totalOwes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </Text>
        </View>
        <View className="flex-1 rounded-xl bg-gray-700 border border-gray-500 p-4">
          <Text className="font-label-xs text-label-xs text-gray-400">
            Devem a você
          </Text>
          <Text className="mt-1 font-label-md text-label-md text-green-base">
            {totalOwed.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </Text>
        </View>
      </View>

      {detailedBalance && (detailedBalance.debts.length > 0 || detailedBalance.credits.length > 0) ? (
        <View className="flex-1 px-6">
          <Text className="mb-3 font-label-md text-label-md text-gray-300">
            Detalhes
          </Text>
          <FlatList
            data={[
              ...detailedBalance.debts.map((d) => ({ ...d, type: "debt" as const })),
              ...detailedBalance.credits.map((c) => ({ ...c, type: "credit" as const })),
            ]}
            keyExtractor={(item, idx) => `${item.type}-${item.activityId}-${item.expenseId}-${idx}`}
            renderItem={({ item }) => (
              <View className="mb-3 rounded-xl bg-gray-700 border border-gray-500 p-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-label-sm text-label-sm text-gray-100">
                      {item.type === "debt" ? "Você deve para" : "Deve para você"}{" "}
                      {item.type === "debt" ? item.creditorName : item.debtorName}
                    </Text>
                    <Text className="font-text-xs text-text-xs text-gray-400">
                      {item.activityName}
                    </Text>
                  </View>
                  <Text
                    className={`font-label-md text-label-md ${item.type === "debt" ? "text-danger-light" : "text-green-base"}`}
                  >
                    {(item.amountInCents / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center font-label-md text-label-md text-gray-400">
            Nenhuma transação registrada
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
