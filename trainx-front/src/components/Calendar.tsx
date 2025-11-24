  'use client';

  import { useState, useEffect } from "react";
  import { toast } from "sonner";
  import { getAllClasses, resevedClass, filter as filterClasses, filter, getWeeklyStatus, canReserveOnDay } from "@/services/classesService";
  import { Classes } from "@/interfaces/Classes";
  import Image from "next/image";
  import { useAuth } from "@/context/AuthContext";
  import { getPlanUser } from "@/services/userService";

  interface CalendarClass {
    id: string;
    name: string;
    time: string;
    instructor: string;
    booked: number;
    capacity: number;
    description: string;
    imageUrl: string;
    limit: number
  }

  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie"];

  const dayTranslations: Record<string, string> = {
    Lunes: "Lun",
    Martes: "Mar",
    Miercoles: "Mié",
    Jueves: "Jue",
    Viernes: "Vie",
  };

  const CalendarView = () => {
    const [scheduleData, setScheduleData] = useState<{ [key: string]: CalendarClass[] }>({});
    const [selectedClass, setSelectedClass] = useState<CalendarClass | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const { user} = useAuth();

    const filtros = ["CrossFit", "Zumba", "Pilates", "Telas"];

    // Función para agrupar clases por día
    const groupClassesByDay = (classes: Classes[]) => {
      const grouped: { [key: string]: CalendarClass[] } = {};

      classes.forEach((cls) => {
        cls.schedules.forEach((sch) => {
          const day = dayTranslations[sch.dayOfWeek];
          if (!day) return;

          if (!grouped[day]) grouped[day] = [];

          grouped[day].push({
            id: sch.id,
            name: cls.name,
            time: sch.startTime,
            instructor: sch.trainer,
            booked: 0,
            capacity: cls.maxCapacity ?? 0,
            description: cls.description,
            imageUrl: cls.imageUrl,
            limit: sch.limit
          });
        });
      });

      return grouped;
    };

    // Cargar todas las clases al inicio
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data: Classes[] = await getAllClasses();
          setScheduleData(groupClassesByDay(data));
        } catch (error) {
          toast.error("Error al cargar las actividades");
        }
      };

      fetchData();
    }, []);

    // Manejo de filtro
    const handleFilterClick = async (filtro: string) => {
      let newFilters;
    
      if (activeFilters.includes(filtro)) {
        newFilters = activeFilters.filter(f => f !== filtro);
      } else {
        newFilters = [...activeFilters, filtro];
      }
    
      setActiveFilters(newFilters);
    
      try {
        let classes: Classes[];
        if (newFilters.length > 0) {
          classes = await filter(newFilters); // tu servicio debe aceptar arrays
        } else {
          classes = await getAllClasses();
        }
        setScheduleData(groupClassesByDay(classes));
      } catch (error) {
        toast.error("Error al filtrar las clases");
      }
    };
    const handleReserve = async () => {
  try {
    
    const planInfo = await getPlanUser(user!.id);

    if (!planInfo || planInfo.status !== "active") {
      toast.error("Necesitas un plan activo para reservar.");
      return;
    }

    const dayCheck = await canReserveOnDay(user!.id, selectedClass!.id);

    if (!dayCheck!.canReserve) {
      toast.error(dayCheck!.reason);
      return;
    }

    await resevedClass(selectedClass!.id);

    toast.success("Reserva creada con éxito");
    setIsOpen(false);

  } catch (error) {
    toast.error("No se pudo realizar la reserva");
  }
};
    
  
    return (
        <div>
          <div>
            {/* Botones de filtro */}
              <div className="flex justify-end items-center mb-4">
                {filtros.map((filtro) => (
                <button
                  key={filtro}
                  onClick={() => handleFilterClick(filtro)}
                  className={`w-sm p-2 mx-2 rounded-xl transition-colors hover:border-[1px] hover:border-(--border) ${
                  activeFilters.includes(filtro)
                  ? "bg-(--primary) text-white"
                  : "bg-(--card) hover:bg-(--background)"
                  }`}
                >
              {filtro}
            </button>
      ))}
    </div>
        </div>
        <div className="p-6 md:p-12 bg-(--secondary) border border-(--muted-foreground) rounded-2xl shadow-lg my-6 mx-6 relative">

        {/* Título */}
        <div className="flex items-center justify-between mb-8 px-2 md:px-6">
          <h3 className="text-2xl md:text-3xl font-semibold text-(--primary)">Calendario Semanal</h3>
        </div>

        {/* Grilla del calendario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 px-2 md:px-6">
          {weekDays.map((day) => (
            <div key={day} className="space-y-3">
              <div className="text-center pb-3 border-b border-(--muted-foreground)">
                <p className="text-sm md:text-base font-semibold text-(--primary)">{day}</p>
              </div>

              <div className="space-y-3">
                {scheduleData[day]?.map((classData) => {
                  const spotsLeft = classData.capacity - classData.booked;
                  const isAlmostFull = spotsLeft <= 3;

                  return (
                    <button
                      key={classData.id}
                      onClick={() => {
                        setSelectedClass(classData);
                        setIsOpen(true);
                      }}
                      className="w-full text-left p-4 md:p-5 rounded-2xl border border-(--muted-foreground) hover:border-(--primary) transition-colors bg-[var(--secondary)] hover:bg-(--primary)/10"
                    >
                      <p className="text-base md:text-xl font-medium truncate text-(--card-foreground)">
                        {classData.name}
                      </p>
                      <p className="text-sm text-(--muted-foreground)">{classData.time}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-2 flex-1 bg-(--muted-foreground) rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isAlmostFull ? "bg-yellow-500" : "bg-(--primary)"}`}
                            style={{ width: `${(classData.limit / classData.capacity) * 100}%` }}
                          />
                        </div>
                        <p className="text-[11px] md:text-xs text-(--muted-foreground)">{spotsLeft}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      {/* Modal de reserva */}
  {isOpen && selectedClass && (
    <div className="fixed inset-0 bg-(--background)/85 flex items-center justify-center z-50">
      <div className="bg-(--secondary) rounded-2xl shadow-xl p-4 md:p-6 w-[90%] max-w-[360px] md:max-w-[520px] relative animate-scaleIn">

        {/* Botón de cierre */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-3 font-bold text-(--foreground) hover:text-black text-xl"
        >
          ✕
        </button>

        {/* Contenido del modal */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center text-center gap-4">
          
          {/* Imagen y nombre */}
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-(--primary)">
              {selectedClass.name}
            </h2>
            <Image
              src={selectedClass.imageUrl}
              alt={selectedClass.name}
              width={300}
              height={200}
              className="w-full object-cover rounded-xl my-3"
            />
          </div>

          {/* Información y botón */}
          <div className="flex flex-col text-center md:text-left px-1">
            <p className="text-(--foreground) mb-1 text-sm md:text-base">
              Horario: <span className="font-medium">{selectedClass.time}</span>
            </p>
            <p className="text-(--foreground) mb-2 text-sm md:text-base">
              Instructor: <span className="font-medium">{selectedClass.instructor}</span>
            </p>

            <p className="text-xs md:text-sm text-(--muted-foreground) mb-5 px-2 md:px-0">
              {selectedClass.description}
            </p>

            {/* Botón de reserva */}
            <button
              onClick={() => handleReserve()}
                
              className="w-full bg-(--primary) text-white py-2 rounded-xl hover:bg-(--primary)/90 transition"
            >
              Reservar clase
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

      </div>
      </div>
    );
  };

  export default CalendarView;
