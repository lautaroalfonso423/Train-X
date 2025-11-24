import axios from "axios";
import { IUser, IAuthResponse, ILoginData, IRegisterData } from "@/interfaces/User";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const loginUser = async (data: ILoginData): Promise<IAuthResponse> => {
  const { data: response } = await axios.post<IAuthResponse>(`${API_URL}/auth/login`, data);

  return response;
};

export const registerUser = async (data: IRegisterData): Promise<IUser> => {
  const { data: response } = await axios.post<IUser>(`${API_URL}/auth/register`, data);
  console.log(data);
  
  return response;
};

export const loginWithPassport = async () =>{
  window.location.href = `${API_URL}/auth/google`;
}

