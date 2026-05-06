import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { STORAGE_PROVIDER } from './storage.interface';
import { LocalStorageProvider } from './local-storage.provider';
import { StorageService } from './storage.service';

/**
 * StorageModule selects the provider via the STORAGE_PROVIDER env var.
 *
 * Supported values:
 *   local     → saves files in ./uploads (default)
 *   aws       → AWS S3 (requires AWS_* env vars)
 *   supabase  → Supabase Storage (requires SUPABASE_* env vars)
 */
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: STORAGE_PROVIDER,
      useFactory: (config: ConfigService) => {
        const provider = config.get<string>('STORAGE_PROVIDER', 'local');

        switch (provider) {
          case 'aws':
            // return new AwsS3StorageProvider(config);
          case 'supabase':
            // return new SupabaseStorageProvider(config);
          case 'local':
          default:
            return new LocalStorageProvider(config);
        }
      },
      inject: [ConfigService],
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
