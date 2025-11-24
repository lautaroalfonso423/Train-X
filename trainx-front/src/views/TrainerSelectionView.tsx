'use client';

import { useEffect, useState } from "react";
import { getAllTrainers, selectTrainer } from "@/services/trainersService";
import { canHaveTrainer } from "@/services/userService";
import { Trainers } from "@/interfaces/Trainer";
import { toast } from "sonner";
import { FaRegStar } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { rateTrainer } from "@/services/adminServices";

interface TrainerSelectionProps {
  selectedTrainer?: string | null;
  onTrainerAssigned: (trainerId: string) => void;
}

const TrainerSelection = ({ selectedTrainer, onTrainerAssigned }: TrainerSelectionProps) => {
  const [trainers, setTrainers] = useState<Trainers[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const [ratingValue, setRatingValue] = useState<number>(0)

  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
       
        const data = await getAllTrainers() ?? [];
        setTrainers(data);
      } catch (error) {
        
        toast.error("Error al cargar los entrenadores");
      } finally {
        // Indicamos que la carga ha terminado
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  
  if (loading) {
    return <p className="text-center text-gray-500">Cargando entrenadores...</p>;
  }

  const handleSelectTrainer = async (trainerId: string) => {
    if (!userId) {
      toast.error("Error: el usuario no está cargado todavía.");
      return;
    }
  
    setAssigning(true);
  
    try {
      const response = await selectTrainer(userId, trainerId);
      onTrainerAssigned(trainerId);
      toast.success("Entrenador asignado correctamente");
  
    } catch (error: any) {
  
      //+ ALERTA DEL ERROR 403
      if (error?.response?.status === 403) {
        toast.error("Tu plan no permite asignar un entrenador.");
        return;
      }
      toast.error("Error inesperado al asignar el entrenador");
      console.error(error);
  
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Elige tu Entrenador</h2>
        <p className="text-sm text-gray-500">
          Selecciona un entrenador disponible según tu objetivo
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            className={`overflow-hidden rounded-xl border-2 transition-all duration-200 ${
              selectedTrainer === trainer.id
                ? "border-orange-500"
                : "border-gray-300 hover:border-orange-400"
            }`}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={trainer.imageUrl}
                alt={trainer.name}
                className="w-full h-full object-cover"
              />
              {selectedTrainer === trainer.id && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-orange-500 text-black text-lg font-bold">
                  ✓
                </div>
              )}
              {!trainer.available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium">
                  No disponible
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold mb-1">{trainer.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{trainer.specialization}</p>
              <div className="flex justify-baseline p-2">
                <p>
                  <FaRegStar color="orange" />
                </p>
                <p className="text-sm text-(--foreground) mb-2 pl-2">
                  {trainer.qualification}
                </p>
              </div>

              {trainer.formation && (
                <p className="text-xs text-gray-400 mb-3 italic">
                  Formación: {trainer.formation}
                </p>
              )}

              <button
                disabled={!trainer.available || selectedTrainer === trainer.id || assigning} 
                onClick={() => handleSelectTrainer(trainer.id)}
                className={`w-full py-2 rounded-md font-semibold transition-colors duration-200 ${
                  !trainer.available
                    ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                    : selectedTrainer === trainer.id
                    ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                    : "bg-orange-500 text-black hover:bg-orange-400"
                }`}
              >
                {selectedTrainer === trainer.id
                  ? "Tu Entrenador"
                  : trainer.available
                  ? assigning
                    ? "Asignando..."
                    : "Seleccionar"
                  : "No disponible"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerSelection;
