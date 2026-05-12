import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().required("E-mail é obrigatório").email("Formato de e-mail inválido"),
  password: yup.string().required("Senha é obrigatória").min(8, "Mínimo de 8 caracteres"),
});

export const signupSchema = yup.object({
  name: yup.string().required("Nome é obrigatório").min(2, "Mínimo de 2 caracteres"),
  email: yup.string().required("E-mail é obrigatório").email("Formato de e-mail inválido"),
  password: yup.string().required("Senha é obrigatória").min(8, "Mínimo de 8 caracteres"),
  confirmPassword: yup
    .string()
    .required("Confirmação de senha é obrigatória")
    .oneOf([yup.ref("password")], "As senhas não coincidem"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type SignupFormData = yup.InferType<typeof signupSchema>;
