import { useEffect } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, Text, TextInput, View } from "react-native";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { cssInterop } from "nativewind";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAppDispatch } from "../store/hooks";
import { updateActivity, deleteActivity, fetchActivities } from "../store/activitiesSlice";
import { Button } from "./Button";

cssInterop(MCI, {
  className: {
    target: "style",
  },
});

const schema = yup.object({
  title: yup.string().required("Informe o nome da atividade").trim(),
  activityDate: yup.string().required("Informe a data").matches(/^\d{4}-\d{2}-\d{2}$/, "Formato: AAAA-MM-DD"),
});

type FormData = yup.InferType<typeof schema>;

type EditActivityModalProps = {
  visible: boolean;
  activityId: string;
  userId: string;
  initialName: string;
  initialDate: string;
  onClose: () => void;
  onDelete: () => void;
};

export function EditActivityModal({
  visible,
  activityId,
  userId,
  initialName,
  initialDate,
  onClose,
  onDelete,
}: EditActivityModalProps) {
  const dispatch = useAppDispatch();
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialName,
      activityDate: initialDate.split("T")[0],
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        title: initialName,
        activityDate: initialDate.split("T")[0],
      });
    }
  }, [visible, initialName, initialDate, reset]);

  async function onSubmit(data: FormData) {
    try {
      await dispatch(updateActivity({
        activityId,
        data: {
          title: data.title.trim(),
          activityDate: new Date(data.activityDate).toISOString(),
        },
      })).unwrap();
      dispatch(fetchActivities(userId));
      onClose();
    } catch {
    }
  }

  function handleDelete() {
    Alert.alert(
      "Excluir atividade",
      "Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(deleteActivity(activityId)).unwrap();
              dispatch(fetchActivities(userId));
              onDelete();
            } catch {
            }
          },
        },
      ]
    );
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        className="flex-1 bg-black/60 items-center justify-center px-6"
        onPress={handleClose}
      >
        <Pressable
          className="w-full rounded-2xl bg-gray-700 border border-gray-500 p-6"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="font-heading-lg text-heading-lg text-gray-100">
              Editar Atividade
            </Text>
            <Pressable onPress={handleClose} className="p-1">
              <MCI name="close" size={24} className="color-gray-300" />
            </Pressable>
          </View>

          <View className="gap-5">
            <View>
              <Text className="mb-2 font-label-sm text-label-sm text-gray-300">
                Nome da atividade
              </Text>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      className="h-12 rounded-md border border-gray-500 bg-gray-800 px-4 font-text-md text-text-md text-gray-100"
                      placeholder="Ex: Férias de verão"
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
              <Text className="mb-2 font-label-sm text-label-sm text-gray-300">
                Data
              </Text>
              <Controller
                control={control}
                name="activityDate"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      className="h-12 rounded-md border border-gray-500 bg-gray-800 px-4 font-text-md text-text-md text-gray-100"
                      placeholder="AAAA-MM-DD"
                      placeholderTextColor="#585860"
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.activityDate && (
                      <Text className="mt-1 font-text-xs text-text-xs text-danger-light">
                        {errors.activityDate.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>
          </View>

          <View className="mt-6 flex-row gap-3">
            <Button intent="danger" onPress={handleDelete} disabled={isSubmitting}>
              <MCI name="delete" size={24} className="color-danger-light" />
            </Button>

            <Pressable
              className="flex-1 h-12 items-center justify-center rounded-full bg-green-base border border-green-light active:opacity-80"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#0B0B0E" />
              ) : (
                <Text className="font-label-md text-label-md text-gray-800">
                  Salvar alterações
                </Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
