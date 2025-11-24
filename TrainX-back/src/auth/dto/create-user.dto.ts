import { IsString, IsEmail, MinLength, IsNotEmpty, MaxLength, Matches, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password for the user account, minimum 6 characters', example: 'securePass123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(100)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
        message: 'The password must contain at least one lowercase letter, one uppercase letter, one number, and one special character. (!@#$%^&*).',
    })
    password: string;

  @ApiProperty({ description: 'Confirm password must match password', example: 'securePass123!' })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
