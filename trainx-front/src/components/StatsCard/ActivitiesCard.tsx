import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllClasses } from "@/services/classesService";
import { Classes } from "@/interfaces/Classes";
import { createActivities } from "@/services/adminServices";
// import { deleteActivities } from "@/services/adminServices";

const ActivitiesCard: React.FC = () =>  {
     const [modal, setModal] = useState(false)  
     const [iconDelete, setIconDelete] = useState(false)  
     const [activities, setActivities] = useState<Classes[]>([])
     const [activityId, setActivityId] = useState<string>()

     //+ ESTADOS PARA LA PETICION DE CREAR ACTIVIDAD

     const [name, setName] = useState<string>("");
     const [description, setDescrition] = useState<string>("");
     const [requiresReservation, setRequieresReservation] = useState<boolean>(false);
     const [maxCapacity, setMaxCapacity] = useState<number>(0);
     const [imageUrl, setImageUrl] = useState<string>("")

        useEffect(() => {
            const fetchData = async () => {
                try {
                    console.log("activities")
                    const activities = await getAllClasses()
                    console.log(activities);
                    setActivities(activities)
                } catch (error) {
                    console.error("Error al traer las actividades: ", error);
                    return [];
                }
            }
            fetchData();
        }, []);

        const handlerCreate = async (e: React.FormEvent) => {
            e.preventDefault()

            const response = await createActivities(
              name,
              description,
              requiresReservation,
              maxCapacity,
              imageUrl  
            )

            if(response) {
                setModal(false);
            }
        }

     return (

        <div  className="min-h-screen  flex flex-col  bg-(--background) flex flex-wrap  mt-29">
                <div className="mb-3 flex flex-col gap-1 items-center">
                    <h1 className="text-4xl font-semibold text-white tracking-tight leading-tight">
                    Gestión de Actividades
                    </h1>
                     <h3 className="text-lg text-gray-400 ">
                    Crea las actividades para las clases del gimnasio
                    </h3>
                </div>
                

                <div className="w-full flex justify-end px-10 mt-6">
                    <button
                    onClick={()=> setModal(true)}
                    className="px-4 py-2 bg-orange-500 text-black rounded hover:bg-orange-600 transition"
                    >+ Nueva Actividad</button>
                </div>

                <div 
                className="flex flex-wrap justify-center gap-8 mt-15 ">
                { activities.map((e) => {
                
                // const requires = e.requiresReservation === "true" || e.requiresReservation === true
                return(
                            
                    <div
                    
                        className="bg-[hsl(var(--secondary))] 
                                border border-white/10 
                                rounded-2xl p-6 
                                w-full sm:w-[300px] md:w-[350px] lg:w-[380px] 
                                h-auto flex flex-col gap-4 
                                shadow-lg shadow-black/20 
                                hover:shadow-[0_6px_30px_rgba(255,255,255,0.15)] 
                                hover:scale-[1.02]
                                transition-all duration-300 ease-out">
                        <div className="flex items-center">
                       
                        <button
                            onClick={()=> {setActivityId(e.id); setIconDelete(true); console.log(activityId)}}
                            aria-label="Eliminar"
                            title="Eliminar"
                            className="ml-auto p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-transparent focus:outline-none transition active:scale-95"
                        >
                            <Trash2 size={18} />
                        </button>
                        </div>

                        <div className="w-full flex justify-center">
                            <img
                            src={e.imageUrl}
                            alt={e.name}
                            className="w-28 h-28 object-cover rounded-xl border border-white/10 shadow-md"
                            />
                        </div>

            
                        <h2 className="text-2xl font-semibold text-(--primary) mt-2 text-center w-full">
                            {e.name}
                        </h2>

        
                        <p className="text-gray-300 text-sm text-center leading-snug w-full">
                            {e.description}
                        </p>

    
                        <div className="flex items-center justify-between w-full mt-2 px-1">
                            <h3 className="text-gray-400 text-sm uppercase tracking-wide">
                            Capacidad
                            </h3>
                            <span className="text-white font-medium">{e.maxCapacity}</span>
                        </div>

                        <div className="flex items-center justify-between w-full text-sm text-gray-400">
                            <span>Requiere reservación</span>
                            
                            <span
            
                            className={
                                
                                
                                `font-medium ${
                                e.requiresReservation ? "text-green-400" : "text-red-400"
                            }`}
                            >
                            {e.requiresReservation ? "Sí" : "No"}
                            </span>
                        </div>
                        </div>
                    )})}
                    </div>

                     {iconDelete && (
                    <div className="fixed inset-0 bg-gradient-to-b from-black/0 to-black/100 flex items-center justify-center z-50">
                        <div className="relative bg-[hsl(var(--secondary))] bg-black/100 bg-blend-overlay border border-white/10 rounded-2xl p-8 w-11/12 max-w-md shadow-lg animate-fadeIn">
                        <div className="flex flex-col items-center text-center gap-6">
                            <h2 className="text-2xl font-semibold text-white">
                            Borrar Actividad
                            </h2>
                            <p className="text-gray-400 text-sm">
                            Para borrarla, primero debe eliminar todas las clases relacionadas con esta actividad.
                            </p>

                            <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => setIconDelete(false)}
                                className="px-5 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition duration-200"
                            >
                                Cancelar
                            </button>

                            <button
                            onClick={()=> console.log("hola")}
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
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50">

                <div
                style={{
                    background: "rgba(70, 70, 70, 1)"
                }}
                className=" rounded-2xl shadow-xl p-8 w-11/12 max-w-md relative border-none"
                onClick={(e) => e.stopPropagation()}
                >
            
                <button
                    onClick={() => setModal(false)}
                    className="absolute top-3 right-3 text-white hover:text-gray-800 transition"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                    Nueva Actividad
                </h2>

                <form className="flex flex-col gap-5"
                onSubmit={handlerCreate}>
              
                    <div>
                    <label className="block text-sm font-medium text-white mb-1">
                        Imagen de la actividad
                    </label>
                    <input
                        type="file"
                        name="imageUrl"
                        style={{
                    color: 'black',
                    background: 'rgba(255, 255, 255, 1)',
                    border: '1px solid rgba(255, 253, 253, 1)',
                }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2"
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-white mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        name="name"
                        style={{
                    color: 'black',
                    background: 'rgba(255, 255, 255, 1)',
                    border: '1px solid rgba(255, 253, 253, 1)',
                }}
                        placeholder="Ej: Yoga, Crossfit, Zumba..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2"
                        onChange={(e) => setName(e.target.value)}
                    />
                    </div>

                    
                    <div>
                    <label className="block text-sm font-medium text-white mb-1">
                        Descripción
                    </label>
                    <textarea
                    style={{
                    color: 'black',
                    background: 'rgba(255, 255, 255, 1)',
                    border: '1px solid rgba(255, 253, 253, 1)',
                }}
                        placeholder="Breve descripción de la actividad"
                        name="description"
                        className="w-full border  rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2  min-h-[100px]"
                        onChange={(e) => setDescrition(e.target.value)}
                    ></textarea>
                    </div>

                
                    <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="requiresReservation"
                        id="requiresReservation"
                        onChange={(e) => setRequieresReservation(e.target.checked)}
                        className="w-5 h-5 accent-blue-600"
                    />
                    <label htmlFor="requiresReservation" className="text-white text-sm">
                        Requiere reservación
                    </label>
                    </div>

                
                    <div>
                    <label className="block text-sm font-medium text-white mb-1">
                        Máximo de capacidad
                    </label>
                    <input
                        type="number"
                        name="maxCapacity"
                        style={{
                    color: 'black',
                    background: 'rgba(255, 255, 255, 1)',
                    border: '1px solid rgba(255, 253, 253, 1)',
                }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2"
                        min="0"
                        placeholder="Ej: 20"
                        onChange={(e) => setMaxCapacity(Number(e.target.value))}
                    />
                    </div>

                    <button
                    type="submit"
                    className="mt-2 bg-white text-black font-medium px-4 py-2 rounded-lg 
                    hover:bg-gray-300 transition active:scale-[0.98]"
                >Crear Actividad</button>
            </form>
        </div>
    </div>
    )}
        </div>
    )
}


export default ActivitiesCard