import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from 'src/modules/file/file.module';
import { TaskEntity } from 'src/modules/task/domain/entities/task.entity';
import { TaskRepository } from 'src/modules/task/domain/repositories/task.repository';
import { TaskService } from 'src/modules/task/domain/task.service';
import { TaskController } from 'src/modules/task/public/task.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity]), FileModule, UserModule],
  providers: [TaskRepository, TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
