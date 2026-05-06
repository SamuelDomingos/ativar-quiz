import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IUserRepository } from './user.repository';
import { User } from '../interface/user.interface';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMe(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: Partial<User>): Promise<User> {
    return this.prisma.user.create({ data: data as any });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async updateAvatar(id: string, avatar: string): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: { avatar } });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
