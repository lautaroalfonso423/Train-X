import { getAllUsers } from "@/services/userService";
import { Search, CheckCircle, Ban, Timer, UserCheck2Icon, UserX2 } from "lucide-react";
import { useEffect, useState } from "react";
import { userStatus } from "@/services/adminServices";
interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  payment: [{ plan: string; status: string }];
  trainer: string;
  status: string;
}

const UserStatsCard: React.FC = () => {
  const [active, setActive] = useState(false);
  const [inactive, setInactive] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string>("")

  //+ ESTADO PARA EL PAGINADO

  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const usersPerPage = 10;

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(users.length / usersPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const Alluser = await getAllUsers();
        setUsers(Alluser);
      } catch (error) {
        console.error("Error al traer los usuarios: ", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-(--background) mt-10 px-4 sm:px-6 lg:px-10">
      <div className="mb-3 flex flex-col gap-1 text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold text-white">Gestión de Usuarios</h1>
        <h3 className="text-gray-400 text-sm sm:text-lg">Administra socios, planes y pagos</h3>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex flex-col bg-(--secondary) border border-transparent p-4 sm:p-6 rounded-xl w-full max-w-7xl mx-auto mt-6 shadow-[0_4px_20px_rgba(255,255,255,0.05)]">
        {/* BUSCADOR */}
        <div className="flex justify-between items-center">
        <div className="relative w-2xl mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar..."
            className="pr-4 py-2 w-full rounded-lg border bg-white/5 text-white placeholder-gray-400"
            style={{ paddingLeft: "2.9rem" }}
          />
        </div>

        <div className="flex justify-center items-center gap-4 text-white">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="px-3 py-2 bg-(--card)  hover:bg-(--card)/70 rounded-lg disabled:opacity-40"
        >
          Anterior
        </button>

        <span className="text-sm">
          Página {currentPage} de {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="px-3 py-2 bg-(--card) hover:bg-(--card)/70 rounded-lg disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>

        </div>
        

        {/* ENCABEZADOS (solo desktop) */}
        <div className="hidden lg:grid grid-cols-5 text-white font-semibold text-center py-3 bg-white/10 border border-white/20 rounded-t-xl">
          <div>Usuario</div>
          <div>Plan</div>
          <div>Pago</div>
          <div>Entrenador</div>
          <div>Estado</div>
        </div>

        {/* FILAS */}
        {currentUsers.map((e, i) => (
          <div
            key={i}
            className="grid grid-cols-1 lg:grid-cols-5 gap-4 text-white p-4 border-b border-white/10 bg-white/5 rounded-lg lg:rounded-none lg:bg-transparent lg:border-none"
          >
            {/* USUARIO */}
            <div>
              <span className="font-medium block">{e.name}</span>
              <span className="text-gray-300 text-sm block">{e.email}</span>
            </div>

            {/* PLAN */}
            <div className="lg:text-center">
              <span className="text-[hsl(var(--primary))]">
                {e.payment?.[0]?.plan ?? "-"}
              </span>
            </div>

            {/* PAGO */}
            <div className="flex lg:justify-center items-center gap-2">
              {e.payment?.[0]?.status === "active" && (
                <>
                  <CheckCircle className="text-green-400" />
                  <span className="text-green-400 text-sm">Activo</span>
                </>
              )}
              {e.payment?.[0]?.status === "pending" && (
                <>
                  <Timer className="text-yellow-400" />
                  <span className="text-yellow-400 text-sm">Pendiente</span>
                </>
              )}
              {e.payment?.[0]?.status === "cancelled" && (
                <>
                  <Ban className="text-red-400" />
                  <span className="text-red-400 text-sm">Cancelado</span>
                </>
              )}
            </div>

            {/* ENTRENADOR */}
            <div className="lg:text-center">{e.trainer ?? "-"}</div>

            {/* ESTADO */}
            <div className="flex items-center gap-2 lg:justify-center">
              {e.status === "active" && (
                <>
                  <UserCheck2Icon className="text-green-400" />
                  <span className="text-green-400 text-sm">{e.status}</span>
                  <button
                    onClick={() => {setActive(true), setUserId(e.id)}}
                    className="p-1 hover:bg-white/10 rounded-full"
                  >
                    <Ban className="w-5 h-5 text-gray-300 hover:text-white" />
                  </button>
                </>
              )}
              {e.status === "inactive" && (
                <>
                  <UserX2 className="text-red-400" />
                  <span className="text-red-400 text-sm">{e.status}</span>
                  <button
                    onClick={() => setInactive(true)}
                    className="p-1 hover:bg-white/10 rounded-full"
                  >
                    <Ban className="w-5 h-5 text-gray-300 hover:text-white" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL ACTIVE */}
      {active && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-(--secondary) border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-2xl font-semibold text-white text-center">Inhabilitar cuenta</h2>
            <p className="text-gray-400 text-center mt-2 text-sm">Esta acción desactivará el acceso del usuario.</p>
            <div className="flex gap-4 mt-6 justify-center">
              <button
                onClick={() => setActive(false)}
                className="px-5 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                Cancelar
              </button>
              <button className="px-5 py-2 rounded-xl bg-red-600 text-white"
              onClick={() => userStatus(userId)}>Inhabilitar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INACTIVE */}
      {inactive && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-(--secondary) border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-2xl font-semibold text-white text-center">¿Deseas reactivar esta cuenta?</h2>
            <p className="text-gray-400 text-center mt-2 text-sm">El usuario volverá a tener acceso.</p>
            <div className="flex gap-4 mt-6 justify-center">
              <button
                onClick={() => setInactive(false)}
                className="px-5 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                Cancelar
              </button>
              <button className="px-5 py-2 rounded-xl bg-emerald-600 text-white">Reactivar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatsCard;
