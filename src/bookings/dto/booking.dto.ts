import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsOptional,
  Matches,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  @ApiProperty({ example: 'nimal' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'nimal@gmail.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: '+9412345678' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({ example: 'c4a2a9b1-7b8c-4d2e-af1a-123456789abc' })
  @IsUUID('4', { message: 'serviceId must be a valid UUID format.' })
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({ example: '2026-12-25', description: 'YYYY-MM-DD format' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date format must be YYYY-MM-DD' })
  bookingDate: string;

  @ApiProperty({ example: '14:30', description: 'HH:MM format' })
  @Matches(/^\d{2}:\d{2}$/, { message: 'Time format must be HH:MM' })
  bookingTime: string;

  @ApiProperty({ example: 'Need window seating if possible', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateStatusDto {
  @ApiProperty({ enum: BookingStatus })
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
