import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Answers')
@Controller('answers')
export class AnswerController {
  constructor(private readonly service: AnswerService) {}

  @Post()
  @ApiOperation({ summary: 'Responder uma pergunta' })
  submit(@Body() dto: SubmitAnswerDto) {
    return this.service.submit(dto);
  }

  @Get('question/:questionId')
  @ApiOperation({ summary: 'Listar respostas de uma pergunta' })
  getByQuestion(@Param('questionId', new ParseUUIDPipe()) questionId: string) {
    return this.service.getByQuestion(questionId);
  }
}
