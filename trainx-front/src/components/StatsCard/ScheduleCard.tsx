import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Schedules } from "@/interfaces/Classes";
import { getAllSchedule } from "@/services/classesService";


const ScheduleCards: React.FC = () =>  {
    const [modal, setModal] = useState(false)   
    const [iconDelete, setIconDelete] = useState(false)  
    const [classes, setClasses] = useState<Schedules[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const classes = await getAllSchedule();
                console.log(classes);
                setClasses(classes);
            } catch (error) {
                console.error("Error al traer las clases: ", error);
                return [];
            }
        }
        fetchData();
    }, [])

     return (

        <div  className="min-h-screen  flex flex-col  bg-(--background) flex flex-wrap  mt-29">
                <div className="mb-3 flex flex-col gap-1 items-center">
                    <h1 className="text-4xl font-semibold text-white tracking-tight leading-tight">
                    Gestión de Clases
                    </h1>
                     <h3 className="text-lg text-gray-400 ">
                    Crea, edita y administra las clases del gimnasio
                    </h3>
                </div>
                

                <div className="w-full flex justify-end px-10 mt-6">
                    <button
                    onClick={()=> setModal(true)}
                    className="px-4 py-2 bg-orange-500 text-black rounded hover:bg-orange-600 transition"
                    >+ Nueva Clase</button>
                </div>

                <div className="flex flex-wrap justify-center gap-8 mt-15">
                { classes.map((e) => {
                
                // const requires = e.requiresReservation === "true" || e.requiresReservation === true
                return(
                    <div key={e.id}
                    className="bg-[hsl(var(--secondary))] 
                                border border-white/10 
                                rounded-2xl p-6 
                                w-full sm:w-[300px] md:w-[350px] lg:w-[380px] 
                                h-auto flex flex-col gap-4 
                                shadow-lg shadow-black/20 
                                hover:shadow-[0_6px_30px_rgba(255,255,255,0.15)] 
                                hover:scale-[1.02]
                                transition-all duration-300 ease-out"
                    >
                        <div className="flex items-center">
                       
                        <button
                            onClick={()=> setIconDelete(true)}
                            aria-label="Eliminar"
                            title="Eliminar"
                            className="ml-auto p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-transparent focus:outline-none transition active:scale-95"
                        >
                            <Trash2 size={18} />
                        </button>
                        </div>

                    <h2 className="text-2xl font-semibold text-(--primary) text-center w-full">
                        {e.trainer}
                    </h2>

                    <p className="text-gray-300 text-sm text-center leading-snug w-full italic">
                        {e.dayOfWeek}
                    </p>

                    <div className="mt-3 flex flex-col gap-2 w-full">
                        <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                        <h3 className="text-gray-400 text-xs uppercase tracking-wide">
                            Entrenador
                        </h3>
                        <span className="text-white font-medium">{e.trainer}</span>
                        </div>

                        <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                        <h3 className="text-gray-400 text-xs uppercase tracking-wide">
                            Inicio
                        </h3>
                        <span className="text-white font-medium">{e.startTime}</span>
                        </div>

                        <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                        <h3 className="text-gray-400 text-xs uppercase tracking-wide">
                            Final
                        </h3>
                        <span className="text-white font-medium">{e.endTime}</span>
                        </div>
                    </div>
                    </div>
                    )})}
                    </div>

            {iconDelete && (
                    <div className="fixed inset-0 bg-gradient-to-b from-black/0 to-black/100 flex items-center justify-center z-50">
                        <div className="relative bg-[hsl(var(--secondary))] bg-black/100 bg-blend-overlay border border-white/10 rounded-2xl p-8 w-11/12 max-w-md shadow-lg animate-fadeIn">
                        <div className="flex flex-col items-center text-center gap-6">
                            <h2 className="text-2xl font-semibold text-white">
                            Borrar Clase
                            </h2>
                            <p className="text-gray-400 text-sm">
                            Al crear una nueva clase, consulte los horarios antes de eliminar clases que tengan reservas.
                            </p>

                            <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => setIconDelete(false)}
                                className="px-5 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition duration-200"
                            >
                                Cancelar
                            </button>

                            <button
                            onClick={()=> console.log("Hola")}
                            className="px-5 py-2 rounded-xl bg-red-600/90 hover:bg-red-700 text-white font-medium transition duration-200"
                            >
                            Eliminar
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>
                )}        

            {modal && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50 
                  
                ">

                <div
                style={{
                     background: "rgba(70, 70, 70, 1)"
                }}
                className="rounded-2xl p-8 w-11/12 max-w-md relative border-none"
                onClick={(e) => e.stopPropagation()}
                >
            
                <button
                    onClick={() => setModal(false)}
                    className="absolute top-3 right-3 text-white hover:text-gray-800 transition"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                    Datos para la Clase
                </h2>

             
                            <form className="flex flex-col gap-5">
                <div>
                    <label className="block text-sm font-medium text-white mb-1">
                    Día de la Clase
                    </label>
                    <input
                    type="text"
                    name="dayOfWeek"
                    style={{
                    color: 'black',
                    background: 'rgba(255, 255, 255, 1)',
                    border: '1px solid rgba(255, 253, 253, 1)',
                }}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 
                                text-white placeholder-gray-400 
                                focus:outline-none focus:ring-2 
                                transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-1">
                    Inicio de la Clase
                    </label>
                    <input
                    type="time"
                    name="startTime"
                    style={{
                    color: 'black',
                    background: 'rgba(255, 255, 255, 1)',
                    border: '1px solid rgba(255, 253, 253, 1)',
                }}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 
                                text-white placeholder-gray-400 
                                focus:outline-none focus:ring-2 transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-1">
                    Final de la Clase
                    </label>
                    <input
                    type="time"
                    name="endTime"
                    style={{
                    color: 'black',
                    background: 'rgba(255, 255, 255, 1)',
                   border: '1px solid rgba(255, 253, 253, 1)',
                }}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 
                                text-white placeholder-gray-400 
                                focus:outline-none focus:ring-2 transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-1">
                    Entrenador
                    </label>
                    <input
                    type="text"
                    name="trainer"
                    style={{
                    color: 'black',
                    background: 'rgba(255, 255, 255, 1)',
                    border: '1px solid rgba(255, 253, 253, 1)',
                }}
                    id="requiresReservation"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 
                                text-white placeholder-gray-400 
                                focus:outline-none focus:ring-2 transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-1">
                    Actividad
                    </label>
                    <input
                    type="text"
                    name="activity"
                    style={{
                    color: 'black',
                    background: 'rgba(255, 255, 255, 1)',
                   border: '1px solid rgba(255, 253, 253, 1)',
                }}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 
                                text-white placeholder-gray-400 
                                focus:outline-none focus:ring-2  transition"
                    />
                </div>

                <button
                    type="submit"
                    className="mt-2 bg-white text-black font-medium px-4 py-2 rounded-lg 
                            hover:bg-gray-300 transition active:scale-[0.98]"
                >
                    Crear Clase
                </button>
                </form>
        </div>
    </div>
    )}
        </div>
    )
}


export default ScheduleCards