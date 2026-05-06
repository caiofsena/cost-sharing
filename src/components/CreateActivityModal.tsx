import { useState } from "react";
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from "react-native";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { cssInterop } from "nativewind";

import { activitiesService } from "../services";

cssInterop(MCI, {
  className: {
    target: "style",
  },
});

type CreateActivityModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function CreateActivityModal({ visible, onClose, onSuccess }: CreateActivityModalProps) {
  const [title, setTitle] = useState("");
  const [activityDate, setActivityDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    setError("");

    if (!title.trim()) {
      setError("Informe o nome da atividade");
      return;
    }

    setLoading(true);

    try {
      await activitiesService.create({
        title: title.trim(),
        activityDate: new Date(activityDate).toISOString(),
      });
      setTitle("");
      setActivityDate(new Date().toISOString().split("T")[0]);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao criar atividade");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setTitle("");
    setActivityDate(new Date().toISOString().split("T")[0]);
    setError("");
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

          {error ? (
            <View className="mb-4 rounded-md bg-danger-low p-3">
              <Text className="text-center font-text-sm text-text-sm text-danger-light">
                {error}
              </Text>
            </View>
          ) : null}

          <View className="gap-5">
            <View>
              <Text className="mb-2 font-label-sm text-label-sm text-gray-300">
                Nome da atividade
              </Text>
              <TextInput
                className="h-12 rounded-md border border-gray-500 bg-gray-800 px-4 font-text-md text-text-md text-gray-100"
                placeholder="Ex: Férias de verão"
                placeholderTextColor="#585860"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View>
              <Text className="mb-2 font-label-sm text-label-sm text-gray-300">
                Data
              </Text>
              <TextInput
                className="h-12 rounded-md border border-gray-500 bg-gray-800 px-4 font-text-md text-text-md text-gray-100"
                placeholder="AAAA-MM-DD"
                placeholderTextColor="#585860"
                value={activityDate}
                onChangeText={setActivityDate}
              />
            </View>
          </View>

          <Pressable
            className="mt-6 h-12 items-center justify-center rounded-full bg-green-base border border-green-light active:opacity-80"
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? (
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
