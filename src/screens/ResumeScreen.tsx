import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../assets/logo.svg";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { cssInterop } from "nativewind";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUserStatistics } from "../store/balanceSlice";
import { Button, CreateActivityModal } from '../components';

cssInterop(MCI, {
  className: {
    target: "style",
  },
});

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-gray-700">
        <MCI name="clipboard-text-outline" size={48} className="color-gray-400" />
      </View>
      <Text className="mb-6 text-center font-label-md text-label-md text-gray-300">
        Você ainda não tem atividades criadas
      </Text>
      <Button onPress={onCreate} hasIconLeft>
        <Text className="font-label-sm text-label-sm text-gray-800">Criar atividade</Text>
      </Button>
    </View>
  );
}

export default function ResumeScreen() {
  const dispatch = useAppDispatch();
  const { statistics, loading } = useAppSelector((state) => state.balance);
  const { user } = useAppSelector((state) => state.auth);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchUserStatistics());
  }, [dispatch]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-800">
        <ActivityIndicator size="large" color="#30A65D" />
      </SafeAreaView>
    );
  }

  const paidAmount = (statistics?.amountPaidInCents ?? 0) / 100;
  const pendingAmount = (statistics?.amountToPayInCents ?? 0) / 100;
  const totalAmount = (statistics?.totalExpensesAmountInCents ?? 0) / 100;

  const paidFormatted = paidAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const pendingFormatted = pendingAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const totalFormatted = totalAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const paidCount = statistics?.paidExpensesCount ?? 0;
  const pendingCount = statistics?.expensesToPayCount ?? 0;
  const activitiesCount = statistics?.activitiesCount ?? 0;
  const expensesCount = statistics?.expensesCount ?? 0;
  const participantsCount = statistics?.uniqueParticipantsCount ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <View className="px-6 pt-4 pb-6">
        <View className="flex-row items-center mb-4">
          <Logo width={17} height={17} />
          <Text className="font-heading-lg text-green-base ml-2">Cost</Text>
          <Text className="font-heading-sm text-green-light">Sharing</Text>
        </View>
        <Text className="font-heading-lg text-heading-lg text-gray-100">
          Resumo
        </Text>
        <Text className="mt-1 font-text-sm text-text-sm text-gray-300">
          Acompanhe as informações principais sobre suas atividades
        </Text>
      </View>
      <View className='flex-1'>
        {activitiesCount === 0 ? (
          <EmptyState onCreate={() => setModalVisible(true)} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-6 pb-8">
            <Text className="font-label-md text-label-md text-gray-100 mb-3">
              Minhas contas
            </Text>
            <View className="rounded-2xl bg-gray-800 border border-gray-600 p-5 mb-3 flex-row items-center gap-4">
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-green-900">
                <MCI name="check" size={24} className="color-green-base" />
              </View>
              <View className="flex-1">
                <Text className="font-heading-lg text-heading-lg text-gray-100">
                  {paidFormatted}
                </Text>
                <Text className="font-text-sm text-text-sm text-gray-400">
                  Pago em {paidCount} {paidCount === 1 ? "despesa" : "despesas"}
                </Text>
              </View>
            </View>

            <View className="rounded-2xl bg-gray-800 border border-gray-600 p-5 mb-6 flex-row items-center gap-4">
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-danger-low">
                <MCI name="alert-octagon-outline" size={24} className="color-danger-light" />
              </View>
              <View className="flex-1">
                <Text className="font-heading-lg text-heading-lg text-gray-100">
                  {pendingFormatted}
                </Text>
                <Text className="font-text-sm text-text-sm text-gray-400">
                  Pendente em {pendingCount} {pendingCount === 1 ? "despesa" : "despesas"}
                </Text>
              </View>
            </View>

            <Text className="font-label-md text-label-md text-gray-100 mb-3">
              Informações gerais
            </Text>

            <View className="rounded-2xl bg-gray-800 border border-gray-600 p-5 mb-4 flex-row items-center gap-4">
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-gray-700">
                <MCI name="clock-outline" size={20} className="color-green-light" />
              </View>
              <View className="flex-1">
                <Text className="font-heading-lg text-heading-lg text-gray-100">
                  {totalFormatted}
                </Text>
                <Text className="font-text-sm text-text-sm text-gray-400">
                  Total de despesas
                </Text>
              </View>
              <View className="w-10" />
            </View>

            <View className="flex-row gap-2">
              <View className="flex-1 flex-row rounded-2xl bg-gray-800 border border-gray-600 p-3 justify-center">
                <View>
                  <Text className="font-heading-lg text-heading-lg text-gray-200 mt-1">
                    {activitiesCount}
                  </Text>
                  <Text className="font-text-xs text-text-xs text-gray-400 mt-4">
                    Atividades
                  </Text>
                </View>
                <MCI name="format-list-bulleted" size={18} className="color-green-light" />
              </View>

              <View className="flex-1 flex-row rounded-2xl bg-gray-800 border border-gray-600 p-2 justify-between">
                <View>
                  <Text className="font-heading-lg text-heading-lg text-gray-200 mt-1">
                    {expensesCount}
                  </Text>
                  <Text className="font-text-xs text-text-xs text-gray-400 mt-4">
                    Despesas
                  </Text>
                </View>
                <MCI name="currency-usd" size={18} className="color-green-light" />
              </View>

              <View className="flex-1 flex-row rounded-2xl bg-gray-800 border border-gray-600 p-2 justify-between">
                <View>
                  <Text className="font-heading-lg text-heading-lg text-gray-200 mt-1">
                    {participantsCount}
                  </Text>
                  <Text className="font-text-xs text-text-xs text-gray-400 mt-4">
                    Participantes
                  </Text>
                </View>
                <MCI name="account-group" size={18} className="color-green-light" />
              </View>
            </View>
        </ScrollView>
        )}
      </View>
      <CreateActivityModal
        visible={modalVisible}
        userId={user?.id ?? ""}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}
