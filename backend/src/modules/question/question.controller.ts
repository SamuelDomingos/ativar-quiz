import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile as NestUploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Questions')
@Controller('quiz/:quizId/questions')
export class QuestionController {
  constructor(private readonly service: QuestionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar pergunta para um quiz' })
  @ApiParam({ name: 'quizId' })
  create(
    @Param('quizId', new ParseUUIDPipe()) quizId: string,
    @Body() dto: CreateQuestionDto,
  ) {
    return this.service.create(quizId, dto);
  }

  @Post(':id/image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload de imagem para uma pergunta' })
  @ApiParam({ name: 'quizId' })
  @ApiParam({ name: 'id', description: 'UUID da pergunta' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @NestUploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadImage(id, file as any);
  }

  @Get()
  @ApiOperation({ summary: 'Listar perguntas de um quiz' })
  @ApiParam({ name: 'quizId' })
  findAll(@Param('quizId', new ParseUUIDPipe()) quizId: string) {
    return this.service.findByQuiz(quizId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover pergunta' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
