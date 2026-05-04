import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";

import ComponentsScreen from "../screens/ComponentsScreen";
import ExpensesScreen from "../screens/ExpensesScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";

type TabParamList = {
  Home: undefined;
  Components: undefined;
  Expenses: undefined;
  Settings: undefined;
};

type StackParamList = {
  Main: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#9ca3af",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }: { color: string }) => (
            <Text style={{ color, fontSize: 20 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Components"
        component={ComponentsScreen}
        options={{
          tabBarLabel: "Components",
          tabBarIcon: ({ color }: { color: string }) => (
            <Text style={{ color, fontSize: 20 }}>🧩</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{
          tabBarLabel: "Expenses",
          tabBarIcon: ({ color }: { color: string }) => (
            <Text style={{ color, fontSize: 20 }}>💰</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }: { color: string }) => (
            <Text style={{ color, fontSize: 20 }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={HomeTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
