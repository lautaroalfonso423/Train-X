'use client';
import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { JWTPayload, IUser } from '@/interfaces/User';
import { useAuth } from '@/context/AuthContext';

 function TokenHandlerInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const tokenFromURL = searchParams.get('token');
    if (!tokenFromURL) return;

    try {
      const decoded = jwtDecode<JWTPayload>(tokenFromURL);

      const user: IUser = {
        id: decoded.sub || '',
        name: decoded.name || 'Mi perfil',
        email: decoded.email || '',
        isAdmin: decoded.isAdmin ?? false,
        profilePicture: decoded.profilePicture || ''
      };

      // 🔹 Actualizar contexto
      setUser(user);
      setToken(tokenFromURL);

      // 🔹 Guardar en localStorage
      localStorage.setItem('token', tokenFromURL);
      localStorage.setItem('user', JSON.stringify(user));

      // 🔹 Limpiar URL para no mostrar el token
      router.replace('/dashboard/user');
    } catch (err) {
      console.error('Error decodificando token de Google:', err);
    }
  }, [searchParams, router, setUser, setToken]);

  return null;
}

export default function TokenHandler() {
  return (
    <Suspense fallback={null}>
      <TokenHandlerInner />
    </Suspense>
  );
}