import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';

export class UpdateActivityDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    requiresReservation?: boolean;

    @IsOptional()
    @IsInt()
    @Min(1)
    maxCapacity?: number | null;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}