import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import sharp from 'sharp';
import { ServerConfigurationService } from 'src/modules/server-configuration/server-configuration.service';

@Injectable()
export class ImageWatermarkWithSharpPipe implements PipeTransform<Express.Multer.File, Promise<Express.Multer.File>> {
  @Inject() private readonly ServerConfigurationService: ServerConfigurationService;
  async transform(image: Express.Multer.File): Promise<Express.Multer.File> {
    image.buffer = await sharp(image.buffer)
      .resize(1000)
      .composite([
        {
          input: {
            text: {
              text: `<span color="black">${this.ServerConfigurationService.getConfig('image.watermark.text')}</span>`,
              font: 'Noto Sans Thai',
              dpi: 150,
              rgba: true,
              width: 700,
              wrap: 'word',
            },
          },
          gravity: 'center',
        },
      ])
      .toBuffer();
    return image;
  }
}
