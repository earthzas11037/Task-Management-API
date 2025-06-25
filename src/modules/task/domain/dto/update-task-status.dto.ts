import { IsEnum } from 'class-validator';
import { TaskStatusEnum } from 'src/modules/task/domain/entities/task.entity';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatusEnum)
  status: TaskStatusEnum;
}
