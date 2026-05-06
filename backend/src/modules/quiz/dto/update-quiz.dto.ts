import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { CreateQuizDto } from './create-quiz.dto';
import { UpdateQuestionDto } from 'src/modules/question/dto/update-question.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateQuizDto extends PartialType(
  OmitType(CreateQuizDto, ['questions'] as const),
) {
  @ApiProperty({ type: [UpdateQuestionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  questions?: UpdateQuestionDto[];
}
