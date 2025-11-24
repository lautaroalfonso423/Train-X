'use client';
import { createContext, useContext, useState, ReactNode } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

type AuthFormType = "login" | "register" | null;

interface AuthModalContextProps {
  activeForm: AuthFormType;
  openLogin: () => void;
  openRegister: () => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextProps | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [activeForm, setActiveForm] = useState<AuthFormType>(null);

  const openLogin = () => setActiveForm("login");
  const openRegister = () => setActiveForm("register");
  const closeModal = () => setActiveForm(null);

  return (
    <AuthModalContext.Provider value={{ activeForm, openLogin, openRegister, closeModal }}>
      {children}

      {activeForm === "login" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <LoginForm onClose={closeModal} />
        </div>
      )}
      {activeForm === "register" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <RegisterForm onClose={closeModal} />
        </div>
      )}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error("useAuthModal must be used within an AuthModalProvider");
  return context;
}