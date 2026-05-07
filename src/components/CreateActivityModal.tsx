import { useEffect } from "react";
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from "react-native";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { cssInterop } from "nativewind";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { activitiesService } from "../services";

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

type CreateActivityModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function CreateActivityModal({ visible, onClose, onSuccess }: CreateActivityModalProps) {
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      activityDate: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        title: "",
        activityDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [visible, reset]);

  async function onSubmit(data: FormData) {
    try {
      await activitiesService.create({
        title: data.title.trim(),
        activityDate: new Date(data.activityDate).toISOString(),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
    }
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
              Nova Atividade
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

          <Pressable
            className="mt-6 h-12 items-center justify-center rounded-full bg-green-base border border-green-light active:opacity-80"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#0B0B0E" />
            ) : (
              <Text className="font-label-md text-label-md text-gray-800">
                Criar atividade
              </Text>
            )}
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
