 'use client';
 
import { X } from "lucide-react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useFormik } from "formik";
import { LoginInitialValues, LoginFormValues, LoginValidationSchema } from "@/validators/LoginSchema";
import { useAuthModal } from "../context/AuthModalContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
export default function LoginForm({ onClose }: { onClose?: () => void }) {
const { openRegister } = useAuthModal();
  const { login, user, loginWithGoogle, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
 

useEffect(() => {
  if (user) {
    if (isAdmin) {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/user");
    }
  }
}, [user, isAdmin, router]);

  const formik = useFormik<LoginFormValues>({
    initialValues: LoginInitialValues,
    validationSchema: LoginValidationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await login({ email: values.email, password: values.password });
        toast.success("Login exitoso");
        onClose?.();
      } catch (error: any) {
        console.error(error);
        const message = error?.response?.data?.message || "Error en login, revisa tus credenciales";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGoogleLogin = () => {
   loginWithGoogle();
  };


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-(--card) rounded-3xl shadow-2xl w-full max-w-md mx-4 p-8 relative animate-fadeIn">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-(--muted-foreground) hover:text-(--foreground) transition"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/TrainX.svg"
            alt="Logo TrainX"
            width={50}
            height={50}
            className="w-10 h-10"
          />
          <h1 className="text-3xl font-bold text-(--primary) mt-3">
            TrainX
          </h1>
          <p className="text-sm text-(--muted-foreground)">
            Entrená sin límites
          </p>
        </div>

        {/* Botón Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 py-2.5 border rounded-xl transition-colors border-(--muted) text-(--foreground) bg-(--background) hover:bg-(--card) hover:text-(--muted-foreground)" 
        >
          <FcGoogle className="w-4 h-4" />
          Continuar con Google
        </button>

        {/* Separador */}
        <div className="relative text-center my-5">
          <hr className="border-(--border)" />
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-(--card) text-xs text-(--muted-foreground) px-2">
            o continúa con email
          </span>
        </div>

        {/* Formulario */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Campo Email */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm text-(--muted-foreground) mb-1"
            >
              Email
            </label>
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
              <span className="text-red-500 text-xs mt-1">
                {formik.errors.email}
              </span>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-sm text-(--muted-foreground) mb-1"
            >
              Contraseña
            </label>
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
              <span className="text-red-500 text-xs mt-1">
                {formik.errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-(--primary) text-(--background) font-semibold rounded-xl hover:opacity-90 transition"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Registro */}
        <p className="text-center text-sm text-(--muted-foreground) mt-6">
          ¿Aún no tienes cuenta?{" "}
          <button
            onClick={openRegister}
            className="text-(--primary) hover:underline font-medium"
          >
            Regístrate con email
          </button>
        </p>
      </div>
    </div>
  );
}