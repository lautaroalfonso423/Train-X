import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateNameDto {
    @ApiProperty({
        description: 'New name of the user',
        example: 'Juan Pérez',
    })
    @IsString()
    @MinLength(2)
    name: string;
}