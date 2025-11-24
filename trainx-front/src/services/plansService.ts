import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const getAllPlans = async () => {
  try {
    const response = axios.get(`${API_URL}/plans`)
      console.log("Planes obtnenidos: ", response);
      return response
  } catch (error) {
    console.error("Error al traer los planes: ", error)
    throw new Error("ERROR AL TRAER LOS PLANES");
  }
}