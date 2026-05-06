import { Injectable, Inject } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import type { IUserRepository } from './repositories/user.repository';
import { StorageService } from '../storage/storage.service';
import { UploadedFile } from '../storage/storage.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository') private readonly repository: IUserRepository,
    private readonly storageService: StorageService,
  ) {}

  async findMe(id: string) {
    return this.repository.findMe(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.repository.update(id, updateUserDto);
  }

  async remove(id: string) {
    return this.repository.remove(id);
  }

  async uploadAvatar(userId: string, file: UploadedFile) {
    const result = await this.storageService.upload(file, 'avatars');
    await this.repository.updateAvatar(userId, result.url);
    return result;
  }
}
