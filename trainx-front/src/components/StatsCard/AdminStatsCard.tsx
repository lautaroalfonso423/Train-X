"use client"

const AdminStatsCard: React.FC = ()=> {


        return (
                <div className="flex flex-wrap gap-8 mt-2">
    
             <div
                    className="bg-(--secondary) border border-white/10 p-6 rounded-xl 
                    w-full sm:w-[300px] md:w-[350px] lg:w-[380px] h-[220px]
                    shadow-[0_4px_20px_rgba(255,255,255,0.05)] 
                    hover:shadow-[0_6px_25px_rgba(255,255,255,0.1)] 
                    transition-all duration-300"
                >
                    <h3 className="text-gray-100">Total de Socios</h3>

                    <div className="flex items-baseline p-2">
                    <h2 className="font-bold text-3xl text-(--primary)">200</h2>
                    <p className="ml-2 text-gray-400">activos</p>
                    </div>
                </div>



             <div
                    className="bg-(--secondary) border border-white/10 p-6 rounded-xl 
                    w-full sm:w-[300px] md:w-[350px] lg:w-[380px] h-[220px]
                    shadow-[0_4px_20px_rgba(255,255,255,0.05)] 
                    hover:shadow-[0_6px_25px_rgba(255,255,255,0.1)] 
                    transition-all duration-300"
                >
                    <h3 className="text-gray-100">Clase mas Elejida</h3>

                    <div className="flex items-baseline p-2">
                    <h2 className="font-bold text-3xl text-(--primary)">Zumba</h2>
                    </div>
                </div>
    


            <div
                    className="bg-(--secondary) border border-white/10 p-6 rounded-xl 
                    w-full sm:w-[300px] md:w-[350px] lg:w-[380px] h-[220px]
                    shadow-[0_4px_20px_rgba(255,255,255,0.05)] 
                    hover:shadow-[0_6px_25px_rgba(255,255,255,0.1)] 
                    transition-all duration-300"
                >
                    <h3 className="text-gray-100">Total de Entrenadores</h3>

                    <div className="flex items-baseline p-2">
                    <h2 className="font-bold text-3xl text-(--primary)">4</h2>
                    <p className="ml-2 text-gray-400">activos</p>
                    </div>
                </div>
                </div>





        );
            
}

export default AdminStatsCard;