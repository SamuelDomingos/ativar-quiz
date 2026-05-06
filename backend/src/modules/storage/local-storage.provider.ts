import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import {
  IStorageProvider,
  UploadedFile,
  StorageUploadResult,
} from './storage.interface';

@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  private readonly logger = new Logger(LocalStorageProvider.name);
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.uploadDir = this.config.get<string>('UPLOAD_DIR', './uploads');
    this.baseUrl = this.config.get<string>('BASE_URL', 'http://localhost:4001');
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`Upload directory created: ${this.uploadDir}`);
    }
  }

  async upload(
    file: UploadedFile,
    folder = 'general',
  ): Promise<StorageUploadResult> {
    const ext = path.extname(file.originalname);
    const key = `${folder}/${randomUUID()}${ext}`;
    const dest = path.join(this.uploadDir, key);

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, file.buffer);

    this.logger.log(`File saved locally: ${key}`);
    return { url: this.getUrl(key), key, provider: 'local' };
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      this.logger.log(`File deleted: ${key}`);
    }
  }

  getUrl(key: string): string {
    return `${this.baseUrl}/uploads/${key}`;
  }
}
