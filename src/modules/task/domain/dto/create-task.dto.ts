import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatusEnum } from 'src/modules/task/domain/entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status?: TaskStatusEnum;

  @IsArray()
  @IsOptional()
  imageIds?: number[];
}
