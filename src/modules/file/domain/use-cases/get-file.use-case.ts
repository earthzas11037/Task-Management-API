import { Global, Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { FileEntity } from '../entities/file.entity';

@Global()
@Injectable()
export class GetFileUseCase {
  fileRepository: Repository<FileEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.fileRepository = dataSource.getRepository(FileEntity);
  }

  async getFileById(fileId: number): Promise<FileEntity> {
    if (!fileId) throw 'fileId must be greater than 0';
    try {
      const file = await this.fileRepository.findOne({
        where: {
          id: fileId,
        },
      });

      return file;
    } catch (error) {
      console.error('Error getting file:', error);
      throw new Error('Failed to get file');
    }
  }

  async getFileByIds(fileIds: number[] = []): Promise<FileEntity[]> {
    if (!fileIds || !fileIds.length) throw 'fileId must be greater than 0';
    try {
      const files = await this.fileRepository.find({
        where: {
          id: In(fileIds),
        },
      });

      return files;
    } catch (error) {
      console.error('Error getting file:', error);
      throw new Error('Failed to get file');
    }
  }
}
