import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuestionDto } from 'src/modules/question/dto/create-question.dto';

export class CreateQuizDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @ApiProperty({ type: [CreateQuestionDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
