import { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { checkStoredAuth } from "../store/authSlice";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { cssInterop } from "nativewind";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import HomeScreen from "../screens/HomeScreen";
import ActivitiesScreen from '../screens/ActivitiesScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import ResumeScreen from '../screens/ResumeScreen';
import ParticipantsScreen from '../screens/ParticipantsScreen';

cssInterop(MCI, {
  className: {
    target: "style",
  },
});

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

type ActivitiesStackParamList = {
  Activities: undefined;
  Expenses: { activityId: string };
};

type TabParamList = {
  Home: undefined;
  Activities: undefined;
  Resume: undefined;
  Participants: undefined;
  Components: undefined;
};

type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Expenses: { activityId: string };
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const ActivitiesStack = createNativeStackNavigator<ActivitiesStackParamList>();
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

function ActivitiesStackScreen() {
  return (
    <ActivitiesStack.Navigator screenOptions={{ headerShown: false }}>
      <ActivitiesStack.Screen name="Activities" component={ActivitiesScreen} />
      <ActivitiesStack.Screen name="Expenses" component={ExpensesScreen} />
    </ActivitiesStack.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#E1E1E6",
        tabBarInactiveTintColor: "#585860",
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
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <MCI name="home" size={24} className={focused ? "color-green-base" : "color-gray-400"} />
          ),
        }}
      />
      <Tab.Screen
        name="Activities"
        component={ActivitiesStackScreen}
        options={{
          tabBarLabel: "Atividades",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <MCI name="format-list-bulleted" size={24} className={focused ? "color-green-base" : "color-gray-400"} />
          ),
        }}
      />
      <Tab.Screen
        name="Resume"
        component={ResumeScreen}
        options={{
          tabBarLabel: "Resumo",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <MCI name="chart-pie" size={24} className={focused ? "color-green-base" : "color-gray-400"} />
          ),
        }}
      />
      <Tab.Screen
        name="Participants"
        component={ParticipantsScreen}
        options={{
          tabBarLabel: "Participantes",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <MCI name="account-group" size={24} className={focused ? "color-green-base" : "color-gray-400"} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Components"
        component={ComponentsScreen}
        options={{
          tabBarLabel: "Components",
          tabBarIcon: ({ color }: { color: string }) => (
            <Text style={{ color, fontSize: 20 }}>🧩</Text>
          ),
        }}
      /> */}
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
          <>
            <RootStack.Screen name="Main" component={HomeTabs} />
          </>
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
