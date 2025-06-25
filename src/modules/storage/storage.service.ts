import { Inject, Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';
import * as path from 'path';
import { compact } from 'lodash';
import { ServerConfigurationService } from '../server-configuration/server-configuration.service';
import config from 'src/config/config';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucketName: string;
  private localDirectory: string;

  private initialized: boolean = false;

  constructor(private readonly ServerConfigurationService: ServerConfigurationService) {
    this.init();
  }

  private init() {
    // if (this.initialized) return;
    const serviceAccount = JSON.parse(
      this.ServerConfigurationService.getConfig('gcp.storage.service.account') || config.get().storage.gcpServiceAccount || '{}',
    );

    this.storage = new Storage({
      credentials: serviceAccount, // Load the credentials from the JSON
    });

    this.bucketName = this.ServerConfigurationService.getConfig('gcp.storage.bucket.name') || config.get().storage.gcpBucketName;
    this.localDirectory = this.ServerConfigurationService.getConfig('local.storage.directory.name') || config.get().storage.localDirectory || './upload';
    // this.initialized = true;
  }

  private getStoragePath(fileName: string): string {
    return path.join(this.localDirectory, fileName);
  }

  private ensureLocalDirectoryExists(): void {
    if (!fs.existsSync(this.localDirectory)) {
      fs.mkdirSync(this.localDirectory, { recursive: true });
    }
  }

  async uploadImage(file: Express.Multer.File, options: { fileName?: string; folderName?: string }): Promise<string> {
    this.init();
    const uniqueFileName = options.fileName || this.generateUniqueFileName(file.originalname);

    if (this.bucketName) {
      return this.uploadToGCS(file, { fileName: uniqueFileName, folderName: options.folderName });
    } else {
      return this.uploadToLocal(file, uniqueFileName);
    }
  }

  private generateUniqueFileName(originalName: string): string {
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Replace forbidden characters
    return `${baseName}-${timestamp}${extension}`;
  }

  private async uploadToGCS(file: Express.Multer.File, options: { fileName: string; folderName?: string }): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const folderPath =
        compact([
          this.ServerConfigurationService.getConfig('gcp.storage.bucket.path') || config.get().storage.gcpBucketPath || undefined,
          options.folderName,
        ]).join('/') || '';

      // If folder path is provided, prepend it to the file name
      const fullFileName = folderPath ? `${folderPath}/${options.fileName}` : options.fileName;
      const blob = bucket.file(fullFileName);
      const blobStream = blob.createWriteStream();

      return new Promise((resolve, reject) => {
        blobStream.on('error', (err) => {
          reject(err);
        });

        blobStream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${fullFileName}`;
          resolve(publicUrl);
        });

        blobStream.end(file.buffer);
      });
    } catch (err) {
      throw new Error('Failed to upload to GCS');
    }
  }

  async uploadToGCSFromBlob(fileBlob: Blob, options: { fileName: string; folderName?: string }): Promise<string> {
    this.init();
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const folderPath =
        compact([
          this.ServerConfigurationService.getConfig('gcp.storage.bucket.path') || config.get().storage.gcpBucketPath || undefined,
          options.folderName,
        ]).join('/') || '';

      // If folder path is provided, prepend it to the file name
      const fullFileName = folderPath ? `${folderPath}/${options.fileName}` : options.fileName;
      const fileBuffer = Buffer.from(await fileBlob.arrayBuffer());
      const blob = bucket.file(fullFileName);
      blob.save(
        fileBuffer,
        {
          contentType: 'application/octet-stream',
        },
        (error) => {
          console.error(error);
        },
      );

      const blobStream = blob.createWriteStream();

      return new Promise((resolve, reject) => {
        blobStream.on('error', (err) => {
          console.error(err);
          reject(err);
        });

        blobStream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${fullFileName}`;
          resolve(publicUrl);
        });

        blobStream.end(fileBuffer);
      });
    } catch (err) {
      console.error(err);
      throw new Error('Failed to upload to GCS');
    }
  }

  private async uploadToLocal(file: Express.Multer.File, fileName: string): Promise<string> {
    try {
      this.ensureLocalDirectoryExists();
      const filePath = this.getStoragePath(fileName);

      fs.writeFileSync(filePath, file.buffer);

      return `${this.localDirectory}/${fileName}`;
    } catch (err) {
      throw new Error('Failed to upload locally');
    }
  }
}
