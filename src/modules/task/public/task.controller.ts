import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
  Inject,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.constants';
import { ApiPaginatedResponse } from 'src/common/decorators/pagination.decorator';
import { DeleteEntityDto } from 'src/common/dtos/delete-entity.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { UnlimitedPageSizePaginationDto } from 'src/common/dtos/unlimited-page-size.pagination.dto';
import { getUserContext } from 'src/common/utilities/request-context.utility';
import { PaginationInterceptor } from 'src/infrastructure/interceptors/pagination.interceptor';
import { CreateTaskDto } from 'src/modules/task/domain/dto/create-task.dto';
import { UpdateTaskStatusDto } from 'src/modules/task/domain/dto/update-task-status.dto';
import { UpdateTaskDto } from 'src/modules/task/domain/dto/update-task.dto';
import { TaskStatusEnum } from 'src/modules/task/domain/entities/task.entity';
import { TaskService } from 'src/modules/task/domain/task.service';

@ApiTags('Tasks')
@Controller('tasks')
@ApiBearerAuth('Authorization')
@UseInterceptors(ClassSerializerInterceptor)
export class TaskController {
  constructor(@Inject() private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto) {
    const user = getUserContext().user;
    const entity = await this.taskService.create(user.userId, dto);
    return { ...RESPONSE_MESSAGES.SUCCESS, data: entity.toAPIResponse() };
  }

  @Get(':id')
  async getOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
    const user = getUserContext().user;
    const entity = await this.taskService.findOneByIdAndUser(id, user.userId);
    return { ...RESPONSE_MESSAGES.SUCCESS, data: entity?.toAPIResponse() };
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  @ApiPaginatedResponse(PageDto)
  async getAll(@Query() pagination: UnlimitedPageSizePaginationDto) {
    const user = getUserContext().user;
    const page = await this.taskService.findAllByUser(user.userId, pagination);
    return {
      ...RESPONSE_MESSAGES.SUCCESS,
      data: page.data,
      pagination: page.pagination,
    };
  }

  @Put(':id')
  async update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number, @Body() dto: UpdateTaskDto) {
    const user = getUserContext().user;
    const entity = await this.taskService.update(id, user.userId, dto);
    return { ...RESPONSE_MESSAGES.SUCCESS, data: entity?.toAPIResponse() };
  }

  @Patch(':id/status')
  async updateStatus(@Param('id', new ParseIntPipe()) id: number, @Body() dto: UpdateTaskStatusDto) {
    const user = getUserContext().user;
    const entity = await this.taskService.updateStatus(id, user.userId, dto.status);
    return { ...RESPONSE_MESSAGES.SUCCESS, data: entity.toAPIResponse() };
  }

  @Delete()
  async delete(@Body() dto: DeleteEntityDto) {
    const user = getUserContext().user;
    const result = await this.taskService.delete(dto.ids, user.userId);
    return { ...RESPONSE_MESSAGES.SUCCESS, data: result };
  }
}
