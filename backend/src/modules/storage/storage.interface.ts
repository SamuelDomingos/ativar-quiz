export interface UploadedFile {
  fieldname: string;
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface StorageUploadResult {
  url: string;
  key: string;
  provider: 'local' | 'aws' | 'supabase';
}

export interface IStorageProvider {
  upload(file: UploadedFile, folder?: string): Promise<StorageUploadResult>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}

export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';
