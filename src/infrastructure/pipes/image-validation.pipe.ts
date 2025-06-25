import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    console.log(file);
    if (!file?.mimetype?.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }
    return file;
  }
}
