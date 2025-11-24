'use client';

import { useEffect, useState } from "react";
import { GrStatusGood } from "react-icons/gr";
import { getAllPlans } from "@/services/plansService";
import { createPreference } from "@/services/mpService";
import { useAuth } from "@/context/AuthContext";
import { Plan } from "@/interfaces/Plan";
import { toast } from "sonner";


const SubscriptionsView: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await getAllPlans();
      setPlans(res.data);
    };
    fetchPlans();
  }, []);

const handleSubscribe = async (planId: string) => {
  try {
    console.log("🔑 Token del usuario:", token);

    if (!token) return;

  
    const preference = await createPreference(planId, token);

    if (preference?.init_point) {
      window.location.href = preference.init_point;
    } else {
      console.error("No se recibió init_point desde el backend");
    }
  } catch (error:any) {
    toast.error(error.message);
  }
};
  return (
    <div className="flex flex-wrap gap-8 mt-8">
  {plans.map((plan, index) => (
    <div
      key={index}
      className="flex flex-col bg-(--secondary) border p-6 rounded-xl hover:border-(--primary)
                 w-full sm:w-[300px] md:w-[350px] lg:w-[380px] h-[480px] relative"
    >
      <h3 className="text-xl font-bold">{plan.name}</h3>

      <div className="flex justify-baseline items-center p-2">
        <h2 className="font-bold text-3xl text-(--primary)">${plan.price}</h2>
        <p className="ml-2">/mes</p>
      </div>

      <div className="mt-6">
        {plan.features.map((feature, i) => (
        <div key={i} className="flex justify-baseline items-center m-2">
      <GrStatusGood color="orange" className="bg-(--primary)/20 rounded-lg" />
      <p className="ml-2 font-light text-(--card-foreground)">{feature}</p>
    </div>
  ))} 
  
</div>

     
      <button
      onClick={() => {handleSubscribe(plan.id)}}
        className="bg-(--primary)/80 hover:bg-(--primary)
                   px-3 py-2 rounded-xl text-black font-semibold
                   hover:shadow-2xl hover:shadow-(--muted-foreground)
                   mt-auto mb-2"
      >
        Seleccionar plan
      </button>
    </div>
  ))}
</div>
  );
};

export default SubscriptionsView;
