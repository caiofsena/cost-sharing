import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cssInterop } from "nativewind";

import { Divider, InputIcon } from "../components";
import { authService } from "../services";
import Logo from "../../assets/logo.svg";
import MCI from '@expo/vector-icons/MaterialCommunityIcons';

type LoginScreenProps = {
  onNavigateToSignup: () => void;
  onLoginSuccess: () => void;
};

export default function LoginScreen({ onNavigateToSignup, onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  cssInterop(MCI, {
    className: {
      target: "style"
    }
  });

  async function handleLogin() {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      await authService.signIn({ email: email.trim(), password });
      onLoginSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-1"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center">
            <View className="h-96 justify-center items-center">
              <Logo width={64} height={64} />
              <View className="flex-row mt-2">
                <Text className={'font-heading-lg text-green-base'}>TaskCost</Text>
                <Text className={'font-heading-sm text-green-light'}> Split</Text>
              </View>
            </View>

            <View className="flex-1 rounded-t-3xl bg-gray-700 px-6 pt-8 pb-1">
              <Text className="mb-8 text-center font-heading-lg text-heading-lg text-gray-100">
                Entre no app
              </Text>

              {error ? (
                <View className="mb-4 rounded-md bg-danger-low p-3">
                  <Text className="text-center font-text-sm text-text-sm text-danger-light">
                    {error}
                  </Text>
                </View>
              ) : null}

              <View className="gap-4">
                <InputIcon
                  leftIcon={<MCI name="email-outline" size={20} className="color-gray-200" />}
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                <InputIcon
                  leftIcon={<MCI name="asterisk" size={20} className="color-gray-200" />}
                  placeholder="Senha"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <Pressable
                className="mt-6 h-12 items-center justify-center rounded-full bg-green-base border border-green-light active:opacity-80"
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#0B0B0E" />
                ) : (
                  <Text className="font-label-md text-label-md text-gray-800">
                    Entrar
                  </Text>
                )}
              </Pressable>

              <View className="mt-6 items-center">
                <Divider />
              </View>

              <View className='flex-1 justify-end'>
                <Text className="self-center font-text-sm text-text-sm text-gray-200">
                  Ainda não tem cadastro?
                </Text>
                <Pressable
                  className="mt-6 h-12 items-center justify-center rounded-full bg-gray-600 border border-gray-500 active:opacity-80"
                  onPress={onNavigateToSignup}
                >
                  <Text className="font-label-md text-label-md text-gray-200">
                    Criar conta
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
