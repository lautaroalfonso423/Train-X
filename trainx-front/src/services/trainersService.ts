import axios from "axios";
import { Trainers } from "@/interfaces/Trainer";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const getAllTrainers = async (): Promise<Trainers[]> => {
    try {
      const response = await axios.get<Trainers[]>(`${API_URL}/trainers`);
      console.log("Entrenadores obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los entrenadores:", error);
      return [];
    }
  };

  export const selectTrainer = async (userId: string, trainerId: string) => {
    const token = localStorage.getItem("token")
    console.log(token);

    if(!token) {
      console.log("No se pudo encontrar el token")
      return null;
    } 

    try {
      console.log("userId: ", userId,"trainerId: ", trainerId
      )
      const response = await axios.patch(`${API_URL}/users/${trainerId}/trainer`, 
      {},
      {
        headers: {
          Authorization : `Bearer ${token}`
        }
      }
      )
      return response.data;
    } catch (error) {
      console.error("Error al seleccionar el entrenador:", error);
      throw error;
    }
  };