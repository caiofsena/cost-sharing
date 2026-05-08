import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, Text, TextInput, View } from "react-native";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { cssInterop } from "nativewind";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateExpense, fetchExpensesByActivity, deleteExpense, clearError } from "../store/expensesSlice";
import { Select, type SelectOption } from "./Select";

cssInterop(MCI, {
  className: {
    target: "style",
  },
});

const schema = yup.object({
  title: yup.string().required("Informe o título").trim(),
  amount: yup
    .string()
    .required("Informe um valor")
    .test("is-valid-amount", "Informe um valor válido", (value) => {
      if (!value) return false;
      const num = parseFloat(value.replace(",", "."));
      return !isNaN(num) && num > 0;
    }),
});

type FormData = yup.InferType<typeof schema>;

type EditExpenseFormModalProps = {
  visible: boolean;
  expenseId: string;
  activityId: string;
  initialTitle: string;
  initialAmountInCents: number;
  initialParticipantIds: string[];
  onClose: () => void;
};

export function EditExpenseFormModal({
  visible,
  expenseId,
  activityId,
  initialTitle,
  initialAmountInCents,
  initialParticipantIds,
  onClose,
}: EditExpenseFormModalProps) {
  const dispatch = useAppDispatch();
  const { current: activity } = useAppSelector((state) => state.activities);
  const { error } = useAppSelector((state) => state.expenses);
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialTitle,
      amount: (initialAmountInCents / 100).toFixed(2).replace(".", ","),
    },
  });
  const [selectedParticipants, setSelectedParticipants] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (visible) {
      const participantOptions: SelectOption[] = (activity?.participants ?? [])
        .filter((p) => initialParticipantIds.includes(p.id))
        .map((p) => ({
          id: p.id,
          name: p.name,
          initials: p.name.substring(0, 2).toUpperCase(),
        }));

      reset({
        title: initialTitle,
        amount: (initialAmountInCents / 100).toFixed(2).replace(".", ","),
      });
      setSelectedParticipants(participantOptions);
    }
  }, [visible, initialTitle, initialAmountInCents, initialParticipantIds, activity, reset]);

  async function onSubmit(data: FormData) {
    const amountInCents = Math.round(parseFloat(data.amount.replace(",", ".")) * 100);
    const participantIds = selectedParticipants.map((p) => p.id);

    try {
      await dispatch(updateExpense({
        expenseId,
        data: {
          title: data.title.trim(),
          amountInCents,
          participantsIds: participantIds,
        },
      })).unwrap();
      dispatch(fetchExpensesByActivity(activityId));
      onClose();
    } catch {
    }
  }

  function handleDelete() {
    Alert.alert(
      "Excluir despesa",
      "Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(deleteExpense(expenseId)).unwrap();
              dispatch(fetchExpensesByActivity(activityId));
              onClose();
            } catch {
            }
          },
        },
      ]
    );
  }

  function handleClose() {
    reset();
    setSelectedParticipants([]);
    onClose();
    dispatch(clearError());
  }

  const participantOptions: SelectOption[] = (activity?.participants ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    initials: p.name.substring(0, 2).toUpperCase(),
  }));

  const amountDisplay = (initialAmountInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable
        className="flex-1 bg-black/60 justify-end"
        onPress={handleClose}
      >
        <Pressable
          className="w-full rounded-t-3xl bg-gray-700 px-6 pt-6 pb-8"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="mb-6 flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="font-heading-lg text-heading-lg text-gray-100">
                Editar despesa
              </Text>
              <Text className="mt-1 font-heading-md text-heading-md text-green-base">
                {amountDisplay}
              </Text>
            </View>
            <Pressable onPress={handleClose} className="p-1">
              <MCI name="close" size={24} className="color-gray-300" />
            </Pressable>
          </View>

          {error ? (
            <View className="mb-4 rounded-md bg-danger-low p-3">
              <Text className="text-center font-text-sm text-text-sm text-danger-light">
                {error}
              </Text>
            </View>
          ) : null}

          <View className="gap-5">
            <View>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      className="h-12 rounded-md border border-gray-500 bg-gray-800 px-4 font-text-md text-text-md text-gray-100"
                      placeholder="Título"
                      placeholderTextColor="#585860"
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.title && (
                      <Text className="mt-1 font-text-xs text-text-xs text-danger-light">
                        {errors.title.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            <View>
              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, value } }) => (
                  <>
                    <View className="flex-row items-center rounded-md border border-gray-500 bg-gray-800">
                      <Text className="px-4 font-text-md text-text-md text-gray-400">
                        R$
                      </Text>
                      <TextInput
                        className="flex-1 h-12 font-text-md text-text-md text-gray-100"
                        placeholder="0,00"
                        placeholderTextColor="#585860"
                        keyboardType="decimal-pad"
                        value={value}
                        onChangeText={onChange}
                      />
                    </View>
                    {errors.amount && (
                      <Text className="mt-1 font-text-xs text-text-xs text-danger-light">
                        {errors.amount.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            <View>
              <Select
                options={participantOptions}
                value={selectedParticipants}
                onChange={setSelectedParticipants}
                placeholder="Participantes"
              />
            </View>
          </View>

          <View className="mt-6 flex-row gap-4">
            <Pressable
              className="h-12 w-12 items-center justify-center rounded-full bg-gray-600 active:opacity-80"
              onPress={handleDelete}
              disabled={isSubmitting}
            >
              <MCI name="delete-outline" size={22} className="color-danger-light" />
            </Pressable>

            <Pressable
              className="flex-1 h-12 items-center justify-center rounded-full bg-green-base active:opacity-80"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#0B0B0E" />
              ) : (
                <Text className="font-label-md text-label-md text-gray-800">
                  Salvar
                </Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
