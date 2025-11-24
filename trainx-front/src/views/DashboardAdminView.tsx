'use client'

import AdminStatsCard from "@/components/StatsCard/AdminStatsCard"
import UserStatsCard from "@/components/StatsCard/UserStatsCard"
import { useState } from "react"
import ActivitiesCard from "@/components/StatsCard/ActivitiesCard"
import ScheduleCards from "@/components/StatsCard/ScheduleCard"
import StatisticsCard from "@/components/StatsCard/Statistics"
import TrainersCard from "@/components/StatsCard/TrainersCard"
import Statistics from "@/components/StatsCard/statisticsView"
import { Activity, Calendar, BarChart3, User, Dumbbell } from "lucide-react";

export default function DashboardAdminView() {
  const [tabSelect, setTabSelected] = useState("users")

  return (
    <div className="min-h-screen flex flex-col items-center bg-(--background) p-4 sm:p-6">
      {/* --- Cards de estadísticas --- */}
      <div className="w-full max-w-[1600px] mb-6">
        <div className="flex justify-around items-center sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatsCard />
        </div>
      </div>

      {/* --- Tabs --- */}
      <div className="w-full max-w-[1000px] flex flex-wrap justify-center gap-2 mt-8 sm:gap-4 bg-(--secondary) border border-(--border) rounded-3xl p-3 sm:p-4 mb-6">
        {[
          { key: "users", label: "Usuarios", icon: <User className="w-5 h-5 " /> },
          { key: "activities", label: "Actividades", icon: <Activity className="w-5 h-5" /> },
          { key: "schedule", label: "Clases", icon: <Calendar className="w-5 h-5" /> },
          { key: "trainer", label: "Entrenadores", icon: <Dumbbell className="w-5 h-5" /> },
          { key: "statistics", label: "Estadísticas", icon: <BarChart3 className="w-5 h-5" /> },
        ].map((tab) => (
            <button
            key={tab.key}
            onClick={() => setTabSelected(tab.key)}
            className={`flex items-center gap-2
              px-4 py-2 rounded-2xl font-semibold transition-colors duration-200
              hover:bg-(--background) hover:text-white
              ${tabSelect === tab.key ? "bg-(--primary) text-black" : "bg-(--secondary) text-white"}
            `}
          > {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- Contenido dinámico --- */}
      <div className="w-full max-w-[1600px] px-2 sm:px-4">
        {tabSelect === "users" && <UserStatsCard />}
        {tabSelect === "activities" && <ActivitiesCard />}
        {tabSelect === "schedule" && <ScheduleCards />}
        {tabSelect === "trainer" && <TrainersCard />}
        {tabSelect === "statistics" && <Statistics />}
      </div>
    </div>
  )
}
