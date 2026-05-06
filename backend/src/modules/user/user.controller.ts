import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Request,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile as NestUploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  async getMe(@Request() req: { user: { userId: string } }) {
    return this.userService.findMe(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/avatar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload de avatar do usuário' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Request() req: { user: { userId: string } },
    @NestUploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(req.user.userId, file as any);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar dados do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  async updateMe(
    @Request() req: { user: { userId: string } },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(req.user.userId, updateUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário por ID (admin)' })
  @ApiParam({ name: 'id', description: 'UUID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiParam({ name: 'id', description: 'UUID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }
}
