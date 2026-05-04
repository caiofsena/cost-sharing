import { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "react-native";

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
      <AuthStack.Screen name="Login" component={LoginScreenWrapper} />
      <AuthStack.Screen name="Signup" component={SignupScreenWrapper} />
    </AuthStack.Navigator>
  );
}

function LoginScreenWrapper({ navigation }: any) {
  return (
    <LoginScreen
      onNavigateToSignup={() => navigation.navigate("Signup")}
      onLoginSuccess={() => navigation.getParent()?.replace("Main")}
    />
  );
}

function SignupScreenWrapper({ navigation }: any) {
  return (
    <SignupScreen
      onNavigateToLogin={() => navigation.navigate("Login")}
      onSignupSuccess={() => navigation.getParent()?.replace("Main")}
    />
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      setIsAuthenticated(!!token);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return null;
  }

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
