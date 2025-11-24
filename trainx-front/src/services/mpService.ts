import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const createPreference = async (planId: string, token: string) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/mp/preference/${planId}`,
      { },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data; // contiene init_point
  } catch (error: any) {
    if (error.response?.status === 409) {
      // Usuario ya tiene el plan
      throw new Error("Ya tenés un plan activo"); 
    }
    console.error("❌ Error al crear la preferencia:", error);
    throw error;
  }
};