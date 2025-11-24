'use client'

import { getAllClasses } from "@/services/classesService"


export const Activities = () => {
    
    const clases = () => getAllClasses();
    
    return (
        <div>
            <button onClick={() => clases()}>
                Panel de actividades
            </button>
        </div>
    )
}