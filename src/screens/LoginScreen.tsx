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

import { Divider, InputWithIcon, Logo, MailIcon, LockIcon } from "../components";
import { authService } from "../services";

type LoginScreenProps = {
  onNavigateToSignup: () => void;
  onLoginSuccess: () => void;
};

export default function LoginScreen({ onNavigateToSignup, onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          <View className="flex-1 justify-center px-6">
            <View className="mb-10 items-center">
              <Logo size="lg" />
            </View>

            <View className="rounded-t-3xl bg-gray-700 px-6 pt-8 pb-10">
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
                <InputWithIcon
                  leftIcon={<MailIcon className="bg-gray-400" />}
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                <InputWithIcon
                  leftIcon={<LockIcon className="bg-gray-400" />}
                  placeholder="Senha"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <Pressable
                className="mt-6 h-12 items-center justify-center rounded-full bg-green-base active:opacity-80"
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

              <View className="mt-6 flex-row items-center justify-center gap-1">
                <Text className="font-text-sm text-text-sm text-gray-300">
                  Ainda não tem cadastro?
                </Text>
                <Pressable onPress={onNavigateToSignup}>
                  <Text className="font-label-sm text-label-sm text-green-base">
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
