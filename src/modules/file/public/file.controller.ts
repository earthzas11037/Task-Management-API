import { Body, Controller, Get, Inject, Param, ParseFilePipeBuilder, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/infrastructure/pipes/image-validation.pipe';
import { CreateFileDto } from 'src/modules/file/domain/dtos/create-file.dto';
import { UploadFileUseCase } from 'src/modules/file/domain/use-cases/upload-file.use-case';

const FEATURE_NAME = 'FILE';
@Controller('files')
export class FileController {
  @Inject() private readonly UploadFileUseCase: UploadFileUseCase;

  constructor() {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(ImageValidationPipe) file: Express.Multer.File, @Body() createFileDto: CreateFileDto) {
    const data = await this.UploadFileUseCase.create(file, createFileDto);
    return { data: data.toAPIResponse() };
  }
}
