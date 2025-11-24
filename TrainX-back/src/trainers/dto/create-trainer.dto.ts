import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateTrainerDto {
    @IsString()
    name: string;

    @IsString()
    specialization: string;

    @IsOptional()
    @IsString()
    formation?: string;

    @IsString()
    imageUrl: string;

    @IsOptional()
    @IsBoolean()
    available?: boolean;

}
