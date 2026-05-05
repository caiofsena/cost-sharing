import { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Text } from "react-native";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { checkStoredAuth } from "../store/authSlice";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ComponentsScreen from "../screens/ComponentsScreen";
import ExpensesScreen from "../screens/ExpensesScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

type TabParamList = {
  Home: undefined;
  Components: undefined;
  Expenses: undefined;
  Settings: undefined;
};

type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#30A65D",
        tabBarInactiveTintColor: "#92929A",
        tabBarStyle: {
          backgroundColor: "#121216",
          borderTopColor: "#2A2A2D",
        },
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
            <Text style={{ color, fontSize: 20 }}>️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const dispatch = useAppDispatch();
  const { token, initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkStoredAuth());
  }, [dispatch]);

  if (!initialized) {
    return null;
  }

  const isAuthenticated = !!token;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={HomeTabs} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
