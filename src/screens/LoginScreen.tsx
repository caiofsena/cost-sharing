import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cssInterop } from "nativewind";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signIn } from "@/store/authSlice";
import { Divider, InputIcon } from "@/components";
import { loginSchema, type LoginFormData } from "@/schemas/authSchema";
import Logo from "../../assets/logo.svg";
import MCI from "@expo/vector-icons/MaterialCommunityIcons";

cssInterop(MCI, {
  className: {
    target: "style",
  },
});

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const dispatch = useAppDispatch();
  const { loading, loginError } = useAppSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(data: LoginFormData) {
    dispatch(signIn({ email: data.email.trim(), password: data.password }));
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="flex-1" keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center">
            <View className="h-96 justify-center items-center">
              <Logo width={64} height={64} />
              <View className="flex-row mt-2">
                <Text className="font-heading-lg text-green-base">Cost</Text>
                <Text className="font-heading-sm text-green-light">Sharing</Text>
              </View>
            </View>

            <View className="flex-1 rounded-t-3xl bg-gray-700 px-6 pt-8 pb-1">
              <Text className="mb-8 text-center font-heading-lg text-heading-lg text-gray-100">Entre no app</Text>

              {loginError ? (
                <View className="mb-4 rounded-md bg-danger-low p-3">
                  <Text className="text-center font-text-sm text-text-sm text-danger-light">{loginError}</Text>
                </View>
              ) : null}

              <View className="gap-4">
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                    <InputIcon
                      leftIcon={<MCI name="email-outline" size={20} className="color-gray-200" />}
                      placeholder="E-mail"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={fieldError?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                    <InputIcon
                      leftIcon={<MCI name="asterisk" size={20} className="color-gray-200" />}
                      placeholder="Senha"
                      secureTextEntry
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={fieldError?.message}
                    />
                  )}
                />
              </View>

              <Pressable
                className="mt-6 h-12 items-center justify-center rounded-full bg-green-base border border-green-light active:opacity-80 disabled:opacity-50"
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#0B0B0E" />
                ) : (
                  <Text className="font-label-md text-label-md text-gray-800">Entrar</Text>
                )}
              </Pressable>

              <View className="mt-6 items-center">
                <Divider />
              </View>

              <View className="flex-1 justify-end">
                <Text className="self-center font-text-sm text-text-sm text-gray-200">Ainda não tem cadastro?</Text>
                <Pressable
                  className="mt-6 h-12 items-center justify-center rounded-full bg-gray-600 border border-gray-500 active:opacity-80"
                  onPress={() => navigation.navigate("Signup")}
                >
                  <Text className="font-label-md text-label-md text-gray-200">Criar conta</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
