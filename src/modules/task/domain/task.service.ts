import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PageDto } from 'src/common/dtos/page.dto';
import { PaginationMetaDto } from 'src/common/dtos/pagination-meta.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { queryBuilderWithPagination } from 'src/common/utilities/datasource.utility';
import { repositoryWithPagination } from 'src/common/utilities/repository.utility';
import { getUserContext } from 'src/common/utilities/request-context.utility';
import { FileEntity } from 'src/modules/file/domain/entities/file.entity';
import { FileRepository } from 'src/modules/file/domain/repositories/file.repository';
import { CreateTaskDto } from 'src/modules/task/domain/dto/create-task.dto';
import { UpdateTaskDto } from 'src/modules/task/domain/dto/update-task.dto';
import { TaskEntity, TaskStatusEnum } from 'src/modules/task/domain/entities/task.entity';
import { TaskRepository } from 'src/modules/task/domain/repositories/task.repository';
import { DataSource, In } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly taskRepository: TaskRepository,
    private readonly fileRepository: FileRepository,
  ) {}

  private ENTITY_NAME = 'Task';

  private createQueryBuilder() {
    return this.dataSource.createQueryBuilder(TaskEntity, 'task').leftJoinAndSelect('task.images', 'images').leftJoinAndSelect('task.owner', 'owner');
  }

  async create(userId: number, dto: CreateTaskDto) {
    const task = this.taskRepository.create({
      title: dto.title,
      description: dto.description,
      status: dto.status ?? TaskStatusEnum.INCOMPLETED,
      owner: { id: userId },
    });

    if (dto.imageIds?.length) {
      const images = await this.fileRepository.findBy({ id: In(dto.imageIds) });
      if (images.length !== dto.imageIds.length) {
        throw new BadRequestException('Some imageIds are invalid');
      }
      task.images = images;
    }

    return this.taskRepository.save(task);
  }

  // async findAllByUser(userId: number, pagination: PaginationDto) {
  //   const qb = this.createQueryBuilder().where('task.owner_id = :userId', { userId });

  //   const [items, count] = await queryBuilderWithPagination<TaskEntity>(
  //     qb,
  //     pagination,
  //     ['task.title', 'task.description'],
  //     TaskEntity.sortableFields,
  //     TaskEntity.filterableFields,
  //   ).getManyAndCount();

  //   return new PageDto(
  //     items,
  //     new PaginationMetaDto({ itemCount: count, pagination }),
  //   );
  // }

  async findAllByUser(userId: number, pagination: PaginationDto) {
    const [items, count] = await repositoryWithPagination<TaskEntity>(
      this.taskRepository,
      pagination,
      { owner: { id: userId } },
      ['title', 'description'],
      TaskEntity.sortableFields,
      TaskEntity.filterableFields,
      ['images'],
    );

    console.log(items);
    return new PageDto(items, new PaginationMetaDto({ itemCount: count, pagination }));
  }

  async findOneByIdAndUser(id: number, userId: number) {
    const task = await this.taskRepository.findOne({
      where: { id, owner: { id: userId } },
      relations: ['images'],
    });
    if (!task) {
      throw new NotFoundException(`Task ID ${id} not found or you don't have permission`);
    }

    return task;
  }

  async update(id: number, userId: number, dto: UpdateTaskDto) {
    const task = await this.findOneByIdAndUser(id, userId);
    if (!task) {
      throw new NotFoundException(`Task ID ${id} not found or you don't have permission`);
    }

    Object.assign(task, dto);

    if (dto.imageIds) {
      const images = await this.fileRepository.findBy({ id: In(dto.imageIds) });
      if (images.length !== dto.imageIds.length) {
        throw new BadRequestException('Some imageIds are invalid');
      }
      task.images = images;
    }

    return this.taskRepository.save(task);
  }

  async updateStatus(id: number, userId: number, status: TaskStatusEnum) {
    const task = await this.findOneByIdAndUser(id, userId);
    if (!task) {
      throw new NotFoundException(`Task ID ${id} not found or you don't have permission`);
    }

    if (!Object.values(TaskStatusEnum).includes(status)) {
      throw new BadRequestException(`Invalid task status: ${status}`);
    }

    task.status = status;
    return this.taskRepository.save(task);
  }

  async findByIdsAndUser(ids: number[], userId: number) {
    return this.taskRepository.find({
      where: {
        id: In(ids),
        owner: { id: userId },
      },
    });
  }

  async delete(ids: number[], userId: number) {
    const found = await this.findByIdsAndUser(ids, userId);

    if (found.length === 0) {
      throw new BadRequestException(`No ${this.ENTITY_NAME} found for user.`);
    }

    if (ids.length !== found.length) {
      throw new BadRequestException(`Unauthorized to delete some ${this.ENTITY_NAME}s.`);
    }

    return this.taskRepository.softDelete(ids);
  }
}
