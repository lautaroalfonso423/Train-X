import * as Yup from "yup";

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterInitialValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const RegisterValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres")
    .required("El nombre es obligatorio"),

  email: Yup.string()
    .transform((v) => (v ?? "").trim().toLowerCase())
    .email("El email no es válido")
    .required("El email es obligatorio"),

  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(20, "La contraseña no puede superar los 20 caracteres")
    .matches(/^\S+$/, "La contraseña no puede contener espacios")
    .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .matches(/[0-9]/, "Debe contener al menos un número")
    .matches(/[!@#$%^&*]/, "Debe contener al menos un carácter especial")
    .required("La contraseña es obligatoria"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Debes confirmar tu contraseña"),
});