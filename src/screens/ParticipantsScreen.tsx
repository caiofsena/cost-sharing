import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { cssInterop } from "nativewind";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchActivities } from "../store/activitiesSlice";
import { fetchParticipants, removeParticipant } from "../store/participantsSlice";

cssInterop(MCI, {
  className: {
    target: "style",
  },
});

export default function ParticipantsScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: activities } = useAppSelector((state) => state.activities);
  const { items: participants, activityName, loading } = useAppSelector((state) => state.participants);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchActivities(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (activities.length > 0 && !selectedActivityId) {
      setSelectedActivityId(activities[0].id);
    }
  }, [activities, selectedActivityId]);

  useEffect(() => {
    if (selectedActivityId) {
      dispatch(fetchParticipants(selectedActivityId));
    }
  }, [dispatch, selectedActivityId]);

  function handleRemoveParticipant(userId: string, userName: string) {
    if (!selectedActivityId) return;

    Alert.alert(
      "Remover participante",
      `Tem certeza que deseja remover ${userName} desta atividade?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            dispatch(removeParticipant({ activityId: selectedActivityId, userId }));
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-800">
        <ActivityIndicator size="large" color="#30A65D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <View className="px-6 pt-4 pb-4">
        <Text className="font-heading-lg text-heading-lg text-gray-100">
          Participantes
        </Text>
        <Text className="font-text-sm text-text-sm text-gray-400">
          Gerencie quem está nas suas atividades
        </Text>
      </View>

      <View className="px-6 mb-4">
        <Text className="mb-2 font-label-sm text-label-sm text-gray-300">
          Atividade
        </Text>
        <FlatList
          horizontal
          data={activities}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          className="gap-2"
          renderItem={({ item }) => (
            <Pressable
              className={`rounded-full px-4 py-2 border ${
                selectedActivityId === item.id
                  ? "bg-green-base border-green-light"
                  : "bg-gray-700 border-gray-500"
              }`}
              onPress={() => setSelectedActivityId(item.id)}
            >
              <Text
                className={`font-label-sm text-label-sm ${
                  selectedActivityId === item.id ? "text-gray-800" : "text-gray-300"
                }`}
              >
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {selectedActivityId ? (
        <>
          <View className="px-6 mb-4 flex-row items-center justify-between">
            <Text className="font-label-md text-label-md text-gray-300">
              {activityName}
            </Text>
            <Text className="font-text-sm text-text-sm text-gray-400">
              {participants.length} {participants.length === 1 ? "pessoa" : "pessoas"}
            </Text>
          </View>

          <FlatList
            data={participants}
            keyExtractor={(item) => item.userId}
            className="px-6"
            renderItem={({ item }) => (
              <View className="mb-3 flex-row items-center justify-between rounded-xl bg-gray-700 border border-gray-500 p-4">
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-600">
                    <Text className="font-label-sm text-label-sm text-gray-100">
                      {item.name.substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-label-sm text-label-sm text-gray-100">
                      {item.name}
                    </Text>
                    <Text className="font-text-xs text-text-xs text-gray-400">
                      {item.email}
                    </Text>
                  </View>
                </View>

                <Pressable
                  className="h-8 w-8 items-center justify-center rounded-full bg-gray-600 active:opacity-80"
                  onPress={() => handleRemoveParticipant(item.userId, item.name)}
                >
                  <MCI name="account-remove" size={18} className="color-danger-light" />
                </Pressable>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center font-label-md text-label-md text-gray-400">
            Selecione uma atividade para ver os participantes
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
