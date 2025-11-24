import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

export const uploadCloudinaryService = async (file: File, token: string): Promise<string> => {
  if (!CLOUD_NAME || !API_KEY) {
    throw new Error("Faltan las variables de entorno de Cloudinary");
  }

  const signatureRes = await axios.get(`${API_URL}/cloudinary/signature`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const signatureData = signatureRes.data as { signature: string; timestamp: number; folder: string };

  if (!signatureData.signature || !signatureData.timestamp || !signatureData.folder) {
    throw new Error("Datos de firma incompletos");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", API_KEY);
  formData.append("timestamp", String(signatureData.timestamp));
  formData.append("signature", signatureData.signature);
  formData.append("folder", signatureData.folder);

  const uploadRes = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return uploadRes.data.secure_url;
};



