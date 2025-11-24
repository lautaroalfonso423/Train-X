import { IsString, IsIn } from 'class-validator';

export class UpdateUserStatusDto {
    @IsString()
    @IsIn(['activo', 'inactivo', 'suspendido'])
    status: string;
}