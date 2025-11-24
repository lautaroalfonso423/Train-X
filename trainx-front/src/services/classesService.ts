import axios from "axios"
import { Classes, IReservation, Schedules } from "@/interfaces/Classes"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const getAllClasses = async (): Promise<Classes[]> => {
    try {
      const { data } = await axios.get(`${API_URL}/activities`)
      console.log(data)
      return data;
    } catch (error) {
      console.error("Error al obtenre las clases: ", error);
      return [];
    }
  };

export const getAllSchedule = async (): Promise<Schedules[]> => {
  try {
    const { data } = await axios.get(`${API_URL}/schedules`)
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error al traer los horarios: ", error);
    return [];
  }
}

export const resevedClass = async (scheduleId: string)  => {
  console.log(scheduleId);
  const token = localStorage.getItem("token");
  console.log("token obtenido: ", token)
    if(!token) {
      console.log("Error al obtener el token. Reservar clase")
      return null;
    }
    try {
      console.log("token enviado: ", token)
      const response = await axios.post(`${API_URL}/reservations/${scheduleId}`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log(response)
      return response;
    } catch (error) {
      console.error("Error al reservar la clase: ", error);
      throw new Error("error al reservar")
    }
}

export const filter = async (name: string[]): Promise<Classes[]> => {
    try {
      const response = await axios.get(`${API_URL}/activities/filter`, 
      {params: {name},
      paramsSerializer: { indexes: null }},
    );
    console.log(response);
    return response.data as Classes[];
    } catch (error) {
      console.error(error);
      throw new Error("error en filter");
    } 
}

export const getReservationsByUser = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/reservations/user/${userId}`);
    console.log(response);
    return response.data as IReservation[];
  } catch (error) {
    console.error(error);
    throw new Error("error en getClassesByUser");
  }
}

export const cancelReservation = async (reservationId: string, token: string) => {
  try {
    const response = await axios.patch(`${API_URL}/reservations/${reservationId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    );
   
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("error en cancelReservation");
  }
}
export const deleteReservation = async (reservationId: string, token: string) => {
  try {
    const response = await axios.delete(`${API_URL}/reservations/${reservationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("error en deleteReservation");
  }
}

export const getWeeklyStatus = async (userId: string) => {
  try {
    const { data } = await axios.get(`${API_URL}/reservations/user/${userId}/weekly-status`);
    return data; 
  } catch (error) {
    console.error("Error verificando estado semanal:", error);
    return { canReserveNewDay: false };
  }
};
export const canReserveOnDay = async (userId: string, scheduleId: string) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return { canReserve: false, reason: "No hay token disponible" };
    }

    const { data } = await axios.get(
      `${API_URL}/reservations/can-reserve/${userId}/${scheduleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;

  } catch (error) {
    console.error(error);
    return { canReserve: false, reason: "Alcanzaste el límite de reservas" };
  }
};