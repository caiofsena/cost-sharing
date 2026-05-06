import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../assets/logo.svg";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { cssInterop } from "nativewind";

import { useAppSelector } from "../store/hooks";
import { activitiesService } from "../services";
import { ActivityCard, Button, CreateActivityModal } from "../components";
import type { ActivityListItem } from "../services/types";

cssInterop(MCI, {
  className: {
    target: "style",
  },
});

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-gray-700">
        <MCI name="clipboard-text-outline" size={48} className="color-gray-400" />
      </View>
      <Text className="text-center font-label-md text-label-md text-gray-300">
        Você ainda não tem atividades criadas
      </Text>
    </View>
  );
}

function ActivityItem({ item }: { item: ActivityListItem }) {
  const totalAmount = (item.totalAmountInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const date = new Date(item.activityDate).toLocaleDateString("pt-BR");

  return (
    <ActivityCard
      title={item.name}
      amount={totalAmount}
      date={date}
      participants={`${item.participantsAmount} pessoas`}
      expenses={`${item.expensesAmount} despesa${item.expensesAmount !== 1 ? "s" : ""}`}
    />
  );
}

export default function ActivitiesScreen() {
  const { user } = useAppSelector((state) => state.auth);
  const [activities, setActivities] = useState<ActivityListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  async function fetchActivities() {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await activitiesService.listByUser(user.id);
      setActivities(response.activities);
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleCreateSuccess() {
    fetchActivities();
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
        <View className="mb-4 flex-row items-center">
          <Logo width={17} height={17} />
          <Text className="ml-2 font-heading-lg text-green-base">TaskCost</Text>
          <Text className="font-heading-sm text-green-light"> Split</Text>
        </View>
        <Text className="mb-1 font-heading-lg text-heading-lg text-gray-100">
          Atividades
        </Text>
        <Text className="font-text-sm text-text-sm text-gray-400">
          Organize suas despesas divididas
        </Text>
      </View>

      {activities.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ActivityItem item={item} />}
          contentContainerClassName="gap-4 px-6 py-4"
          showsVerticalScrollIndicator={false}
        />
      )}

      <Button
        label="Criar"
        onPress={() => setModalVisible(true)}
        className="absolute bottom-6 right-6"
      />

      <CreateActivityModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />
    </SafeAreaView>
  );
}
