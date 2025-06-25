import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from 'src/modules/task/domain/dto/create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
