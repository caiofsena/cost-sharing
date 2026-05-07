import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { cssInterop } from "nativewind";

import { activitiesService, expensesService } from "../services";
import { Badge, Button, ExpenseCard, CreateExpenseModal, EditActivityModal } from "../components";
import type {
  ActivityDetailResponse,
  ExpenseListItem,
} from "../services/types";

cssInterop(MCI, {
  className: {
    target: "style",
  },
});

type ExpensesScreenProps = {
  route: {
    params: {
      activityId: string;
    };
  };
  navigation: any;
};

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="mb-4">
        <MCI name="chart-pie-outline" size={24} className="color-gray-400" />
      </View>
      <Text className="mb-6 text-center font-label-md text-label-md text-gray-400">
        {`Para começar a dividir, \nregistre uma despesa`}
      </Text>
      <Button onPress={onCreate} hasIconLeft>
        <Text className="font-label-sm text-label-sm text-gray-800">Nova despesa</Text>
      </Button>
    </View>
  );
}

function ExpenseItem({ item }: { item: ExpenseListItem }) {
  const totalAmount = (item.amountInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const perPerson = (item.amountInCents / 100 / item.participantsCount).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <ExpenseCard
      title={item.name}
      amount={totalAmount}
      perPerson={`${perPerson} / pessoa`}
      initials={["JS", "MO"]}
      status="pending"
    />
  );
}

export default function ExpensesScreen({ route, navigation }: ExpensesScreenProps) {
  const { activityId } = route.params;
  const [activity, setActivity] = useState<ActivityDetailResponse | null>(null);
  const [expenses, setExpenses] = useState<ExpenseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activityId]);

  async function fetchData() {
    try {
      setLoading(true);
      const [activityData, expensesData] = await Promise.all([
        activitiesService.getById(activityId),
        expensesService.listByActivity(activityId),
      ]);
      setActivity(activityData);
      setExpenses(expensesData.expenses);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleCreateExpense() {
    setModalVisible(true);
  }

  function handleCreateSuccess() {
    fetchData();
  }

  function handleEditActivity() {
    setEditModalVisible(true);
  }

  function handleEditSuccess() {
    fetchData();
  }

  function handleDeleteActivity() {
    navigation.goBack();
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-800">
        <ActivityIndicator size="large" color="#30A65D" />
      </SafeAreaView>
    );
  }

  const totalAmount = (activity?.totalAmountInCents ?? 0) / 100;
  const totalFormatted = totalAmount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const activityDate = activity?.activityDate
    ? new Date(activity.activityDate).toLocaleDateString("pt-BR")
    : "";

  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <View className="px-6 py-4">
        <View className="flex-row items-center justify-between">
          <Pressable
            className="flex-row items-center gap-1"
            onPress={() => navigation.goBack()}
          >
            <MCI name="arrow-left" size={20} className="color-green-base" />
            <Text className="font-label-sm text-label-sm text-green-base">
              Voltar
            </Text>
          </Pressable>

          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-600"
            onPress={handleEditActivity}
          >
            <MCI name="pencil" size={18} className="color-gray-200" />
          </Pressable>
        </View>

        <Text className="mt-4 font-heading-lg text-heading-lg text-gray-100">
          {activity?.name}
        </Text>
        <View className="mt-1 flex-row items-center gap-1">
          <MCI name="calendar-outline" size={16} className="color-gray-400" />
          <Text className="font-text-sm text-text-sm text-gray-400">
            {activityDate}
          </Text>
        </View>
      </View>

      {expenses.length === 0 ? (
        <EmptyState onCreate={handleCreateExpense} />
      ) : (
        <>
          <View className="flex-row items-center justify-between border-b border-gray-500 px-6 py-4">
            <View className="flex-row items-center gap-3">
              <View className="flex-row">
                {activity?.participants.slice(0, 3).map((p, i) => (
                  <View
                    key={p.id}
                    className={`h-8 w-8 items-center justify-center rounded-full bg-gray-600 ${i > 0 ? "-ml-2" : ""}`}
                  >
                    <Text className="text-[10px] font-label-sm text-gray-100">
                      {p.name.substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>
              <Text className="font-text-sm text-text-sm text-gray-400">
                {activity?.participants.length} participantes
              </Text>
            </View>

            <View className="items-end">
              <Text className="font-label-md text-label-md text-green-base">
                {totalFormatted}
              </Text>
              <Text className="font-text-xs text-text-xs text-gray-400">
                Gastos totais
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between border-b border-gray-500 px-6 py-3">
            <Text className="font-label-sm text-label-sm text-gray-300">
              Despesas
            </Text>
            <Text className="font-text-sm text-text-sm text-gray-400">
              {expenses.length} {expenses.length === 1 ? "item" : "itens"}
            </Text>
          </View>

          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ExpenseItem item={item} />}
            contentContainerClassName="gap-4 px-6 py-4"
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      { expenses.length > 0 && (
        <Pressable
          className="absolute bottom-24 right-6 flex-row items-center gap-2 rounded-full bg-green-base border border-green-light px-5 py-3 active:opacity-80"
          onPress={handleCreateExpense}
        >
          <MCI name="plus" size={18} className="color-gray-800" />
          <Text className="font-label-sm text-label-sm text-gray-800">Nova</Text>
        </Pressable>
      )}

      <CreateExpenseModal
        visible={modalVisible}
        activityId={activityId}
        onClose={() => setModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />

      {activity && (
        <EditActivityModal
          visible={editModalVisible}
          activityId={activityId}
          initialName={activity.name}
          initialDate={activity.activityDate}
          onClose={() => setEditModalVisible(false)}
          onSuccess={handleEditSuccess}
          onDelete={handleDeleteActivity}
        />
      )}
    </SafeAreaView>
  );
}
