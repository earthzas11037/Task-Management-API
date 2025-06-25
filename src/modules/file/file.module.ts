import { FileRepository } from 'src/modules/file/domain/repositories/file.repository';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './domain/entities/file.entity';
import { GetFileUseCase } from 'src/modules/file/domain/use-cases/get-file.use-case';
import { UploadFileUseCase } from 'src/modules/file/domain/use-cases/upload-file.use-case';
import { StorageModule } from 'src/modules/storage/storage.module';
import { FileController } from 'src/modules/file/public/file.controller';
import { FileService } from 'src/modules/file/domain/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), StorageModule],
  providers: [FileRepository, GetFileUseCase, UploadFileUseCase, FileService],
  controllers: [FileController],
  exports: [FileRepository, GetFileUseCase, UploadFileUseCase, FileService],
})
export class FileModule {}
