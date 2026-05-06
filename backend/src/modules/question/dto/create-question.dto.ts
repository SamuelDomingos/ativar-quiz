import {
  IsString,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum QuestionType {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
}

export class CreateOptionDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;
}

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty({
    required: false,
    description:
      'URL da imagem. Envie o arquivo primeiro via POST /quiz/:quizId/questions/upload-image',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ enum: QuestionType })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiProperty({ type: [CreateOptionDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  @ArrayMinSize(2)
  options: CreateOptionDto[];
}
