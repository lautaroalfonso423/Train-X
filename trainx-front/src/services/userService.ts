import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const getAllUsers = async () => {
    try {
        const { data } = await axios.get(`${API_URL}/users`);
        console.log("Usuarios: ", data);
        return data;
    } catch (error) {
        console.error("Error al traer los usuarios: ", error);
    }
};

export const getUserById = async (id: string) => {
    try {
        const { data } = await axios.get(`${API_URL}/users/${id}`);
        console.log("Usuario: ", data);
        return data;
    } catch (error) {
        console.error("Error al traer el usuario: ", error);
    }
};

export const updateProfilePicture = async (userId: string, imageUrl: string) => {
  const response = await axios.patch(`${API_URL}/users/${userId}/profile-picture`, {
    imageUrl,
  });
  return response.data;
};

export const updateUserName = async (userId: string, name: string) => {
  const response = await axios.patch(`${API_URL}/users/${userId}/name`, { name });
  return response.data;
};

export const getPlanUser = async (userId: string) => {
  try {
    const { data } = await axios.get(`${API_URL}/users/plan/${userId}`);
    console.log("Plan del usuario: ", data);
    return data;
  } catch (error) {
    console.error("Error al traer el plan del usuario: ", error);
  }
};
 
export const getTrainerUser = async (userId: string) => {
const { data } = await axios.get(`${API_URL}/users/trainer/${userId}`);
console.log(data);
return data;
}

export const canHaveTrainer = async (userId: string) => {
  const { data } = await axios.get(`${API_URL}/users/${userId}/can-have-trainer`);
  console.log(data);
  return data;
}