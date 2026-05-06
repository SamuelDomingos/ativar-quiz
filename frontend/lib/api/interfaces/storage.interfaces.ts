export interface UploadResult {
  url: string;
  key: string;
  provider: 'local' | 'aws' | 'supabase';
}

export type StorageProvider = 'local' | 'aws' | 'supabase';

export interface ImageUploadPayload {
  file: File;
}