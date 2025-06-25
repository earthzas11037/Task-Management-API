import { IsOptional, IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsOptional()
  name: string;
}
