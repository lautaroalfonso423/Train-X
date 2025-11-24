import { IsUUID } from 'class-validator';

export class AssignTrainerDto {
    @IsUUID()
    trainerId: string;
}