import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from 'src/modules/user/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY_QUIZ || "SECRET_KEY_QUIZ_AQUI",
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.userRepository.findOne(payload.sub);
    if (!user) {
      return null;
    }
    return { userId: user.id, email: user.email };
  }
}
