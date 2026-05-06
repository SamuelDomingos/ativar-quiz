import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../interface/user.interface';

export interface IUserRepository {
  findMe(id: string): Promise<User>;
  update(id: string, data: UpdateUserDto): Promise<User>;
  remove(id: string): Promise<User>;
}
