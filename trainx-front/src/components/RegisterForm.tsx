'use client';

import { X } from "lucide-react";
import Image from "next/image";
import { useFormik } from "formik";
import { RegisterFormValues, RegisterInitialValues, RegisterValidationSchema } from "@/validators/RegisterSchema";
import { useAuthModal } from "@/context/AuthModalContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterForm({ onClose }: { onClose?: () => void }) {
const { openLogin } = useAuthModal();
const { register} = useAuth();

const router = useRouter();


const formik = useFormik<RegisterFormValues>({
    initialValues: RegisterInitialValues,
    validationSchema: RegisterValidationSchema,
    onSubmit: async (values) => {  
    try {
      await register({ 
        name: values.name, 
        email: values.email, 
        password: values.password,
        confirmPassword: values.confirmPassword
      });
      toast.success("Registro exitoso");
      onClose?.();
       setTimeout(() => {
        router.push("/login");
      }, 100);
    } catch (error: any) {
      console.error(error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Error en registro, revisa tus credenciales"
      );
    }
  },
});
  

      return (
             <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-(--card) rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-8 animate-fadeIn scrollbar-thin relative">
  {/* Botón cerrar */}
  <button
    onClick={onClose}
    className="absolute top-4 right-4 text-(--muted-foreground) hover:text-(--foreground) transition z-10"
    aria-label="Cerrar"
  >
    <X className="w-5 h-5" />
  </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/TrainX.svg"
            alt="Logo TrainX"
            width={50}
            height={50}
            className="w-10 h-10"
          />
          <h1 className="text-3xl font-bold text-(--primary) mt-3">TrainX</h1>
          <p className="text-sm text-(--muted-foreground)">Entrená sin límites</p>
        </div>


        {/* Formulario */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm text-(--muted-foreground) mb-1">Nombre</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Nombre"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`p-2 rounded-xl bg-(--background) border text-(--foreground) focus:outline-none focus:ring-2 ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-(--border) focus:ring-(--primary)"
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <span className="text-red-500 text-xs mt-1">{formik.errors.name}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm text-(--muted-foreground) mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="usuario@ejemplo.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`p-2 rounded-xl bg-(--background) border text-(--foreground) focus:outline-none focus:ring-2 ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-(--border) focus:ring-(--primary)"
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <span className="text-red-500 text-xs mt-1">{formik.errors.email}</span>
            )}
          </div>

          {/* Contraseña */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm text-(--muted-foreground) mb-1">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`p-2 rounded-xl bg-(--background) border text-(--foreground) focus:outline-none focus:ring-2 ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-(--border) focus:ring-(--primary)"
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <span className="text-red-500 text-xs mt-1">{formik.errors.password}</span>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="text-sm text-(--muted-foreground) mb-1">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`p-2 rounded-xl bg-(--background) border text-(--foreground) focus:outline-none focus:ring-2 ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-(--border) focus:ring-(--primary)"
              }`}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <span className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="w-full py-2.5 bg-(--primary) text-(--background) font-semibold rounded-xl hover:opacity-90 transition">
            Crear cuenta
          </button>
        </form>

        <p className="text-center text-sm text-(--muted-foreground) mt-6">
          ¿Ya tienes cuenta?{' '}
          <button onClick={openLogin} className="text-(--primary) hover:underline font-medium">
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
}