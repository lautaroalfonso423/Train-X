import { IsString } from 'class-validator';

export class CancelReservationDto {
    @IsString()
    userId: string;
}