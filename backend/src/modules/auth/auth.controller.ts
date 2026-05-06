import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

import { ApiProperty, PartialType } from '@nestjs/swagger';

class AuthDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string = '';

  @ApiProperty({ example: 'strongPassword123' })
  password: string = '';

  @ApiProperty({ example: 'John Doe', required: false })
  name?: string = '';

  email: string = '';
  password: string = '';
  name?: string = '';
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  async register(@Body() dto: AuthDto): Promise<any> {
    return await this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto): Promise<any> {
    return await this.authService.login(dto.email, dto.password);
  }
}
