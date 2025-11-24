'use client';

import { useState, useEffect } from "react";
import { ArrowRight,Check, CheckCircle, Calendar, Clock, Users, Trophy, Zap } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import LoginForm from "../components/LoginForm";
import { benefits } from "@/mocks/benefits";
import { quickStats } from "@/mocks/quickStats";  
import { plans } from "@/mocks/subscriptions";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Icons = {
  Calendar,
  Clock,
  Users,
  Trophy,
  Zap,
};


export default function HomeView() {
  const [showLogin, setShowLogin] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

useEffect(() => {
  if (!loading && user) {
    router.push("/dashboard/user");
  }
}, [loading, user, router]);

 if (loading) {
    return <p className="text-center mt-10">Cargando...</p>;
  }
  const handleOpenLogin = () => {
    setShowLogin(true);
    toast.info("Inicia sesión", { description: "Debes iniciar sesión para acceder a esta función" });
  };

  return (
    <div className="space-y-16 bg-(--background) text-(--foreground) px-6 md:px-12 py-12">

      <section className="relative max-w-7xl mx-auto h-72 md:h-96 lg:h-[32rem] rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1758448756350-3d0eec02ba37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Gimnasio TrainX"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-(--background) via-[var(--background)/90] to-[var(--background)/60]" />
        </div>

        <div className="relative px-12 py-20 md:py-28 max-w-2xl">
          <h1 className="text-[48px] md:text-[64px] font-bold mb-6 leading-tight">
            Transforma tu <span className="text-primary">Vida</span>
          </h1>
         <p className="text-[18px] text-foreground font-bold mb-8 leading-relaxed drop-shadow-[0_8px_25px_rgba(0,0,0,1)]">
            Únete a TrainX y descubre un nuevo estilo de vida. Reserva tus clases, sigue tu progreso y alcanza tus metas fitness con nuestros entrenadores expertos.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleOpenLogin}
              className="px-6 py-3 font-semibold rounded-lg flex items-center gap-2 bg-(--primary) text-(--background) hover:opacity-90 transition-all"
            >
              Comenzar Ahora
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
      
    
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="p-8 border rounded-xl shadow-md min-h-[180px] flex flex-col items-center justify-center text-center"
            style={{ borderColor: 'var(--primary)' }}
          >
            <p className="text-[32px] font-bold mb-1 text-(--primary)">{stat.value}</p>
            <p className="text-[14px] text-mute-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

     
      <section>
        <div className="text-center mb-10">
          <h2 className="text-[36px] font-bold mb-3">
            ¿Por qué elegir <span className="text-primary">TrainX</span>?
          </h2>
          <p className="text-[16px] text-muted-foreground max-w-2xl mx-auto">
            Ofrecemos una experiencia única de entrenamiento con todo lo que necesitas para alcanzar tus objetivos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = Icons[benefit.icon as keyof typeof Icons];
            return (
              <div
                key={index}
                className="p-6 border rounded-xl shadow-md transition-all hover:opacity-90 hover:[border-color:var(--primary) min-h-[220px] text-center"
                style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"  style={{ backgroundColor: 'rgba(255, 107, 0, 0.125)' }}>
                  <Icon className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                </div>
                <h3 className="text-[16px] font-semibold mb-2">{benefit.title}</h3>
                <p className="text-[14px] text-(--foreground)">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </section>
      
<section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <div className="p-8 rounded-xl shadow-md border transition-all min-h-[350px] flex items-center justify-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--card-foreground)' }}>
    <div className="flex items-start gap-6">
      <div className="flex-1">
        <h3 className="text-[24px] font-semibold mb-3 text-primary">Reserva tus Clases</h3>
        <p className="text-[14px] text-muted-foreground mb-6">
          Sistema inteligente de reservas que te permite gestionar tus turnos fácilmente. Consulta horarios, disponibilidad y recibe notificaciones.
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-[14px]">Calendario semanal interactivo</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-[14px]">Confirmación instantánea</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-[14px]">Cancelación flexible</span>
          </div>
        </div>
      </div>
      <div className="hidden md:block w-48 h-48 rounded-xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1605296867724-fa87a8ef53fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Fitness"
          width={192}
          height={192}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>

  <div className="p-8 rounded-xl shadow-md border transition-all min-h-[350px] flex items-center justify-center"  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--card-foreground)' }}>
    <div className="flex items-center gap-6">
      <div className="flex-1">
        <h3 className="text-[24px] font-semibold mb-3 text-primary">Rutinas Personalizadas</h3>
        <p className="text-[14px] text-muted-foreground mb-6">
          Nuestro chatbot inteligente te brinda rutinas adaptadas a tus objetivos: fuerza, tonificación, pérdida de peso o resistencia.
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-[14px]">Asesoramiento 24/7</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-[14px]">Planes según tu nivel</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-[14px]">Seguimiento de progreso</span>
          </div>
        </div>
      </div>
      <div className="hidden md:block w-48 h-48 rounded-xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1591291621060-89264efbeaed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Entrenamiento"
          width={192}
          height={192}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</section>
        <section>
  <div className="text-center mb-10">
    <h2 className="text-[32px] text-primary font-semibold mb-2">Planes de Suscripción</h2>
    <p className="text-[16px] text-muted-foreground">
      Elige el plan que mejor se adapte a tu rutina de entrenamiento
    </p>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
    {plans.map((plan, index) => (
      <div
        key={index}
        className="p-6 rounded-2xl shadow-lg flex flex-col justify-between bg-(--card) text-(--card-foreground) transition-transform duration-300 ease-out hover:shadow-2xl hover:scale-105"
      >
        
          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
          <p className="text-[32px] font-semibold text-(--primary) mb-1">
            ${plan.price.toFixed(2)}
          </p>
          <p className="text-md text-muted-foreground mb-4">{plan.frequency}</p>

          <ul className="mb-4 space-y-1 text-sm">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                 <CheckCircle className="w-5 h-5 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
       

      </div>
    ))}
  </div>
</section>
      
        <section>
          <div
            className="p-12 text-center border-2 rounded-xl transition-all hover:border-color:(--primary)"
            style={{ borderColor: 'var(--primary)',  backgroundColor: 'rgba(255, 107, 0, 0.0625' }}
          >
            <h2 className="text-[32px] font-bold mb-4">¿Listo para empezar?</h2>
            <p className="text-[16px] text-muted-foreground mb-8 max-w-2xl mx-auto">
              Únete a TrainX hoy mismo y comienza tu transformación. Nuestros expertos te guiarán en cada paso del camino.
            </p>
            <div className="flex justify-center">
            <button
              onClick={handleOpenLogin}
              className="px-6 py-3 font-semibold rounded-lg flex items-center gap-2 bg-(--primary) text-(--background) hover:opacity-90 transition-all"
            >
              Comenzar Mi Transformación
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
          </div>
        </section>

        {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
    
    </div>
  );
}
