import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../assets/logo.svg";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { cssInterop } from "nativewind";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchActivities } from "../store/activitiesSlice";
import { ActivityCard, Button, CreateActivityModal } from "../components";

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

function ActivityItem({ item, onPress }: { item: { id: string; name: string; activityDate: string; totalAmountInCents: number; participantsAmount: number; expensesAmount: number }; onPress: () => void }) {
  const totalAmount = (item.totalAmountInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const date = new Date(item.activityDate).toLocaleDateString("pt-BR");

  return (
    <Pressable onPress={onPress}>
      <ActivityCard
        title={item.name}
        amount={totalAmount}
        date={date}
        participants={`${item.participantsAmount} pessoas`}
        expenses={`${item.expensesAmount} despesa${item.expensesAmount !== 1 ? "s" : ""}`}
      />
    </Pressable>
  );
}

export default function ActivitiesScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items, loading } = useAppSelector((state) => state.activities);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchActivities(user.id));
    }
  }, [dispatch, user?.id]);

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
          <Text className="ml-2 font-heading-lg text-green-base">Cost Sharing</Text>
          <Text className="font-heading-sm text-green-light"> Split</Text>
        </View>
        <Text className="mb-1 font-heading-lg text-heading-lg text-gray-100">
          Atividades
        </Text>
        <Text className="font-text-sm text-text-sm text-gray-400">
          Organize suas despesas divididas
        </Text>
      </View>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ActivityItem
              item={item}
              onPress={() => navigation.navigate("Expenses", { activityId: item.id })}
            />
          )}
          contentContainerClassName="gap-4 px-6 py-4"
          showsVerticalScrollIndicator={false}
        />
      )}

      <Button
        onPress={() => setModalVisible(true)}
        className="absolute bottom-6 right-6"
        hasIconLeft
      >
        <Text className="font-label-sm text-label-sm text-gray-800">Criar</Text>
      </Button>

      <CreateActivityModal
        visible={modalVisible}
        userId={user?.id ?? ""}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}
