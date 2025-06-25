import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FileEntity } from 'src/modules/file/domain/entities/file.entity';
import * as path from 'path';
import { StorageService } from 'src/modules/storage/storage.service';
import { CreateFileDto } from 'src/modules/file/domain/dtos/create-file.dto';
import { compact } from 'lodash';
import { getUserContext } from 'src/common/utilities/request-context.utility';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

@Injectable()
export class UploadFileUseCase {
  fileRepository: Repository<FileEntity>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
  ) {
    this.fileRepository = dataSource.getRepository(FileEntity);
  }

  async create(
    file: Express.Multer.File,
    createFileDto?: CreateFileDto,
    fileName?: string,
    detail: object = {},
    options?: { folderName?: string },
  ): Promise<FileEntity> {
    try {
      const userContext = getUserContext();
      const isImage = file.mimetype?.startsWith('image/');

      let processedFile = file;

      if (isImage) {
        const resizedBuffer = await sharp(file.buffer).resize({ width: 800 }).toFormat('png').toBuffer();

        processedFile = {
          ...file,
          buffer: resizedBuffer,
          size: resizedBuffer.length,
          mimetype: 'image/png',
          originalname: file.originalname.replace(/\.[^/.]+$/, '.png'),
        };
      }

      const uniqueFileName = this.generateUniqueFileName(fileName, processedFile.originalname || processedFile.filename);

      const fileUrl = await this.storageService.uploadImage(processedFile, {
        fileName: uniqueFileName,
        folderName: compact([userContext?.user?.userId, options?.folderName]).join('/'),
      });

      const { size, mimetype } = processedFile;
      const [name, ext] = this.extractFileNameAndExtension(uniqueFileName);

      const newFile = this.fileRepository.create({
        ...(!!createFileDto ? createFileDto : {}),
        url: fileUrl,
        name: createFileDto?.name || uniqueFileName,
        ext,
        mime: mimetype,
        createdById: userContext?.user.userId,
        token: [uuidv4(), uuidv4()].join('-'),
        detail: detail || {},
        size: size / 1024, // KB
      });

      return this.fileRepository.save(newFile);
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }

  private generateUniqueFileName(specificPrefix: string = '', originalName: string = ''): string {
    const extension = path.extname(originalName);
    // const baseName = path.basename(originalName, extension).replace(/\s/g, '_');
    const timestamp = new Date().toISOString();
    return compact([uuidv4(), specificPrefix, `${timestamp}${extension}`]).join('_');
  }

  private extractFileNameAndExtension(fileName: string): [string, string] {
    try {
      const ext = path.extname(fileName);
      const name = path.basename(fileName, ext);
      return [name, ext];
    } catch (err) {
      console.error('Error extracting file name and extension:', err);
      return ['', ''];
    }
  }
}
