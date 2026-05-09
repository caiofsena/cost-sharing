import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from "react-native";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { cssInterop } from "nativewind";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearError, createExpense, fetchExpensesByActivity } from "../store/expensesSlice";
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

type CreateExpenseModalProps = {
  visible: boolean;
  activityId: string;
  onClose: () => void;
};

export function CreateExpenseModal({ visible, activityId, onClose }: CreateExpenseModalProps) {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.auth);
  const { error } = useAppSelector((state) => state.expenses);
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      amount: "",
    },
  });
  const [selectedParticipants, setSelectedParticipants] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (visible) {
      reset({
        title: "",
        amount: "",
      });
      setSelectedParticipants([]);
    }
  }, [visible, reset]);

  async function onSubmit(data: FormData) {
    const amountInCents = Math.round(parseFloat(data.amount.replace(",", ".")) * 100);
    const participantIds = selectedParticipants.map((p) => p.id);

    try {
      await dispatch(createExpense({
        activityId,
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

  function handleClose() {
    reset();
    setSelectedParticipants([]);
    onClose();
    dispatch(clearError());
  }

  const participantOptions: SelectOption[] = (users ?? []).map((p) => ({
    id: p?.id ?? "",
    name: p?.name ?? "",
    initials: p?.name.substring(0, 2).toUpperCase() ?? "",
  }));

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
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="font-heading-lg text-heading-lg text-gray-100">
              Nova despesa
            </Text>
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
                error={errors.title?.message}
              />
            </View>
          </View>

          <Pressable
            className="mt-6 h-12 items-center justify-center rounded-full bg-green-base active:opacity-80"
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
        </Pressable>
      </Pressable>
    </Modal>
  );
}
