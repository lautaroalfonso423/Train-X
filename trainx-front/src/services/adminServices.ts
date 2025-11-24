import axios from "axios";
import { IUser } from "@/interfaces/User";
import { ThreeDay, FiveDay, Collection } from "@/interfaces/Plan";
import { Classes } from "@/interfaces/Classes";
import { Trainers } from "@/interfaces/Trainer";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllUsers = async (): Promise <IUser[] | null> => {
    console.log("servicio de usuarios")
    try {
        const {data} = await axios.get(`${API_URL}/users`);
            console.log(data);
            return(data);
    } catch (error) {
        console.log("Error al traer los usuario: ", error);
        return null;
    }
}

export const createActivities = async (name: string, description: string, requiresReservation: boolean, maxCapacity: number, imageUrl: string): Promise<Classes | null> => {
    const token = localStorage.getItem('token');
    console.log(token);

        if(!token) {
            console.error("No se pudo obtener el token");
            return null;
        }

        try {
            const response = await axios.post(`${API_URL}/activities`,
            {
                name: name,
                description: description,
                requiresReservation: requiresReservation,
                maxCapacity: maxCapacity,
                imageUrl: imageUrl
            }, { headers: {
                Authorization: `Bearer ${token}`
            }} 
        )
        console.log(response);
        return response.data
        } catch (error) {
            console.error("Error al crear la activiadad: ", error);
            return null;
        }
}

export const getMonthlyCollection = async (): Promise<Collection | null> => {
    console.log("recaudacion mensual")
    const token = localStorage.getItem('token');
    console.log(token)

    if(!token) {
        console.log("No se pudo encontrar el token");
        return null;
    }

    try {
        const response = await axios.get(`${API_URL}/admin/statistics/monthly-revenue`,
        {headers: {
            Authorization: `Bearer ${token}`
        }},
        )
        console.log(response);
        return response.data
    } catch (error) {
        console.error("Error al obtener los ingresos mensuales: ", error);
        return null;
    }
}

export const getThreeDayPlan = async (): Promise<ThreeDay | null> => {
    const token = localStorage.getItem('token');
    if(!token) {
        console.log("No se pudo encontrar el token");
        return null;
    }
    console.log(token);


    try {
        const response = await axios.get(`${API_URL}/admin/statistics/plans/week-3`,
            {headers: {
                Authorization: `Bearer ${token}`
            }},
        );
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error al traer los planes de tres días",);
        return null;
    }
}

export const getFiveDayPlan = async (): Promise<FiveDay | null> => {
    const token = localStorage.getItem('token');
    console.log(token);

    if(!token) {
        console.log("No se pudo encontrar el token");
        return null;
    }

    try {
        const response = await axios.get(`${API_URL}/admin/statistics/plans/week-5`,

            {headers: {
                Authorization: `Bearer ${token}`
            }},
        );
        console.log(response);
        return response.data
    } catch (error) {
        console.error("Error al traer los planes de cinco días: ", error);
        return null;
    }
}

export const deleteActivities = async (activityId: string) => {
    const token = localStorage.getItem('token');
    console.log(token);

    if(!token) {
        console.error("No se a podido encontrar el token");
        return null;
    }

    try {
        const deleteActivity = await axios.delete(`${API_URL}/activities/${activityId}`);
        console.log(deleteActivities);
        return deleteActivity
    } catch (error) {
        console.error("Error al eliminar la actividad: ", error);
        return null
    }
}

export const userStatus = async (userId: string) => {
    const token = localStorage.getItem('token');
        if(!token) {
            console.error("error al obtener el token");
            return null;
        }

    console.log(token);

    try {
        const response = await axios.patch(`${API_URL}/users/${userId}/status`,
            {headers: {
                Authorization: `Bearer ${token}`
            }}
        );
        console.log(response);
        return response;
    } catch (error) {
        console.error("Error al cambiar el estasdo del usuario: ", error);
        return null;
    }
}

export const createTrainer = async (name: string, specialization: string, formation: string, imageUrl: string, available: boolean): Promise<Trainers | null> => {
    const token = localStorage.getItem('token');
    console.log(token);
    
    if(!token) {
        console.error("Error al obtener el token");
        return null;
    }

    try {
        const response = await axios.post(`${API_URL}/trainers`,
            {
             name: name,
             specialization: specialization,
             formation: formation,
             imageUrl: imageUrl,
             available: available
            }, { headers: {
                Authorization: `Bearer ${token}`
            }}
        )
        console.log(response);
        return response.data
    } catch (error) {
        console.error("Error al crear el entrenador: ", error);
        return null;
    }
}

export const rateTrainer = async (userId: string, rating: number): Promise<Trainers | null> => {
    const token = localStorage.getItem('token');
    console.log(token);

    if(!token) {
        console.log("Error al obtener el token");
        return null;
    }

    try {
        const response = await axios.post(`${API_URL}/trainers/${userId}`,
        {
            rating: rating
        }, {headers: {
            Authorization: `Bearer ${token}`
        }}
    )
    console.log(response);
    return response.data
    } catch (error) {
        console.error("Error al calificar el entrenador", error);
        return null
    }
}

export const deleteTrainer = async (trainerId: string): Promise<Trainers | null> => {
    const token = localStorage.getItem('token');
    console.log(token);
    if(!token) {
        console.log("Error al obtener el token");
        return null
    }

    try {
        const response = await axios.delete(`${API_URL}/trainers/${trainerId}`);
        console.log(response);
        return response.data
    } catch (error) {
        console.log("Error al eliminar el entrenador: ", error);
        return null;
    }
}