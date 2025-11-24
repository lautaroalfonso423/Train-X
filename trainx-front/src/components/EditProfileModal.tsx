
import { useState, ChangeEvent, FormEvent } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { uploadCloudinaryService } from '@/services/uploadCloudinaryService';
import { updateProfilePicture, updateUserName } from "@/services/userService";


interface EditProfileModalProps {
  onClose: () => void;
}

export function EditProfileModal({ onClose }: EditProfileModalProps) {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(user?.profilePicture || "");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };


const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!user) return;

  setLoading(true);
  try {
  
    await updateUserProfile(name,file || undefined);

    onClose();
  } catch (error) {
    console.error("Error actualizando perfil:", error);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[var(--card)] text-[var(--card-foreground)] rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[var(--input-background)] border border-[var(--border)] rounded-lg p-2 text-[var(--foreground)]"
              required
            />
          </div>

          <div className="flex flex-col items-center">
  <label className="mb-2 font-medium text-sm text-[var(--foreground)]">Foto de perfil</label>

  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[var(--primary)] cursor-pointer hover:opacity-90 transition-opacity">
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />

    {preview ? (
      <img src={preview} alt="Preview" className="object-cover w-full h-full" />
    ) : (
      <div className="flex items-center justify-center w-full h-full bg-[var(--secondary)] text-[var(--muted-foreground)] font-semibold">
        Subir
      </div>
    )}
  </div>

  <p className="mt-2 text-xs text-[var(--muted-foreground)]">Formato: JPG, PNG. Máx: 5MB</p>
</div>
          <button
            type="submit"
            className="btn-primary mt-4"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}