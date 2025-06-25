import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from 'src/modules/file/domain/entities/file.entity';

@Injectable()
export class FileRepository extends Repository<FileEntity> {
  constructor(
    @InjectRepository(FileEntity)
    repository: Repository<FileEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
