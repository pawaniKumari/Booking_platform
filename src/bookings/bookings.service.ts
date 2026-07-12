import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { ServiceEntity } from '../services/entities/service.entity';
import { CreateBookingDto, UpdateStatusDto } from './dto/booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    @InjectRepository(ServiceEntity)
    private serviceRepository: Repository<ServiceEntity>,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const { serviceId, bookingDate, bookingTime } = createBookingDto;

    // Rule: Booking must belong to an existing service
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
    });
    if (!service)
      throw new NotFoundException(
        `Target service (id:${serviceId}) does not exist`,
      );

    // Rule: Booking dates cannot be in the past
    const targetDate = new Date(`${bookingDate}T${bookingTime}:00`);
    if (targetDate < new Date()) {
      throw new BadRequestException(
        'Cannot create reservations in past schedules.',
      );
    }

    // Rule: Prevent duplicate bookings for the same service, date, and time
    const duplicate = await this.bookingRepository.findOne({
      where: {
        serviceId,
        bookingDate,
        bookingTime,
        status: BookingStatus.CONFIRMED,
      },
    });
    if (duplicate)
      throw new ConflictException(
        'Selected schedule already occupied.',
      );

    const booking = this.bookingRepository.create(createBookingDto);
    return this.bookingRepository.save(booking);
  }

  async findAll(queryDto: BookingQueryDto) {
    const { search, status } = queryDto;
    const page = queryDto.page ?? 1;
    const limit = queryDto.limit ?? 10;

    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.service', 'service');

    if (status) {
      queryBuilder.andWhere('booking.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(booking.customerName ILIKE :search OR booking.customerEmail ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Handle Pagination Arithmetic
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      data: items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { service: true },
    });
    if (!booking)
      throw new NotFoundException(
        `Booking verification reference ${id} missing.`,
      );
    return booking;
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto) {
    const booking = await this.findOne(id);

    // Rule: Cancelled bookings cannot be marked as completed
    if (
      booking.status === BookingStatus.CANCELLED &&
      updateStatusDto.status === BookingStatus.COMPLETED
    ) {
      throw new BadRequestException('Cancelled bookings cannot be change.');
    }

    booking.status = updateStatusDto.status;
    return this.bookingRepository.save(booking);
  }

  async cancel(id: string) {
    const booking = await this.findOne(id);
    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepository.save(booking);
  }
}
