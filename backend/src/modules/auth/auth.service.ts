import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../user/repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async register(userData: any) {
    const exists = await this.userRepository.findByEmail(userData.email);
    if (exists) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
  }

  async login(email: string, pass: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
