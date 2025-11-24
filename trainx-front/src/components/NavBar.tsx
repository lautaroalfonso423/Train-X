'use client';
import {  User, LogOut, LogIn, Dumbbell } from "lucide-react";
import Image from "next/image";
import { useAuthModal } from "@/context/AuthModalContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
export function NavBar() {
  const { openLogin } = useAuthModal(); // Contexto para abrir modal
  const { user, logout } = useAuth();   // Contexto de autenticación
 const router = useRouter();
  const isLoggedIn = !!user;
 

  return (
      <header
      className="border-b sticky top-0 z-50"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/TrainX.svg"
            alt="Logo TrainX"
            width={50}
            height={50}
            className="w-10 h-10"
          />
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
              TrainX
            </h1>
            <p className="text-sm text-muted-foreground">Entrená sin límites</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
               {/* Notificaciones */}
              <button 
              onClick={() => router.push("/dashboard/user")}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition-colors">
                <Dumbbell className="w-5 h-5 text-muted-foreground" />
                <span className="text-[13px] text-muted-foreground">
                  Dashboard
                </span>
              </button>

              {/* Botón de usuario */}
              <button
                onClick={()=>router.push("/userProfile")}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition-colors"
              >
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="text-[13px] text-muted-foreground">
                  {user.name}
                </span>
              </button>

              {/* Logout */}
              <button
                onClick={logout}
                className="p-2 rounded hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-5 h-5 text-muted-foreground" />
              </button>
            </>
          ) : (
            <button
              onClick={openLogin}
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ backgroundColor: "var(--primary)", color: "var(--background)" }}
            >
              <LogIn className="w-4 h-4" />
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
}