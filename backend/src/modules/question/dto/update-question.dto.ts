import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateOptionDto, CreateQuestionDto } from './create-question.dto';

export class UpdateOptionDto extends PartialType(CreateOptionDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;
}

export class UpdateQuestionDto extends PartialType(
  OmitType(CreateQuestionDto, ['options'] as const),
) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ type: [UpdateOptionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOptionDto)
  options?: UpdateOptionDto[];
}
