export interface Schedules {
    id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    trainer: string;
    limit: number
}

export interface Classes {
    id: string;
    name: string;
    description: string;
    requiresReservation: boolean;
    maxCapacity: number | null;
    imageUrl: string;
    schedules: Schedules[];
}

export interface IReservation {
  id: string;
  userId: string;
  schedule: Schedules;
  createdAt: string; 
  status: "active" | "cancelled";
}