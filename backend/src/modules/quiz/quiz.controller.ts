import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile as NestUploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
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

@ApiTags('Quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar um novo quiz' })
  @ApiResponse({ status: 201, description: 'Quiz criado com sucesso' })
  create(
    @Request() req: { user: { userId: string } },
    @Body() dto: CreateQuizDto,
  ) {
    return this.quizService.create(req.user.userId, dto);
  }

  @Post(':id/cover')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload da imagem de capa do quiz' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadCover(
    @Param('id', new ParseUUIDPipe()) id: string,
    @NestUploadedFile() file: Express.Multer.File,
  ) {
    return this.quizService.uploadCover(id, file as any);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os quizzes' })
  findAll() {
    return this.quizService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar quizzes do usuário autenticado' })
  findMine(@Request() req: { user: { userId: string } }) {
    return this.quizService.findByUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar quiz por ID' })
  @ApiParam({ name: 'id', description: 'UUID do quiz' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.quizService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar quiz' })
  @ApiParam({ name: 'id', description: 'UUID do quiz' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateQuizDto,
  ) {
    return this.quizService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover quiz' })
  @ApiParam({ name: 'id', description: 'UUID do quiz' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.quizService.remove(id);
  }
}
