import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateStatusDto } from './dto/booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto'; // Clean split! Imported from your separate query file
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Booking Interface')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Extract paginated ledger data matrix with advanced filtering and search features (Auth required)',
  })
  findAll(@Query() queryDto: BookingQueryDto) {
    return this.bookingsService.findAll(queryDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create a booking entry (Public Access Point)' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Query specific reservation metric details by ID (Auth required)',
  })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Modify processing state variables (Auth required)',
  })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, updateStatusDto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking status lifecycle configuration' })
  cancel(@Param('id') id: string) {
    return this.bookingsService.cancel(id);
  }
}
