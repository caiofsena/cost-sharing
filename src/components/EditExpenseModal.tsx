import { useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, Text, View } from "react-native";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { cssInterop } from "nativewind";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchActivityById, fetchActivities } from "@/store/activitiesSlice";
import { deleteExpense, toggleParticipantPayment } from "@/store/expensesSlice";
import { StatusSelect } from "@/components/StatusSelect";
import type { ExpenseDetailResponse } from "@/services/types";
import { Button } from "@/components/Button";

cssInterop(MCI, {
  className: {
    target: "style",
  },
});

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type EditExpenseModalProps = {
  visible: boolean;
  expense: ExpenseDetailResponse;
  activityId: string;
  onClose: () => void;
  onEdit: () => void;
  onToggleSuccess?: () => void;
};

export function EditExpenseModal({
  visible,
  expense,
  activityId,
  onClose,
  onEdit,
  onToggleSuccess,
}: EditExpenseModalProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [toggling, setToggling] = useState<string | null>(null);

  const totalFormatted = (expense.amountInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const participantsCount = expense.participants.length;

  const allPaid = expense.participants.every((p) => p.paymentStatus === "paid");
  const anyPaid = expense.participants.some((p) => p.paymentStatus === "paid");
  const statusLabel = allPaid ? "Pago" : anyPaid ? "Parcial" : "Pendente";
  const statusColor = allPaid ? "text-green-base" : anyPaid ? "text-alert-base" : "text-danger-light";

  async function handleTogglePayment(participantId: string) {
    setToggling(participantId);
    try {
      await dispatch(toggleParticipantPayment({ expenseId: expense.id, participantId })).unwrap();
      dispatch(fetchActivityById(activityId));
      if (user?.id) dispatch(fetchActivities(user.id));
      onToggleSuccess?.();
    } catch (err) {
      console.error("Failed to toggle payment:", err);
    } finally {
      setToggling(null);
    }
  }

  function handleDelete() {
    Alert.alert("Excluir despesa", "Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(deleteExpense(expense.id)).unwrap();
            dispatch(fetchActivityById(activityId));
            if (user?.id) dispatch(fetchActivities(user.id));
            onClose();
          } catch (err) {
            console.error("Failed to delete expense:", err);
          }
        },
      },
    ]);
  }

  function handleClose() {
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable className="flex-1 bg-black/60 justify-end" onPress={handleClose}>
        <Pressable className="w-full rounded-t-3xl bg-gray-700 px-6 pt-6 pb-8" onPress={(e) => e.stopPropagation()}>
          <View className="mb-6 flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="font-heading-lg text-heading-lg text-gray-100">{expense.name}</Text>
              <Text className="mt-1 font-heading-md text-heading-md text-green-base">{totalFormatted}</Text>
            </View>
            <Pressable onPress={handleClose} className="p-1">
              <MCI name="close" size={24} className="color-gray-300" />
            </Pressable>
          </View>

          <View className="mb-4 flex-row items-center justify-between border-b border-gray-500 pb-4">
            <Text className="font-text-sm text-text-sm text-gray-400">
              {participantsCount} {participantsCount === 1 ? "participante" : "participantes"}
            </Text>
            <View className="rounded-md bg-alert-low px-3 py-1">
              <Text className={`font-label-xs text-label-xs ${statusColor}`}>{statusLabel}</Text>
            </View>
          </View>

          <View className="mb-6">
            {expense.participants.map((p, idx) => {
              const individualAmount = (p.amountOwedInCents / 100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });
              const isToggling = toggling === p.userId;
              const paymentStatus = p.paymentStatus === "paid" ? "paid" : "pending";

              return (
                <View
                  key={p.userId}
                  className={`flex-row items-center justify-between py-4 ${idx > 0 ? "border-t border-gray-500" : ""}`}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-600">
                      <Text className="font-label-sm text-label-sm text-gray-100">{getInitials(p.name)}</Text>
                    </View>
                    <View>
                      <Text className="font-label-sm text-label-sm text-gray-100">{p.name}</Text>
                      <Text className="font-text-xs text-text-xs text-gray-400">{individualAmount}</Text>
                    </View>
                  </View>

                  {isToggling ? (
                    <ActivityIndicator size="small" color="#585860" />
                  ) : (
                    <StatusSelect value={paymentStatus} onChange={() => handleTogglePayment(p.userId)} />
                  )}
                </View>
              );
            })}
          </View>

          <View className="flex-row gap-4 justify-between">
            <Pressable
              className="h-12 w-12 items-center justify-center rounded-full bg-gray-600 active:opacity-80"
              onPress={handleDelete}
            >
              <MCI name="delete-outline" size={24} className="color-danger-light" />
            </Pressable>

            <Button intent="secondary" onPress={onEdit}>
              <MCI name="pencil-outline" size={24} className="color-gray-200" />
              <Text className="font-label-md text-label-md text-gray-200">Editar</Text>
            </Button>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
