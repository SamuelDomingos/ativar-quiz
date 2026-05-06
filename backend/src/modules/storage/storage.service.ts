import { Injectable, Inject } from '@nestjs/common';
import {
  STORAGE_PROVIDER,
  StorageUploadResult,
  UploadedFile,
} from './storage.interface';
import type { IStorageProvider } from './storage.interface';

@Injectable()
export class StorageService {
  constructor(
    @Inject(STORAGE_PROVIDER) private readonly provider: IStorageProvider,
  ) {}

  async upload(
    file: UploadedFile,
    folder?: string,
  ): Promise<StorageUploadResult> {
    return this.provider.upload(file, folder);
  }

  async delete(key: string): Promise<void> {
    return this.provider.delete(key);
  }

  getUrl(key: string): string {
    return this.provider.getUrl(key);
  }
}
