import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import _ from 'lodash';
import { FileRepository } from './repositories/file.repository';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FileService {
  @Inject() private readonly dataSource: DataSource;
  @Inject() private readonly FileRepository: FileRepository;

  private ENTITY_NAME = 'File';

  getFileByToken(token: string, userId: number): Promise<FileEntity> {
    return this.FileRepository.findOne({
      where: {
        token,
        createdBy: { id: userId },
      },
    });
  }
}
