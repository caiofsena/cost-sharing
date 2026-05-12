import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchActivityById, clearCurrent, fetchActivities } from "../store/activitiesSlice";
import { fetchExpenseById, clearCurrent as clearExpenseCurrent } from "../store/expensesSlice";
import { Button, ExpenseCard, CreateExpenseModal, EditActivityModal, EditExpenseModal, EditExpenseFormModal } from "../components";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ActivityDetailResponseExpenseInfo, ExpenseDetailResponse } from "../services/types";

type ExpensesStackParamList = {
  Expenses: { activityId: string };
};

type ExpensesScreenProps = {
  route: {
    params: {
      activityId: string;
    };
  };
  navigation: NativeStackNavigationProp<ExpensesStackParamList, "Expenses">;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function computeExpenseStatus(
  participants: { paymentStatus: string }[]
): "paid" | "partial" | "pending" {
  if (participants.length === 0) return "pending";
  const allPaid = participants.every((p) => p.paymentStatus === "paid");
  const anyPaid = participants.some((p) => p.paymentStatus === "paid");
  if (allPaid) return "paid";
  if (anyPaid) return "partial";
  return "pending";
}

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

function ExpenseItem({ item, onPress }: { item: ActivityDetailResponseExpenseInfo; onPress: () => void }) {
  const totalAmount = (item.amountInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const participantsCount = item.participants.length;
  const perPerson = participantsCount > 0
    ? (item.amountInCents / 100 / participantsCount).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : totalAmount;

  const initials = item.participants.map((p) => getInitials(p.name));
  const status = computeExpenseStatus(item.participants);

  return (
    <Pressable onPress={onPress}>
      <ExpenseCard
        title={item.name}
        amount={totalAmount}
        perPerson={`${perPerson} / pessoa`}
        initials={initials}
        status={status}
      />
    </Pressable>
  );
}

export default function ExpensesScreen({ route, navigation }: ExpensesScreenProps) {
  const dispatch = useAppDispatch();
  const { activityId } = route.params;
  const { user } = useAppSelector((state) => state.auth);
  const { current: activity, loading: activityLoading } = useAppSelector((state) => state.activities);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editActivityModalVisible, setEditActivityModalVisible] = useState(false);
  const [editExpenseModalVisible, setEditExpenseModalVisible] = useState(false);
  const [editExpenseFormModalVisible, setEditExpenseFormModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseDetailResponse | null>(null);

  useEffect(() => {
    dispatch(fetchActivityById(activityId));

    return () => {
      dispatch(clearCurrent());
      dispatch(clearExpenseCurrent());
    };
  }, [dispatch, activityId]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchActivities(user.id));
    }
  }, [dispatch, user?.id]);

  async function handleOpenExpense(expenseId: string) {
    try {
      const result = await dispatch(fetchExpenseById(expenseId)).unwrap();
      setSelectedExpense(result);
      setEditExpenseModalVisible(true);
    } catch (err) {
      console.error("Failed to fetch expense:", err);
    }
  }

  function handleCreateExpense() {
    setCreateModalVisible(true);
  }

  function handleEditActivity() {
    setEditActivityModalVisible(true);
  }

  function handleDeleteActivity() {
    navigation.goBack();
  }

  function handleOpenEditExpenseForm() {
    if (!selectedExpense) return;
    setEditExpenseModalVisible(false);
    setEditExpenseFormModalVisible(true);
  }

  function handleCloseEditExpenseForm() {
    setEditExpenseFormModalVisible(false);
  }

  const expenses = activity?.expenses ?? [];

  if (activityLoading) {
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
            <MCI name="arrow-left" size={20} className="color-green-light" />
            <Text className="font-label-sm text-label-sm text-green-light">
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
          <View className="flex-row items-center justify-between px-6 py-4">
            <View className="flex-row items-center gap-3">
              <View className="flex-row">
                {activity?.participants.slice(0, 3).map((p, i) => (
                  <View
                    key={p.id}
                    className={`h-8 w-8 items-center justify-center rounded-full bg-gray-600 ${i > 0 ? "-ml-2" : ""}`}
                  >
                    <Text className="text-[10px] font-label-sm text-gray-100">
                      {getInitials(p.name)}
                    </Text>
                  </View>
                ))}
              </View>
              <Text className="font-text-sm text-text-sm text-gray-400">
                {activity?.participants.length} participantes
              </Text>
            </View>

            <View className="items-end">
              <Text className="font-label-md text-label-md text-green-light">
                {totalFormatted}
              </Text>
              <Text className="font-text-xs text-text-xs text-gray-400">
                Gastos totais
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between px-6 py-3">
            <Text className="font-label-sm text-label-sm text-gray-200">
              Despesas
            </Text>
            <Text className="font-text-sm text-text-sm text-gray-400">
              {expenses.length} {expenses.length === 1 ? "item" : "itens"}
            </Text>
          </View>

          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExpenseItem
                item={item}
                onPress={() => handleOpenExpense(item.id)}
              />
            )}
            contentContainerClassName="gap-4 px-6 py-4"
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      { expenses.length > 0 && (
        <Button
          className="absolute bottom-6 right-6"
          onPress={handleCreateExpense}
          hasIconLeft
        >
          <Text className="font-label-sm text-label-sm text-gray-800">Nova</Text>
        </Button>
      )}

      <CreateExpenseModal
        visible={createModalVisible}
        activityId={activityId}
        onClose={() => setCreateModalVisible(false)}
      />

      {activity && (
        <EditActivityModal
          visible={editActivityModalVisible}
          activityId={activityId}
          userId={user?.id ?? ""}
          initialName={activity.name}
          initialDate={activity.activityDate}
          onClose={() => setEditActivityModalVisible(false)}
          onDelete={handleDeleteActivity}
        />
      )}

      {selectedExpense && (
        <EditExpenseModal
          visible={editExpenseModalVisible}
          expense={selectedExpense}
          activityId={activityId}
          onClose={() => {
            setEditExpenseModalVisible(false);
            setSelectedExpense(null);
          }}
          onEdit={handleOpenEditExpenseForm}
          onToggleSuccess={async () => {
            try {
              const result = await dispatch(fetchExpenseById(selectedExpense.id)).unwrap();
              setSelectedExpense(result);
            } catch (err) {
              console.error("Failed to fetch expense for toggle:", err);
            }
          }}
        />
      )}

      {selectedExpense && (
        <EditExpenseFormModal
          visible={editExpenseFormModalVisible}
          expenseId={selectedExpense.id}
          activityId={activityId}
          initialTitle={selectedExpense.name}
          initialAmountInCents={selectedExpense.amountInCents}
          initialParticipantIds={selectedExpense.participants.map((p) => p.userId)}
          onClose={handleCloseEditExpenseForm}
        />
      )}
    </SafeAreaView>
  );
}
