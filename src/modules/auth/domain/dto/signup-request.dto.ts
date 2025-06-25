import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPassword } from 'src/infrastructure/validation/strong-password.validator';

export class SignUpRequestDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({ message: 'Password does not meet security requirements.' })
  password: string;
}
