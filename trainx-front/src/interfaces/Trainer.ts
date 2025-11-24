export interface Trainers {
    id: string;
    name: string;
    specialization: string;
    formation: string | null;
    imageUrl: string;
    available: boolean;
    qualification: number;
}