import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Consultation Session' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Initial strategic planning architectural consultation',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateServiceDto extends CreateServiceDto {}
