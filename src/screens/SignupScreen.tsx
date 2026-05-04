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

import { Divider, InputWithIcon, Logo, MailIcon, LockIcon, UserIcon } from "../components";
import { authService } from "../services";

type SignupScreenProps = {
  onNavigateToLogin: () => void;
  onSignupSuccess: () => void;
};

export default function SignupScreen({ onNavigateToLogin, onSignupSuccess }: SignupScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup() {
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await authService.signUp({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      onSignupSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao criar conta");
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
            <View className="mb-8 items-center">
              <Logo size="lg" />
            </View>

            <View className="rounded-t-3xl bg-gray-700 px-6 pt-8 pb-10">
              <Text className="mb-8 text-center font-heading-lg text-heading-lg text-gray-100">
                Criar conta
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
                  leftIcon={<UserIcon className="border-gray-400" />}
                  placeholder="Nome completo"
                  value={name}
                  onChangeText={setName}
                />

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

                <InputWithIcon
                  leftIcon={<LockIcon className="bg-gray-400" />}
                  placeholder="Confirmar senha"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <Pressable
                className="mt-6 h-12 items-center justify-center rounded-full bg-green-base active:opacity-80"
                onPress={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#0B0B0E" />
                ) : (
                  <Text className="font-label-md text-label-md text-gray-800">
                    Criar conta
                  </Text>
                )}
              </Pressable>

              <View className="mt-6 items-center">
                <Divider />
              </View>

              <View className="mt-6 flex-row items-center justify-center gap-1">
                <Text className="font-text-sm text-text-sm text-gray-300">
                  Já tem uma conta?
                </Text>
                <Pressable onPress={onNavigateToLogin}>
                  <Text className="font-label-sm text-label-sm text-green-base">
                    Entrar
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
