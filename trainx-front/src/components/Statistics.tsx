'use client'

import { getThreeDayPlan, getMonthlyCollection, getFiveDayPlan } from "@/services/adminServices"

export const Statistics = () => {
    return (
        <div className="grid grid-cols-3">
            <h1>
                Estadisticas
            </h1>

            <div>
                <button onClick={() => getMonthlyCollection()}>
                    recaudacion
                </button>
            </div>
            <div>
                <button onClick={() => getThreeDayPlan()}>
                    tres días
                </button>
            </div>
            <div>
                <button onClick={() => getFiveDayPlan()}>
                    cinco días
                </button>
            </div>
        </div>
    )
}