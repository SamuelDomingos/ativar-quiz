import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Nome do usuário' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'E‑mail do usuário' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Avatar do usuario' })
  @IsOptional()
  @IsString()
  avatar?: string;
}
