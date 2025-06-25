import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/modules/task/domain/entities/task.entity';

@Injectable()
export class TaskRepository extends Repository<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    repository: Repository<TaskEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  findByUser(userId: number) {
    return this.find({ where: { owner: { id: userId } }, order: { createdAt: 'DESC' } });
  }
}
